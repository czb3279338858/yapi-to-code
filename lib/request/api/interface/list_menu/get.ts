import { YapiResponse } from "../../../../type-utils";
import { selfAxios } from "../../../../request";
export type GetListMenuResponse = {
    /** __v:0 */
    __v: number
    /** _id:12492 */
    _id: number
    /** add_time:1705888703 */
    add_time: number
    /** desc:'报价结果表 控制层' */
    desc: string
    /** index:0 */
    index: number
    /** list:[] */
    list: {
        /** _id:92507 */
        _id: number
        /** add_time:1709608048 */
        add_time: number
        /** api_opened:false */
        api_opened: boolean
        /** catid:12492 */
        catid: number
        /** edit_uid:0 */
        edit_uid: number
        /** method:'POST' */
        method: string
        /** path:'/designQuotationResultController/newExportItemMaterialDetailResultByQuotationItemId' */
        path: string
        /** project_id:520 */
        project_id: number
        /** status:'done' */
        status: string
        /** tag:[] */
        tag: []
        /** title:'根据报价项ID导出订单价格明细清单(按excel模板导出)' */
        title: string
        /** uid:351  */
        uid: number
    }[]
    /** name:'报价结果表 控制层' */
    name: string
    /** project_id:520 */
    project_id: number
    /** uid:114 */
    uid: number
    /** up_time:1705888703 */
    up_time: number
}[]
/**
 * 获取接口菜单列表
 * @param params 
 * @returns 
 */
export async function getListMenu(params: { token: string, project_id: number }) {
    const { data } = await selfAxios.get<YapiResponse<GetListMenuResponse>>('/api/interface/list_menu', { params })
    return data.data
}