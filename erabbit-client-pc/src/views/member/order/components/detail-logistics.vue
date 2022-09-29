<template>
  <div class="detail-logistics" v-if="list">
    <p>
      <span>{{ list[0].text }}</span>
      <span>{{ list[0].time }}</span>
    </p>
    <a href="javascript:;">查看物流</a>
  </div>
</template>
<script>
import { ref } from "vue";
import { logisticsOrder } from "@/api/order";
export default {
  name: "DetailLogistics",
  props: {
    order: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    const list = ref(null);
    logisticsOrder(props.order.id).then((data) => {
      list.value = data.result.list;
    });
    return { list };
  },
};
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>

