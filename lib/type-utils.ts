export type YapiResponse<T> = {
    errcode: number,
    errmsg: string,
    data: T
}