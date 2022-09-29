<template>
  <div>
    <!-- 顶部通栏 -->
    <app-navbar></app-navbar>
    <!-- 吸顶头部组件 -->
    <app-header-sticky></app-header-sticky>
    <!-- 头部组件 -->
    <app-header></app-header>
    <!-- 内容容器 -->
    <div class="main">
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>
    <!-- 底部组件 -->
    <app-footer></app-footer>
  </div>
</template>

<script>
import { useStore } from "vuex";
import AppFooter from "../components/app-footer.vue";
import AppHeaderSticky from "../components/app-header-sticky.vue";
import AppHeader from "../components/app-header.vue";
import appNavbar from "../components/app-navbar.vue";
export default {
  components: {
    appNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky,
  },

  name: "Layout",
  setup(props) {
    // 在此处获取分类数据
    const store = useStore();
    // 由于是分模块的,所以要加上category
    store.dispatch("category/getList");
    
  },
};
</script>

<style lang="less" scoped>

</style>