// 用户模块
export default {
  namespaced: true,
  state() {
    return {
      profile: {
        id: '',
        // 头像
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // 登录后回跳的路由
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息, payload就是用户信息对象
    setUser(state, payload) {
      state.profile = payload
    },
    // 修改回跳地址 
    setRedirectUrl(state, url) {
      state.redirectUrl = url
    }
  }
} 