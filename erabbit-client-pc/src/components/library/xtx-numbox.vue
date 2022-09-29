<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="numbox">
      <a @click="changeNum(-1)" href="javascript:;">-</a>
      <input type="text" readonly :value="modelValue" />
      <a @click="changeNum(1)" href="javascript:;">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from "@vueuse/core";
export default {
  name: "XtxNumbox",
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      default: "",
    },
    min: {
      // 数量组件的最小值
      type: Number,
      default: 1,
    },
    max: {
      // 数量组件的最大值
      type: Number,
      default: 10,
    },
  },
  setup(props, { emit }) {
    // 点击-或者+数量的按钮时触发同一函数, 监听变化并同时父组件改值
    // 用vueuse的useVmodel做数据绑定, 修改count通知父组件更新
    const changeNum = (step) => {
      // count是获取父组件传递过来的modelValue的值 (接收值)
      const count = useVModel(props, "modelValue", emit);
      const newValue = count.value + step;
      // 判断新的值是否合法,不合法则终止程序
      if (newValue < props.min || newValue > props.max) return;
      // 使用count.value时会自动触发emit通知父组件改值
      count.value = newValue;
      // 提供change事件
      emit("change", newValue);
    };
    return { changeNum };
  },
};
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
