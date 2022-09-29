<template>
  <div class="xtx-tabs-panel" v-show="name === activeName">
    <slot />
  </div>
</template>

<script>
import { inject } from 'vue';
export default {
  name: 'XtxTabsPanel',
  // label为选项卡名称, name为选项卡唯一标识, $slot.default()可得到插槽的默认内容
  props: {
    label: {
      type: String,
      default: "",
    },
    name: {
      type: [String, Number],
      default: "",
    },
  },
  setup(props, {emit}) {
    const activeName = inject('activeName')
    return { activeName}
  }
};
</script>

<style>
</style>