import request from "@/utils/request"
/**
 * @param {String} id 获取商品详情
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/** 
 * @params {String} id 传就是相关推荐, 不传就是猜你喜欢
 * @params {Interger} limit 限制数量 
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}
 
/** 
 * 获取热销榜数据
 * @params {String} id 传就是相关推荐, 不传就是猜你喜欢
 * @params {Interger} limit 限制数量 
 * @params {Interger} type 热销类型 1为24小时榜, 2为周榜, 3为总榜 
 */
export const findGoodsHot = ({ id, limit = 3, type = 1 }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}
/** 
 * 获取评价数据
 * @params {String} id 商品的id
 */
export const findGoodsCommentInfo = (id) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get', { id })
}


/** 
 * 获取评价数据
 * @params {String} id 商品的id
 * @params {Object} params 商品筛选参数
 */
export const findGoodsCommentList = (id, params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
