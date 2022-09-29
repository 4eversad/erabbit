import { createStore } from 'vuex'
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'
// vuex持久化插件
import createPersistedState from 'vuex-persistedstate'

// vue3的新方法创建仓库
export default createStore({
  modules: {
    cart,
    category,
    user
  },

  // 使用插件
  plugins: [
    // vuex持久化插件
    createPersistedState({
      // 本地存储名字
      key: 'erabbit-pc',
      // 指定需要存储的模块, 分类不用,从接口获取
      paths: ['user', 'cart']
    })
  ]
})
