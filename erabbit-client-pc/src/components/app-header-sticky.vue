<template>
  <div class="app-header-sticky" :class="{ show: y >= 78 }">
    <div class="container" v-show="y >= 78">
      <RouterLink class="logo" to="/" />
      <AppHeaderNav />
      <div class="right">
        <RouterLink to="/">品牌</RouterLink>
        <RouterLink to="/">专题</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import AppHeaderNav from "./app-header-nav.vue";
import { useWindowScroll } from "@vueuse/core";
export default {
  name: "AppHeaderSticky",
  components: { AppHeaderNav },
  setup(props) {
    // 传统监听方式
    /* const y = ref(0);
    onMounted(() => {
      window.onscroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        y.value = scrollTop;
      };
    });
    return {
      y,
    }; */
    // 使用组件库获取头部被滚动高度
    const { y } = useWindowScroll();
    return { y };
  },
};
</script>

<style scoped lang="less">
.app-header-sticky {
  opacity: 0;
  transform: translateY(-100);
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  // z-index: 10;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  &.show {
    z-index: 999;
    opacity: 1;
    transform:  translateY(0);
    transition: all 0.3 linear;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    height: 80px;
    background: url(~@/assets/images/logo.png) no-repeat right 2px;
    background-size: 160px auto;
  }
  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;
    a {
      width: 38px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
</style>