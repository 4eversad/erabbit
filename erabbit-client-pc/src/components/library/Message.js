// 提供一个能够显示xtx-message组件的函数
// 这个函数可以直接导入使用,也可以挂载在vue实例原型上
// 通过import 传入对象使用
// this.$message({type: ..., text: ...})


import { createVNode, render } from "vue"
import XtxMessage from "../../components/library/xtx-message.vue"

// 创建一个div容器
const div = document.createElement('div')
// 加一个标识
div.setAttribute('class', 'xtx-message')
// 将元素放在body中
document.body.appendChild(div)

// 定时器标识
let timer = null
export default ({ type, message }) => {
  // 1.导入消息提示组件
  // 2.将消息组件编译为虚拟节点
  // 3.准备一个装载消息提示组件的容器
  // 4.将虚拟节点渲染在容器中

  // createVNode是vue提供的函数,createVNode(组件, 属性对象(props))
  const vnode = createVNode(XtxMessage, { type, message })
  // render(虚拟节点, DOM容器)
  render(vnode, div)
  // 好习惯: 清空定时器,以防多次绑定
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 2000)
}