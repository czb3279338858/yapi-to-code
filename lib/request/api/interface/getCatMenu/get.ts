import { selfAxios } from "../../../../request";
import { YapiResponse } from "../../../../type-utils";
export type GetCatMenuResponse = {
    /** __v:    0 */
    __v: number
    /** _id:    15215 */
    _id: number
    /** add_time:    1711021322 */
    add_time: number
    /** desc:    '报价物料明细信息表 控制层' */
    desc: string
    /** index:    0 */
    index: number
    /** name:    '报价物料明细信息表 控制层' */
    name: string
    /** project_id:    520 */
    project_id: number
    /** uid:    114 */
    uid: number
    /** up_time:    1711021322 */
    up_time: number
}
/**
 * 获取菜单列表
 * @param params 
 * @returns 
 */
export async function getCatMenu(params: { token: string, project_id: number }) {
    const { data } = await selfAxios.get<YapiResponse<GetCatMenuResponse>>('/api/interface/getCatMenu', { params })
    return data.data
}