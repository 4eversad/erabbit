// 1.创建一个新的axios的实例
// 2.请求拦截器,如果有token进行头部携带
// 3.响应拦截器 1.剥离无效数据 2.处理token失效
// 4.导出一个函数,调用当前的axios实例发请求 返回的结果为promise

import axios from 'axios';
import store from '@/store'
import router from '@/router'

// 将baseURL写在外面,因为有些请求不是用axios发的,有时候可能还会用到这个基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'
// 1.axios实例
const instance = axios.create({
  // 请求配置,baseURLtimeout
  baseURL,
  timeout: 5000
})

// 业务拦截逻辑
instance.interceptors.request.use(config => {
  // 如果有token就在头部携带
  // 获取用户信息对象(解构出profile)

  const { profile } = store.state.user

  // 判断是否有token
  if (profile.token) {
    // config为请求头对象
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  // 记得要return出去
  return config
}, err => {
  return Promise.reject(err)
})

// 拦截响应
instance.interceptors.response.use(res => {
  // 取出data数据,调用接口时拿的就直接是后台的数据,剥离无效数据
  return res.data

}, err => {
  // 401状态码时,进入该函数
  if (err.response && err.response.status === 401) {
    // 1.清空无效信息
    store.commit('user/setUser', {})
    // 2.跳转到登录页,且携带当前的路由地址
    // 3.跳转需要传参(当前路由地址)给登录页
    // 当前路由地址:
    // 组件内: `/user?a=10` $router.path -> /user  $route.fullpath -> /user?a=10
    // js模块中: router.currentRoute.value.fullpath 就是当前路由完整地址,但是是ref响应式数据,所以要加上value!!!
    // 由于有特殊字符,所以要转码,JS的原生方法

    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    
    router.push('/login?redirectUrl=' + fullPath)

  }
  return Promise.reject(err)
})

// 发送请求
export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // 判断请求类型,如果是get那就用params当做submitData的属性值,否则就是data
    // 相当于params: submitData, params的对象就是传过来的参数
    [method.toLowerCase() == 'get' ? 'params' : 'data']: submitData
    
  })

}  
