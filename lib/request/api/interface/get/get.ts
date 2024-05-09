import { selfAxios } from "../../../../request";
import { YapiResponse } from "../../../../type-utils";
export type GetInterfaceResponse = {
    /** 请求体中的参数 json的请求体 */
    req_body_other?: string,
    /** ├─ _id	number	非必须		接口id	 */
    _id: number
    /** ├─ project_id	number	非必须		项目id	 */
    project_id: number
    /** ├─ catid	number	非必须		品类id	 */
    catid: number
    /** ├─ title	string	非必须			 */
    title: string
    /** ├─ path	string	非必须		请求路径	 */
    path: string
    /** ├─ method	string	非必须		请求method	 */
    method: string
    /** ├─ req_body_type	string	非必须		请求数据类型	    枚举: raw,form,json */
    req_body_type: string
    /** ├─ res_body	string	非必须		返回数据	 */
    res_body?: string
    /** ├─ res_body_type	string	非必须		返回数据类型	    枚举: json,raw */
    res_body_type: string
    /** ├─ uid	number	非必须		用户uid	 */
    uid: number
    /** ├─ add_time	number	非必须			 */
    add_time: number
    /** ├─ up_time	number	非必须			 */
    up_time: number
    /** ├─ req_body_form	object []	非必须		请求 form 参数	    item 类型: object */
    req_body_form: {
        /** ├─ name	string	必须			 */
        name: string
        /** ├─ type	string	必须			 */
        type: string
        /** ├─ example	string	必须			 */
        example: string
        /** ├─ desc	string	必须			 */
        desc: string
        /** ├─ required	string	必须	1		    枚举: 1,0 */
        required: string
    }[]
    /** url中的参数 ├─ req_params	object []	非必须			    item 类型: object */
    req_params: {
        /** ├─ name	string	必须			 */
        name: string
        /** ├─ example	string	必须			 */
        example: string
        /** ├─ desc	string	必须			 */
        desc: string
    }[]
    /** ├─ req_headers	object []	非必须			    item 类型: object */
    req_headers: {
        /** ├─ name	string	必须			 */
        name: string
        /** ├─ type	string	必须			 */
        type: string
        /** ├─ example	string	必须			 */
        example: string
        /** ├─ desc	string	必须			 */
        desc: string
        /** ├─ required	string	必须	1	    枚举: 1,0 */
        required: string
    }[]
    /** ├─ req_query	object []	非必须			    item 类型: object */
    req_query: {
        /** ├─ name	string	必须			 */
        name: string
        /** ├─ type	string	必须			 */
        type: string
        /** ├─ example	string	必须			 */
        example: string
        /** ├─ desc	string	必须			 */
        desc: string
        /** ├─ required	string	必须	1		    枚举: 1,0 */
        required: string
    }[]
    /** ├─ status	string	非必须		接口状态	 */
    status: string
    /** ├─ edit_uid	number	非必须		修改的用户uid	 */
    edit_uid: number
    /** ├─ res_body_is_json_schema	boolean	必须	false	返回数据是否为 json-schema	 */
    res_body_is_json_schema: boolean
}
/**
 * 获取接口数据（有详细接口数据定义文档）
 * @param params 
 * @returns 
 */
export async function getInterface(params: { token: string, id: number }) {
    const { data } = await selfAxios.get<YapiResponse<GetInterfaceResponse>>('/api/interface/get', { params })
    return data.data
}