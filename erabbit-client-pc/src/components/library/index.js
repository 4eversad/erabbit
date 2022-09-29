// 扩展vue原有功能:全局组件

// import xtxSkeleton from './xtx-skeleton.vue'
// import xtxCarousel from "./xtx-carousel.vue";
// import xtxMore from "./xtx-more.vue";
// import xtxBread from './xtx-bread.vue'
// import xtxBreadItem from './xtx-bread-item.vue'
import Message from "./Message.js"

export default {
  // install 方法调用时，会将 Vue 作为参数传入。
  install(app) {
    // 批量注册组件
    // 使用'require'提供的函数'context',加载某一个目录下的所有'.vue'后缀的文件
    // 然后'context'函数会返回一个导入函数'importFn'
    // 它有一个属性keys()获取所有的文件路径
    // 遍历所有的同时进行全局注册即可
    // 如果要挂载原型, 使用app.config.globalProperties方式

    // context(目录路径, 是否加载子路径,加载文件的匹配正则)
    const importFn = require.context('./', false, /\.vue/)

    // 导入组件
    importFn.keys().forEach(path => {
      // 用default导出就.default
      const component = importFn(path).default;
      // 进行注册
      app.component(component.name, component)
    })
    // app.component(xtxBreadItem.name, xtxBreadItem)
    defineDirective(app)
    // 挂载Message在原型,这样可以直接this.$message来调用
    app.config.globalProperties.$message = Message
  }
}

// 定义指令
// 图片懒加载指令
// 远离: 先存储图片地址不能在src中,当图片进入可视区内,将存储的图片地址设置给图片元素即可

const defineDirective = (app) => {
  // 图片懒加载指令
  app.directive('lazy', {
    mounted(el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      },
        { threshold: [0.01] }
      )
      observer.observe(el)
    }
  })
}





