// 配置mock

import Mock from "mockjs";
import qs from 'qs'
Mock.setup({
  // 随机延迟500-1000毫秒, 模拟网络延迟
  timeout: '500-1000'
})

// 拦截接口
// 1. 接口地址路径规则,需要匹配到他
// 2. 请求方式
// 返回数据(函数返回数据)
Mock.mock(/\/my\/test/, 'get', () => {
  // 随机数据逻辑
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr.push(Mock.mock({
      id: '@id',
      name: '@cname'

    }))

  }
  return { msg: '获取数据成功', result: arr }
})

// 模拟我的收藏接口
Mock.mock(/\/member\/collect/, 'get', (config) => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }

  return {
    counts: 35,
    pageSize: +queryObject.pageSize,
    page: +queryObject.page,
    items
  }
})




