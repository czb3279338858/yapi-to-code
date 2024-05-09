const { join } = require('path')
/**
 * @type {import('./dist').Config}
 */
const config = {
    /**
     * 文件的写入方式 
     * cover 覆盖原文件 
     * append 追加到原文件末尾 
     * skip 存在文件的直接跳过
     */
    writeMode: 'skip',
    /**
     * 获取填充到文件中的代码文本
     * @param {*} arg 
     * @param {*} arg.project 项目信息，来源于 yapi-api api/project/get 
     * @param {*} arg.menu 菜单信息，来源于 yapi-api api/interface/list_menu
     * @param {*} arg.request 请求信息，来源于 yapi-api api/interface/get
     * @param {*} arg.jsonSchemaToType jsonSchema 转 typescript 类型，当 jsonSchema==={} 时返回 type A = any
     * @param {*} arg.getLastPath 获取路径的最后一个不是变量的路径，通过参数2正则判断是否变量
     * @param {*} arg.getUrl 拼接basepath和path获取完整的 url
     * @param {*} arg.getJSONSchema4 整合接口的 3 种参数转为 jsonSchema4，当有 params 参数且同时有 body 或 params 参数时，params 平铺在类型第一层，body 位于 _body 中，query 位于 _query 中
     * @param {*} arg.getSecondParam 获取 axios 第二个参数，get等没有请求体的请求，返回 `{ params:${paramsName} }`，有请求体的请求，返回 `${paramsName}`。当有 params 参数且同时有 body 或 params 参数时，paramsName 被替换为`${paramsName}._body`或`${paramsName}._query`。
     * @returns 
     */
    async getCode(arg) {
        const { project, menu, request, jsonSchemaToType, getLastPath, getUrl, getJSONSchema4, getSecondParam } = arg

        const paramsName = 'params'

        let url = getUrl({
            basepath: project.basepath,
            path: request.path
        })
        url = url.replace(/\{(\w+)\}/g, (substring, ...args) => {
            const key = args[0]
            return `$\{${paramsName}.${key}\}`
        })

        const method = request.method.toLocaleLowerCase()
        const lastPath = getLastPath({ path: request.path, reg: /^\{\w+\}$/ })
        const funName = `${method}${lastPath[0].toUpperCase()}${lastPath.slice(1)}`
        const remark = request.title
        const axiosSecondParam = getSecondParam({ paramsName, method: request.method, body: request.req_body_other, params: request.req_params, query: request.req_query })

        const typeNamePrefix = `${funName[0].toUpperCase()}${funName.slice(1)}`
        const paramsTypeName = `${typeNamePrefix}Params`
        const responseTypeName = `${typeNamePrefix}Response`
        const paramsJsonSchema = getJSONSchema4({ body: request.req_body_other, params: request.req_params, query: request.req_query })
        const responseJsonSchema = getJSONSchema4({ body: request.res_body })
        const [paramsType, responseType] = await Promise.all([
            jsonSchemaToType({ name: paramsTypeName, jsonSchema: paramsJsonSchema }),
            jsonSchemaToType({ name: responseTypeName, jsonSchema: responseJsonSchema })
        ])

        const retList = [
            `import { selfAxios } from '@oppein/op-utils'`,
            `${paramsType}`,
            `${responseType}`,
            `/**`,
            ` * ${remark}`,
            ` */`,
            `export async function ${funName}(${paramsName}: ${paramsTypeName}) {`,
            `  const {`,
            `    data`,
            `  } = await selfAxios.${method}<${responseTypeName}>(`,
            `    \`${url}\`,`,
            `    ${axiosSecondParam}`,
            `  )`,
            `  return data?.data`,
            `}`
        ]
        return retList.join('\n')
    },
    /**
     * 获取文件输出路径，可以是同一个文件
     * @param {*} arg 
     * @returns 
     */
    getOutPath(arg) {
        const { project, menu, request } = arg
        const { basepath } = project
        const pathStr = join(process.cwd(), '/src/request', basepath, request.path, `${request.method.toLocaleLowerCase()}.ts`)
        return pathStr
    },
    /**
     * yapi 服务地址
     */
    serverOrigin: 'http://10.10.1.244:3000/',
    /**
     * 生成文件的项目列表
     */
    projectList: [{
        /** 项目的 token，必须，后文会声明在何处获取 */
        token: "23527b197da48d84eb4c21d4d341e1d137a0a6ebf7d8753f93d6665bda7947c9",
        /** 项目的菜单id，当有菜单时会生成菜单下的所有接口，后文会声明在何处获取 */
        menuIds: [12492],
        /** 项目中接口的id，当有ids时，会忽略 menuIds，后文会声明在何处获取 */
        ids: [
            // 94306, // 响应 data 为空对象
            // 89455, // 响应 data 为 null
            // 94460, // post 请求体 formData，响应为空
            // 92920, // get请求，响应 data 直接平铺
            79480 // get 请求，参数在 url上
        ]
    }],
}
exports.default = config