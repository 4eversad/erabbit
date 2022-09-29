// 订单相关的接口
import request from "@/utils/request"

/**
 * 购买-购物车中结算
 * @param {String} id - 订单ID
 * @returns
 */
export const createOrder = () => { 
  return request('/member/order/pre', 'get')
} 

/**
 * 获取再次购买的订单结算信息
 * @param {String} id - 订单ID
 * @returns
 */
 export const findOrderRepurchase = (orderId) => {
  return request('/member/order/repurchase/'+orderId, 'get')
}


/**
 * 添加收货地址
 * @param {Object} form -参考接口文档
 */
export const addAddress = (form) => {
  return request('/member/address', 'post', form)
}

/**
 * 修改收货地址接口
 * @param {Object} form -地址对象
 * @returns 
 */
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'put', form)
}

/**
 * 结算页面 -提交订单
 * @param {Object} form -地址对象
 */
export const submitOrder = (params) => {
  return request('/member/order', 'post', params)
}

/**
 * 获取订单详情
 * @param {*} orderId 
 * @returns 
 */
export const findOrderDetail = (orderId) => {
  return request('/member/order/' + orderId, 'get')
}

/**
 * 获取订单列表
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({ orderState = 0, page = 1, pageSize = 10 }) => {
  return request('/member/order', 'get', { orderState, page, pageSize })
}

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}


/**
 * 删除订单
 * @param {Array<string>} ids - 删除订单，id集合
 * @returns
 */
export const deleteOrder = (orderId) => {
  return request('/member/order', 'delete', { ids: [orderId] })
}


/**
 * 确认收货
 * @param {String} ids - 订单ID
 * @returns
 */
export const confirmOrder = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, 'put')
}

/**
 * 查看物流
 * @param {String} id - 订单ID
 * @returns
 */
export const logisticsOrder = (id) => {
  return request(`/member/order/${id}/logistics`, 'get')
}



