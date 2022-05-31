import { defHttp } from '@/utils/http/axios'

export const test = (params) => defHttp.get({ url: '/test', params })
