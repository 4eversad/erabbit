<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template #right>
      <a
        @click="toggle(-1)"
        href="javascript:;"
        class="iconfont icon-angle-left prev"
        :class="{ disabled: index == 0 }"
      ></a>
      <a
        @click="toggle(1)"
        href="javascript:;"
        class="iconfont icon-angle-right next"
        :class="{ disabled: index == 1 }"
      ></a>
    </template>
    <div ref="target" class="box">
      <ul
        v-if="brands.length"
        class="list"
        :style="{ transform: `translateX(-${index * 1240}px)` }"
      >
        <li v-for="item in brands">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
          </RouterLink>
        </li>
      </ul>
      <div v-else class="skeleton">
        <XtxSkeleton
          class="item"
          v-for="i in 5"
          :key="i"
          width="240px"
          height="305px"
          bg="#e4e4e4"
        ></XtxSkeleton>
      </div>
    </div>
  </HomePanel>
</template>

<script>
import HomePanel from "./home-panel.vue";
import { useLazyData } from "@/hooks";
import { ref } from "vue";
import { findBrand } from "@/api/home";
import XtxSkeleton from "../../../components/library/xtx-skeleton.vue";
export default {
  name: "HomeBrand",
  components: { HomePanel, XtxSkeleton },
  setup(props) {
    // 获取数据
    /*     const brands = ref([]);
    findBrand(10).then((data) => {
      brands.value = data.result;
    }); */

    // 切换上下页功能
    // 一共有0,1两页
    const index = ref(0);
    const toggle = (step) => {
      const newIndex = index.value + step;
      if (newIndex < 0 || newIndex > 1) {
        return;
      }
      index.value = newIndex;
    };

    // 数据懒加载
    const target = ref(null);
    // 注意箭头后面不要加{}!!!
    const result = useLazyData(target, () => findBrand(10));
    return { index, toggle, brands: result, target };
  },
};
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>

