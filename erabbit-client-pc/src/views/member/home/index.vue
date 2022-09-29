<template>
  <div class="member-home">
    <!-- 概览 -->
    <home-overview></home-overview>
    <!-- 收藏 -->
    <home-panel title="我的收藏" v-if="collectGoods">
      <goods-item v-for="item in collectGoods" :key="item.id" :goods="item"></goods-item>
    </home-panel>
    <!-- 足迹 -->
    <home-panel title="我的足迹">
      <goods-item v-for="item in collectGoods" :key="item.id" :goods="item"></goods-item>

    </home-panel>
    <!-- 猜你喜欢 -->
    <goods-relevant></goods-relevant>
  </div>
</template>
<script>
import HomePanel from "./components/home-panel.vue";
import homeOverview from "./components/home-overview.vue";
import GoodsRelevant from "../../goods/components/goods-relevant.vue";
import GoodsItem from "../../category/components/goods-item.vue";
import request from "@/utils/request";
import { findCollect } from "@/api/member";
import { ref } from "vue";
export default {
  components: { homeOverview, HomePanel, GoodsRelevant, GoodsItem },
  name: "MemberHome",
  setup(props, { emit }) {
    const goods = {
      id: "1",
      name: "自热火锅",
      picture: null,
      desc: "清汤鲜香",
      price: "159.00",
    };
    request("/my/test", "get").then((res) => {
      console.log(res);
    });

    const collectGoods = ref([]);
    findCollect({ page: 1, pageSize: 4 }).then((data) => {
      console.log(data);
      
      collectGoods.value = data.items;
    });

    return {
      goods,
      collectGoods
    };
  },
};
</script>
<style scoped lang="less">
:deep(.xtx-carousel .carousel-btn.prev) {
  left: 0px;
}
:deep(.xtx-carousel .carousel-btn.next) {
  right: 0;
}
.goods-list {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
}
</style>
