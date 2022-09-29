
<script>
import { h } from "vue";
export default {
  name: "XtxBread",
  render() {
    // 用法
    // 1.template标签去除,单文件组件,用h函数来创建
    // 2.返回值就是组件内容
    // 3. vue2的h函数是直接传参进来的,vue3是用导入的
    // 4.h的第一个参数是标签名字, 第二个是标签属性对象,一定是对象形式!!!,第三个是自子节点
    // 需求
    // 1.创建xtx-bread父容器
    // 2.获取默认插槽内容 $slot.default
    // 3.去除xtx-bread-item组件的i标签, 应该由render函数来组织
    // 4.遍历插槽中的item,得到一个动态创建的节点,最后一个item不加i标签
    // 5.把动态创建的节点渲染在xtx-bread中
    const items = this.$slots.default();
    // 建一个新的数组来存储新的结构
    const dynamicItems = [];
    items.forEach((item, index) => {
      dynamicItems.push(item);
      if (index < items.length - 1) {
        dynamicItems.push(h("i", { class: "iconfont icon-angle-right" }));
      }
    });
    return h("div", { class: "xtx-bread" }, dynamicItems);
  },
};
</script>

<style lang='less'>
// 去除scoped属性 样式作用到item上
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>