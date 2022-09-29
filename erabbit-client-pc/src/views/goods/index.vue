<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <!-- 商品信息左边 图片加销售情况 -->
        <div class="goods-info-left">
          <goods-image :images="goods.mainPictures"></goods-image>
          <goods-sales></goods-sales>
        </div>
        <!-- 商品信息右边 商品基本信息 -->
        <div class="goods-info-right">
          <goods-name :goods="goods"></goods-name>
          <!-- sku组件 -->
          <goods-sku :goods="goods" skuId="" @change="changeSku"></goods-sku>
          <!-- 数量组件 -->
          <xtx-numbox
            v-model="num"
            :max="goods.inventory"
            label="数量"
          ></xtx-numbox>
          <!-- 加入购物车按钮 -->
          <xtx-button @click="insertCart()" type="primary"
            >加入购物车</xtx-button
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 切换栏 -->
          <goods-tabs></goods-tabs>
          <!-- 注意事项 -->
          <goods-warn></goods-warn>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <goods-hot></goods-hot>
          <goods-hot :type="2"></goods-hot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from "./components/goods-relevant.vue";
import { findGoods } from "@/api/product";
import { nextTick, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import GoodsImage from "./components/goods-image.vue";
import GoodsSales from "./components/goods-sales.vue";
import GoodsName from "./components/goods-name.vue";
import GoodsSku from "./components/goods-sku.vue";
import XtxNumbox from "@/components/library/xtx-numbox.vue";
import XtxButton from "../../components/library/xtx-button.vue";
import GoodsTabs from "./components/goods-tabs.vue";
import GoodsHot from "./components/goods-hot.vue";
import GoodsWarn from "./components/goods-warn.vue";
import Message from "@/components/library/Message";
import { useStore } from "vuex";
export default {
  name: "XtxGoodsPage",
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    XtxNumbox,
    XtxButton,
    GoodsTabs,
    GoodsHot,
    GoodsWarn,
  },
  setup() {
    // 获取商品详情
    const goods = useGoods();
    // 修改商品价格信息库存等
    const changeSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price;
        goods.value.oldPrice = sku.oldPrice;
        goods.value.inventory = sku.inventory;
      }
      currSku.value = sku;
    };
    // 提供goods的数据给后代组件使用
    provide("goods", goods);

    // 默认商品购买数量
    const num = ref(1);
    const store = useStore();
    const currSku = ref(null);
    // 加入购物车
    const insertCart = () => {
      // 判断规格是否为完整
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value;
        const { id, name, price, mainPictures } = goods.value;
        console.log(currSku.value, goods.value);
        store.dispatch("cart/insertCart", {
          skuId,
          attrsText,
          stock, 
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          count: num.value,
          isEffective: true,
        }).then(() => {
        Message({ type: 'success',message: "添加购物车成功" });

        })
      } else {
        Message({ message: "请选择完整规格" });
      }
    };
    return { goods, changeSku, num, insertCart };
  },
};
// 单独定义一个获取商品详情的函数在外面 抽离出去 以防setup内函数过多
const useGoods = () => {
  const goods = ref(null);
  const route = useRoute();
  // 地址的id发生改变但是组件没有重新加载,需要使用watch监听
  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal && `/product/${newVal}` === route.path) {
        findGoods(route.params.id).then((data) => {
          // 每次路由发生变化先设置为空,这样relevant组件才能重新加载更新
          goods.value = null;
          nextTick(() => {
            // 先让上一句=null的生效以后,再执行这一句
            goods.value = data.result;
          });
        });
      }
    },
    { immediate: true }
  );

  return goods;
};
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .goods-info-left {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .goods-info-right {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
.xtx-button {
  margin-top: 20px;
}
</style>