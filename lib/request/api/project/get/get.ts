import { selfAxios } from "../../../../request";
import { YapiResponse } from "../../../../type-utils";
export type GetProjectResponse = {
    _id: number,
    add_time: number,
    basepath: string,
    cat: [],
    env: {
        domain: string,
        global: [],
        header: [],
        name: string
    }[],
    group_id: number,
    icon: string,
    is_json5: boolean,
    is_mock_open: boolean,
    name: string,
    project_type: string,
    role: boolean,
    strice: boolean,
    switch_notice: boolean,
    tag: [],
    uid: number,
    up_time: number,
}
/**
 * 基本信息
 * @param params 
 * @returns 
 */
export async function getProject(params: { token: string }) {
    const { data } = await selfAxios.get<YapiResponse<GetProjectResponse>>('/api/project/get', { params })
    return data.data
}