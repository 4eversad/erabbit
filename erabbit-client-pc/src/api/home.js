import request from '@/utils/request'

/* 
获取品牌
 @params {integer} limit -品牌个数
 @return Promise 
 默认为6个品牌
*/
export const findBrand = (limit = 6) => {
  // 应该是因为params或者data参数是对象,所以要用{limit}
  return request('/home/brand', 'get', { limit })
}


/* 
获取广告区轮播图
*/
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * 首页-新鲜好物
 * @param {*} limit 默认值为 4，指定响应数据中商品的数量
 * @returns
 */
export const findNew = (limit = 4) => {
  return request('/home/new', 'get', { limit: limit })
}

/**
 * 首页-人气推荐
 * @param {*} 无请求参数
 * @returns
 */
export const findHot = () => {
  return request('/home/hot', 'get')
}

/**
 * 首页-产品区块
 * @param {*} 无请求参数
 * @returns
 */
export const findGoods = () => {
  return request('/home/goods', 'get')
}
/**
 * 获取最新专题
 * @param {*} 无请求参数
 * @returns
 */
export const findSpecial = () => {
  return request('/home/special', 'get')
}


 