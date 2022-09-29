  <!-- 新鲜好物 -->
<template>
  <div class="home-new">
    <home-panel ref="target" title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
      <template #right>
        <xtx-more path="/"></xtx-more>
      </template>
      <!-- 默认插槽 - 面板内容 -->
      <ul v-if="goods.length" class="goods-list">
        <li v-for="item in goods" :key="item.id">
          <RouterLink :to="`/product/${item.id}`">
            <img :src="item.picture" alt="" />
            <p class="name ellipsis">{{ item.name }}</p>
            <p class="price">&yen;{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
      <template v-else>
        <home-skeleton bg="#f0f9f4"></home-skeleton>
      </template>
    </home-panel>
  </div>
</template>

<script>
import { ref } from "vue";
import homePanel from "./home-panel.vue";
import { findNew } from "@/api/home";
import HomeSkeleton from "./home-skeleton.vue";
import { useLazyData } from "@/hooks";
export default {
  components: { homePanel, HomeSkeleton },
  name: "HomeNew",
  setup() {
    // 获取数据
    const goods = ref([]);
    /*     findNew().then((data) => {
      goods.value = data.result;
    }); */

    // 懒加载
    // vue3中拿到ref的方法
    const target = ref(null);
    const result = useLazyData(target, findNew);
    return { goods: result, target };
  },
};
</script>
<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
