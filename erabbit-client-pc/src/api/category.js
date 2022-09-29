// 定义分类相关的API接口函数
import request from '@/utils/request'
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 * 获取顶级类目数据(children就是各个子分类数据)
 * @params {String} id-顶级类目id
 * @returns 
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}

/**
 * 获取二级类目数据(children就是各个子分类数据)
 * @params {String} id-二级类目id
 * @returns 
 */
export const findSubCategoryFilter = (id) => {
  return request('category/sub/filter', 'get', { id })
}

/**
 * 获取二级分类商品, 带筛选
 *  @param {Object}
 */
export const findSubCategoryGoods = (params) => {
  console.log(params);
  
  return request('/category/goods/temporary','Post', params)
} 


