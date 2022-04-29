import { request } from "./request"

export function getRecommendInfo(age: number, gender: 'male' | 'female') {
  return request({
    url: '/recommend/info',
    method: 'post',
    data: { age, gender }
  })
}
