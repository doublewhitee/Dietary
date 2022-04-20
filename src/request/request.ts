import axios from 'axios'
import { Loading, Notify } from 'quasar'

export function request(config: Object) {
  const instance = axios.create({
    baseURL: 'http://localhost:5050/',
    timeout: 10000
  })

  instance.interceptors.request.use(res => {
    Loading.show()
    return res
  }, () => {})

  instance.interceptors.response.use(res => {
    Loading.hide()
    if (res.data && res.data.code !== 200) {
      Notify.create({
        message: res.data.message,
        position: 'top'
      })
    } else return res.data
  }, () => {
    Notify.create({
      message: 'Request failed!',
      position: 'top'
    })
    Loading.hide()
  })

  return instance(config)
}