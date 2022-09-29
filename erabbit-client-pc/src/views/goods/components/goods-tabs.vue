<template>
  <div class="goods-tabs">
    <nav>
      <a
        @click="activeName = 'goodsDetail'"
        :class="{ active: activeName === 'goodsDetail' }"
        href="javascript:;"
        >商品详情</a
      >
      <a
        @click="activeName = 'goodsComment'"
        :class="{ active: activeName === 'goodsComment' }"
        href="javascript:;"
        >商品评价<span>(500+)</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <!-- vue中切换组件可以使用动态组件 -->
    <component :is="activeName"></component>

    <!--<goods-detail v-if="activeName === 'goodsDetail'"></goods-detail>
    <goods-comment v-if="activeName === 'goodsComment'"></goods-comment> -->
  </div>
</template>

<script>
import { ref } from "vue";
import goodsComment from "./goods-comment.vue";
import goodsDetail from "./goods-detail.vue";

export default {
  components: { goodsComment, goodsDetail },
  name: "GoodsTabs",

  setup(props, { emit }) {
    // 约定activeName为goodsDetail和goodsComment,默认为goodsDetail
    const activeName = ref("goodsDetail");
    return {
      activeName,
    };
  },
};
</script>

<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>