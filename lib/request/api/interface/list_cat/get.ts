import { YapiResponse } from "../../../../type-utils";
import { selfAxios } from "../../../../request";
export type GetListCatResponse = {
    count: number
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
    total: number
}
/**
 * 获取某个分类下接口列表
 * @param params 
 * @returns 
 */
export async function getListCat(params: { token: string, catid: number, page?: number, limit?: number }) {
    const { data } = await selfAxios.get<YapiResponse<GetListCatResponse>>('/api/interface/list_cat', { params })
    return data.data
}