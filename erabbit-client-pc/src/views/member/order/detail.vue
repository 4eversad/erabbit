<template>
  <div class="member-order" v-if="order">
    <!-- 头部 -->
    <detail-action :order="order"></detail-action>
    <!-- 进度 -->
    <detail-steps :order="order"></detail-steps>
    <!-- 物流 -->
    <detail-logistics
      v-if="[3, 4, 5].includes(order.orderState)"
      :order="order"
    ></detail-logistics>
    <!-- 信息 -->
    <detail-info :order="order"></detail-info>
  </div>
</template>

<script>
import { ref } from "vue";
import detailAction from "./components/detail-action.vue";
import { useRoute } from "vue-router";
import { findOrderDetail } from "@/api/order";
import DetailSteps from "./components/detail-steps.vue";
import DetailLogistics from "./components/detail-logistics.vue";
import DetailInfo from './components/detail-info.vue';
export default {
  components: { detailAction, DetailSteps, DetailLogistics, DetailInfo },
  name: "MemberDetail",
  setup(props, { emit }) {
    const route = useRoute();
    const order = ref(null);
    findOrderDetail(route.params.id).then((data) => {
      order.value = data.result;
    });
    return {
      order,
    };
  },
};
</script>

<style scoped lang="less">
</style>
