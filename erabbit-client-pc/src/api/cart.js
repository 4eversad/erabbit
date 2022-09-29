// 封装购物车相关API
import request from "@/utils/request"

/**
 * 获取商品的最新价格 库存 是否有效
 * @param {String} skuId 
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}

/**
 * 获取商品对应的sku数据
 * @param {String} skuId 
 * @returns 
 */
export const getGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * 合并购物车
 * @param {Array<object>} -购物车信息列表 
 * @param {String} -skuId 
 * @param {Boolean} -选中状态 
 * @param {Interger} - 数量
 * @returns 
 */
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

export const findCart = () => {
  return request('/member/cart', 'get')

}

/**
 * 登录后加入购物车
 * @param {String} -skuID 
 * @param {Interger} -加入购物车数量
 * @returns 
 */
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}

/**
 * 删除商品
 * @param {Array<String>} ids -skuId的合集
 * @returns 
 */
export const deleteCart = (ids) => {
  console.log(ids);

  return request('/member/cart', 'delete', { ids })
}

/**
 * 修改购物车商品(数量, 是否选中)
 * @param {String} skuID -skuId
 * @param {Interger} count -商品数量
 * @param {Boolean} selected -选中状态   
 * @returns 
 */
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'put', { selected, count })
}


/**
 * 全部选中&取消全选
 * @param {Boolean} selected -选中状态
 * @param {Array<String>} ids -skuId的合集
 * @returns 
 */
export const checkAllCart = ({ selected, ids}) => {
  return request('/member/cart/selected', 'put', { selected, ids })
} 