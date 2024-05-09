import { YapiResponse } from "../../../../type-utils";
import { selfAxios } from "../../../../request";
export type GetInterfaceListResponse = {

    count: number
    total: number
    list: {
        /** "_id": 4444, */
        _id: number
        /** "project_id": 299, */
        project_id: number
        /** "catid": 1376, */
        catid: number
        /** "title": "/api/group/del", */
        title: string
        /** "path": "/api/group/del", */
        path: string
        /** "method": "POST", */
        method: string
        /** "uid": 11, */
        uid: number
        /** "add_time": 1511431246, */
        add_time: number
        /** "up_time": 1511751531, */
        up_time: number
        /** "status": "undone", */
        status: string
        /** "edit_uid": 0 */
        edit_uid: number

    }[]
}
/**
 * 获取接口列表数据
 * @param params 
 * @returns 
 */
export async function getInterfaceList(params: { token: string, project_id: number, page?: number, limit?: number }) {
    const { data } = await selfAxios.get<YapiResponse<GetInterfaceListResponse>>('/api/interface/list', { params })
    return data.data
}