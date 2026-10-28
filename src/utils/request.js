import axios from 'axios'
import { Toast } from 'vant'

const instance = axios.create({
  baseURL: 'https://smart-shop.itheima.net/index.php?s=/api/',
  timeout: 5000
})
// 自定義配置
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在请求发送之前执行某些操作
    config.headers.platform = 'H5'
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    return config
  },
  function (error) {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 状态码在 2xx 范围内的响应会触发此函数
    // 处理响应数据(默認axios會多一層data)
    const res = response.data
    if (res.status !== 200) {
      Toast(res.message)
      return Promise.reject(res)
    }
    // 請求成功，關掉載入中的 Toast
    Toast.clear()
    return res
  },
  function (error) {
    // 状态码不在 2xx 范围内的响应会触发此函数
    // 处理响应错误
    // 網路錯誤、逾時也要關掉載入中的 Toast
    Toast.clear()
    return Promise.reject(error)
  }
)

export default instance
