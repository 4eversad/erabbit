<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle()">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <goods-sku
        @change="changeSku"
        v-else
        :goods="goods"
        :skuId="skuId"
      ></goods-sku>
      <XtxButton @click="submit" type="primary" size="mini" style="margin-left: 60px"
        >确认</XtxButton
      >
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { getGoodsSku } from "@/api/cart";
import goodsSku from "../../goods/components/goods-sku.vue";
export default {
  components: { goodsSku },
  name: "CartSku",
  props: {
    attrsText: {
      type: String,
      default: "",
    },
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const target = ref(null);
    const visible = ref(false);
    const goods = ref("");
    // 是否在加载
    const loading = ref(false);
    // 打开
    const open = () => {
      visible.value = true;
      loading.value = true;
      // 每次打开规格选择框都重新获取规格参数
      getGoodsSku(props.skuId).then((data) => {
        // 获取商品的数据
        goods.value = data.result;
        loading.value = false;
      });
    };
    // 关闭
    const close = () => {
      visible.value = false;
    };
    // 切换
    const toggle = () => {
      visible.value ? close() : open();
    };
    // 点击其他地方时关闭
    onClickOutside(target, () => {
      close();
    });
    // 监听sku的改变
    const currSku = ref(null);
    const changeSku = (sku) => {
      currSku.value = sku;
    };
    // 点击确认后修改商品的规格数据,并且进行更新
    const submit = () => {
      // 当currSku有值时, 且修改后的skuId与原先的skuId不同时才对父组件进行通知
      if(currSku.value && currSku.value.skuId && currSku.value.skuId != props.skuId) {
        emit('change', currSku.value)
        close();
      }

    };
    return {
      visible,
      open,
      close,
      toggle,
      target,
      goods,
      loading,
      changeSku,
      currSku,
      submit,
    };
  },
};
</script>

<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(~@/assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
