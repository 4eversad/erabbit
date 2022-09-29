import { getNewCartGoods, findCart, mergeCart, insertCart, deleteCart, updateCart, checkAllCart } from "@/api/cart"

// 购物车状态
export default {
  namespaced: true,
  state: () => {
    return {
      list: [],
      // isChecked: true
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      // 有效商品: 库存 > 0, isEffective为true
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count * parseInt(100 * c.nowPrice), 0) / 100
    },
    // 无效商品列表
    invalidList(state, getters) {
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选商品列表
    selectedList(state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count * Math.round(100 * c.nowPrice), 0) / 100
    },
    // 是否全选
    isCheckAll(state, getters) {

      return getters.validList.length != 0 && getters.selectedList.length === getters.validList.length

    },
  },
  mutations: {
    // 插入到购物车
    insertCart(state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象的字段
      // 字段: id skuId name attrsText picture price nowPriceselected stock count count
      // 插入数据规则
      // 1.先查询是否有相同的商品(根据skuId) 
      // 2.如果有相同商品, 查询它的数量,累加到payload上,再保存到最新位置,原来的商品需要删除
      // 3.如果没有相同商品, 保存在最新的位置即可
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        // findIndex没找到就会返回-1, >-1就是找到了的意思
        const count = state.list[sameIndex].count
        payload.count += count;
        // 删除原来的商品
        state.list.splice(sameIndex, 1)
      }
      // 不管有没有相同商品,最后都是追加到最新的位置(相同操作)
      state.list.unshift(payload)
    },
    // 修改购物车商品, 检查是否有效
    updateCart(state, goods) {
      // goods就是商品信息 nowPrice stock isEffective
      // goods商品对象的字段不固定 对象中有哪x些字段就改那些字段+同时判断字段的值合法性
      // 但是必须有skuId
      // 待修改商品
      const updateGoods = state.list.find(item => goods.skuId === item.skuId)
      for (const key in goods) {
        if (goods[key] != undefined && goods[key] != null && goods[key] != '') {
          updateGoods[key] = goods[key]
        }
      }

    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart(state, payload) {
      // payload为空数组时清空购物车 同时也为值数组
      state.list = payload
    },
  },
  actions: {
    // 合并购物车
    async mergeCart(ctx) {
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // 合并成功以后
      ctx.commit('setCart', [])
    },
    // 修改规格信息
    updateCartSku(ctx, { oldSkuId, newSkuInfo }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 1. 找出旧的商品信息
          // 2. 删除旧的商品数据
          // 3. 根据新的商品数量和skuId插入到即可
          // 4. 更新列表
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          console.log([oldGoods.skuId]);
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSkuInfo.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })

        } else {
          // 未登录
          // 1.找出旧的商品信息
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          // 2. 删除旧的商品数据
          ctx.commit('deleteCart', oldSkuId)
          // 3. 根据新的sku信息和旧的商品信息,合并成一条新的购物车商品数据
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSkuInfo
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          // 4.添加新的商品
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },

    // 批量删除
    batchDeleteCart(ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 获取商品(无效/有效)的商品的skuId ids为一个数组
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {

            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },

    // 全选和取消全选
    checkAllCart(ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            console.log(123);

            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },

    // 加入购物车
    insertCart(ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录          
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },

    // 获取商品列表
    findCart(ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          findCart().then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 有几个商品发几个请求(同时发送 , 等所有请求成功一并修改本地数据
          // promise.aLl([promise数组]).then(dataList => .....)方法)   
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            dataList.forEach((data, i) => {
              // 更新本地购物车
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            }
            )
            resolve()
          })
        }
      })
    },

    // 修改购物车(数量, 是否选中)
    updateCart(ctx, payload) {
      // payload必须有skuId, 可能有selected或者count 
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          updateCart(payload).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },

    deleteCart(ctx, payload) {
      // goods为当前点击的商品
      // payload就是当前商品的skuId 单条删除
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          console.log('payload: ' + payload);

          deleteCart([payload]).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    }
  }
}
