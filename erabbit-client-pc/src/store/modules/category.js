import { topCategory } from "@/api/constants"
import { findAllCategory } from "@/api/category";

export default {
  namespaced: true,
  state() {
    return {
      // 分类信息集合,依赖constants中的topCategory来展示,避免白屏
      // 不用return返回对象可以在外面包裹一对小括号
      // 这个是在一开始就要展示的分类
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  mutations: {
    // payload就是所有的分类合集
    setList(state, payload) {
      state.list = payload;
    },
    // 控制当前分类下的二级类目的显示或隐藏 
    show(state, id) {
      // 先找到当前的目录是哪个 即当前目录的id等于鼠标移动到的目录的id
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = true;
    },
    hide(state, id) {

      // 注意这里的item.id === id两侧不能包裹中括号!!!除非加上return!!!
      const currentCategory = state.list.find(item => item.id === id)
      currentCategory.open = false;
    }
  },

  /* 
  action函数可以接收一个与store实例具有相同方法的属性context，这个属性中包括下面几部分：
 
  context:{
        state,   等同于store.$state，若在模块中则为局部状态
        rootState,   等同于store.$state,只存在模块中
        commit,   等同于store.$commit
        dispatch,   等同于store.$dispatch
        getters   等同于store.$getters
      } */
  actions: {
    async getList({ commit }) {
      // 获取分类函数,
      const data = await findAllCategory()
      // 给每个二级分类加上open的数据
      data.result.forEach((top) => {
        top.open = false
      })
      // 修改分类数据,调用mutations的方法
      commit('setList', data.result)

    }
  }

}
