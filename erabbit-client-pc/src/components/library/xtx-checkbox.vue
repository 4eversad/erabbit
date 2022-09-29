<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"> <slot></slot> </span>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useVModel } from "@vueuse/core";

export default {
  name: "XtxCheckbox",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    /*  // 组合API写法
    const checked = ref(false);
    const changeChecked = () => {
      checked.value = !checked.value;
      // 发射事件,update:modelValue是默认的事件名,将checked.value的值传过去,通知父组件修改isAllChecked的值
      // 将值修改为checked.value,实现数据的同步变化

      // checked变化->isAllChecked跟着变
      emit("update:modelValue", checked.value);
    };
    // 注意watch的函数不要写在changeChecked里面去了!!
    watch(
      // 监听数据一旦发生改变,就修改checked的值(在一开始就要watch一次,增加immediate属性即可)
      // 若props的值发生了变化,那么check的value值也要跟着变化

      // isAllChecked变化->checked跟着变
      () => props.modelValue,
      () => {
        checked.value = props.modelValue;
      },
      { immediate: true }
    );

    return { checked, changeChecked }; */

    // vueuse写法

    // 1. 使用 props 接收 modelValue
    // 2. 使用 useVModel 来包装props中的 modelValue 属性数据
    // 3. 在使用 checked.value就是使用父组件数据
    // 4. 在使用 checked.value = '数据' 赋值的时候，就会自动触发 emit('update:modelvalue', '数据')
    // 5. 也可以手动触发别的事件 例如这里的 change

    // 获取父组件传递过来的modelValue的值 (接收值)
    const checked = useVModel(props, "modelValue", emit);
    const changeChecked = () => {
      const newVal = !checked.value
      // 通知父组件改值 (改值)
      // 在使用 checked.value = '数据' 赋值的时候，就会自动触发 emit('update:modelvalue', '数据')
      // emit('update:modelvalue', newVal)
      checked.value = newVal;
      // console.log('点击了勾选框, 此时的checked为:' + newVal);
      emit('change', newVal)
      watch(() => newVal, () => {
        console.log('newVal发生改变');  
      })
      console.log('newVal: '+ newVal);
      
      
      
    };
    return { checked, changeChecked };
  },
};
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  cursor: pointer;
  user-select: none;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
