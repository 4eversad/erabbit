<template>
  <div class="home-banner">
    <xtx-carousel autoPlay :sliders="sliders"></xtx-carousel>
  </div>
</template>

<script>
import { ref } from "vue";
import { findBanner } from "@/api/home";
export default {
  components: {},
  setup(props) {
    // 获取轮播图数据
    const sliders = ref([]);
    findBanner().then((data) => {
      sliders.value = data.result;
    });
    return { sliders };
  },
};
</script>

<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
}
.xtx-carousel {
  :deep(.carousel-btn.prev) {
    left: 270px !important;
  }
  :deep(.carousel-indicator) {
    // 样式穿透 穿透到子组件里 由于有scoped, 所以只能穿透
    padding-left: 250px;
  }
}
</style>