import { request } from "./request"

export function getSportInfo(keyword: string, page: number) {
  return request({
    url: '/sport/info',
    params: { keyword, page }
  })
}
