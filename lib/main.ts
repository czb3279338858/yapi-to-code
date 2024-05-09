import { GetProjectResponse, getProject } from "./request/api/project/get/get"

import { GetInterfaceResponse, getInterface } from "./request/api/interface/get/get"
import { GetListMenuResponse, getListMenu } from "./request/api/interface/list_menu/get"
import { JSONSchema4 } from 'json-schema'
const { compile } = require('json-schema-to-typescript')
import { selfAxios } from "./request"

const { existsSync, mkdirSync, promises } = require('fs')
const { join, dirname, posix } = require('path')
/**
 * 配置文件类型
 */
export interface Config {
  /** 获取填充到文件中的文本 */
  getCode: (
    arg: {
      project: GetProjectResponse,
      menu: GetListMenuResponse[0],
      request: GetInterfaceResponse,
      jsonSchemaToType: typeof jsonSchemaToType,
      getLastPath: typeof getLastPath,
      getUrl: typeof getUrl,
      getJSONSchema4: typeof getJSONSchema4,
      getSecondParam: typeof getSecondParam
    }
  ) => Promise<string>,
  /** 获取文件的输出路径和文件名 */
  getOutPath: (
    arg: {
      project: GetProjectResponse,
      menu: GetListMenuResponse[0],
      request: GetInterfaceResponse
    }
  ) => string,
  /** yapi的域名 */
  serverOrigin: string,
  /** 需要导出的项目参数 */
  projectList: {
    /** 项目token，当没有传menuIds和ids时，获取该项目下的所有接口 */
    token: string,
    /** 非必传，获取项目下menuIds中分类下的所有接口 */
    menuIds?: number[],
    /** 非必传，获取项目下ids中的所有接口 */
    ids?: number[]
  }[],
  /** 
   * 文件的写入方式
   * cover 覆盖原文件 
   * append 追加到原文件末尾
   * skip 存在文件的直接跳过
   * */
  writeMode: 'cover' | 'append' | 'skip'
}
/**
 * 获取路径最后不是变量的一段
 * @param path 
 * @returns 
 */
function getLastPath(arg: { path: string, reg: RegExp }): string {
  const { path, reg } = arg
  const pathList = path.split('/')
  let lastPath = pathList.pop()
  if (lastPath?.match(reg)) {
    return getLastPath({ path: pathList.join('/'), reg })
  }
  return lastPath || ''
}
interface getConfigArg {
  ids?: string[],
  configPath?: string[],
  writeMode?: Config['writeMode'][]
}
/**
 * 获取配置文件并整合命令行配置
 * @param arg 
 * @returns 
 */
export async function getConfig(arg?: getConfigArg) {
  const { ids, configPath, writeMode } = arg || {}
  const path = join(process.cwd(), configPath?.[0] || './yapi-to-code.config.js')
  try {
    const config: { default: Config } = require(path)
    if (ids?.length) {
      config.default.projectList.forEach(p => {
        p.ids = (p.ids ?? []).concat(ids.map(id => +id))
      })
    }
    if (writeMode?.length) {
      config.default.writeMode = writeMode[0]
    }
    return config.default
  } catch (error) {
    throw new Error(`读取配置文件失败:${configPath}`);
  }
}
/**
 * 拼接 basepath 和 path 获取 url
 * @param arg 
 * @returns 
 */
function getUrl(arg: {
  basepath: string,
  path: string,
}): string {
  const { basepath, path } = arg
  let ret = posix.join(basepath, path)
  return ret
}
/**
 * 获取axios请求的第2个参数
 * 
 * get等没有请求体的请求，返回 `{ params:${paramsName} }`
 * 有请求体的请求，返回 `${paramsName}`
 * 
 * 当有 params 参数且同时有 body 或 params 参数时，paramsName被替换为`${paramsName}._body`或`${paramsName}._query`
 * @param arg 
 * @returns 
 */
function getSecondParam(arg: {
  body?: GetInterfaceResponse['req_body_other'],
  params?: GetInterfaceResponse['req_params'],
  query?: GetInterfaceResponse['req_query'],
  paramsName: string,
  method: GetInterfaceResponse['method']
}): string {
  const { body, params, query, paramsName, method } = arg
  let paramsValue = `${paramsName}`
  if (params?.length) {
    if (body) {
      paramsValue = `${paramsName}._body`
    } else if (query?.length) {
      paramsValue = `${paramsName}._query`
    } else {
      paramsValue = ''
    }
  }
  if (paramsValue) {
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      return paramsValue
    } else {
      return `{ params: ${paramsValue} }`
    }
  } else {
    return ''
  }
}
/**
 * 整合接口的3种参数转为jsonSchema4
 * 支持的参数类型为
 * body：请求体参数
 * params：请求url路径上的参数
 * query：请求url上query的参数
 * 
 * 当有 params 参数且同时有 body 或 params 参数时，params平铺在类型第一层，body位于类型_body中，query位于类型_query中
 * @param arg 
 * @returns 
 */
function getJSONSchema4(
  arg: {
    body?: GetInterfaceResponse['req_body_other'],
    params?: GetInterfaceResponse['req_params'],
    query?: GetInterfaceResponse['req_query']
  }
): JSONSchema4 {
  const { body, params, query } = arg

  const paramsJsonSchema4: JSONSchema4 | undefined = params && params.length ? params?.reduce<JSONSchema4>((p, c) => {
    p.properties && (p.properties[c.name] = {
      type: ['string', 'number'],
      description: c.desc
    })
    Array.isArray(p.required) && p.required.push(c.name)
    return p
  }, {
    type: "object",
    properties: {},
    $schema: "http://json-schema.org/draft-04/schema#",
    required: []
  }) : undefined

  const queryJsonSchema4: JSONSchema4 | undefined = query && query.length ? query.reduce<JSONSchema4>((p, c) => {
    p.properties && (p.properties[c.name] = {
      type: ['string', 'number'],
      description: c.desc
    })
    if (c.required === '1') {
      Array.isArray(p.required) && p.required.push(c.name)
    }
    return p
  }, {
    type: "object",
    properties: {},
    $schema: "http://json-schema.org/draft-04/schema#",
    required: []
  }) : undefined

  const bodyJsonSchema4: JSONSchema4 | undefined = body && JSON.parse(body)

  if (paramsJsonSchema4 && (queryJsonSchema4 || bodyJsonSchema4)) {
    const ret: JSONSchema4 = paramsJsonSchema4
    if (queryJsonSchema4) {
      ret.properties && (ret.properties['_query'] = queryJsonSchema4)
      Array.isArray(ret.required) && ret.required.push('_query')
    }
    if (bodyJsonSchema4) {
      ret.properties && (ret.properties['_body'] = bodyJsonSchema4)
      Array.isArray(ret.required) && ret.required.push('_query')
    }
    return ret
  } else {
    return paramsJsonSchema4 || queryJsonSchema4 || bodyJsonSchema4 || {}
  }
}
/**
 * 获取ts类型
 * @param arg 
 * @returns 
 */
async function jsonSchemaToType(arg: { name: string, jsonSchema: JSONSchema4 }): Promise<string> {
  const { name, jsonSchema } = arg
  if (jsonSchema.type) {
    return await compile(jsonSchema, name, {
      bannerComment: '',
      additionalProperties: false
    })
  } else {
    return `type ${name} = any`
  }
}
/**
 * 获取接口详细数据并写入文件
 * @param arg 
 */
async function getCodeAndWrite(arg: {
  project: GetProjectResponse,
  menu: GetListMenuResponse[0],
  token: string,
  id: number,
  getOutPath: Config['getOutPath'],
  getContent: Config['getCode'],
  writeMode: Config['writeMode']
}) {
  const { writeMode, project, menu, token, id, getOutPath, getContent } = arg
  const request = await getInterface({ token, id })
  const outPath = getOutPath({ project, menu, request })
  const content = await getContent({ project, menu, request, jsonSchemaToType, getLastPath, getUrl, getJSONSchema4, getSecondParam })

  const dirPath = dirname(outPath)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true }); // recursive: true 允许创建多级目录
  }
  let text = ''
  try {
    if (writeMode === 'append' || writeMode === 'skip') {
      text = await promises.readFile(outPath, 'utf-8')
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      // 无权访问
      throw new Error('无权限访问');
    }
  }
  if (!(text && writeMode === 'skip')) {
    text += '\n'
    text += content
    await promises.writeFile(outPath, text, 'utf-8')
  }
}
/**
 * 使用配置yapi-to-code
 * @param arg 
 */
export async function yapiToCode(arg: {
  config: Config
}) {
  const { serverOrigin, projectList, getOutPath, getCode: getContent, writeMode: configWriteMode } = arg.config
  selfAxios.defaults.baseURL = serverOrigin
  const writeMode = configWriteMode || 'cover'
  projectList.forEach(async projectConfig => {
    const { token, menuIds, ids } = projectConfig
    const project = await getProject({ token })
    const menuList = await getListMenu({ token, project_id: project._id })
    if (ids && ids.length) {
      // 只获取特定id的接口
      menuList.forEach(menu => {
        menu.list.forEach(async l => {
          if (ids.includes(l._id)) {
            getCodeAndWrite({ project, menu, token, id: l._id, getOutPath, getContent, writeMode })
          }
        })
      })
    } else if (menuIds && menuIds.length) {
      // 获取某个目录下的所有接口
      menuList.forEach(menu => {
        if (menuIds.includes(menu._id)) {
          menu.list.forEach(async l => {
            getCodeAndWrite({ project, menu, token, id: l._id, getOutPath, getContent, writeMode })
          })
        }
      })
    } else {
      // 获取项目下所有接口
      menuList.forEach(menu => {
        menu.list.forEach(async l => {
          getCodeAndWrite({ project, menu, token, id: l._id, getOutPath, getContent, writeMode })
        })
      })
    }
  })
}
/**
 * bin中yapi-to-code
 * @param arg 
 */
export async function binYapiToCode(arg: getConfigArg) {

  const config = await getConfig(arg)
  yapiToCode({ config })
}

