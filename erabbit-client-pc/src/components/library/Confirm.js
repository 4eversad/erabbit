// 删除商品时的确认框
import xtxConfirm from "../library/xtx-confirm.vue"
// 创建一个div容器
const div = document.createElement('div')
// 添加一个唯一标识
div.setAttribute('class', 'xtx-confirm')
// 放到body中
document.body.appendChild(div)
import { createVNode, render } from "vue"

// 返回一个Promise对象
export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      // 销毁组件
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    // 可以将函数传递给组件
    const vnode = createVNode(xtxConfirm, { title, text, cancelCallback, submitCallback})
    render(vnode, div)

  })
}