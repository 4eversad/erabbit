<template>
  <div class="member-order">
    <!-- <h1>订单列表页</h1> -->
    <xtx-tabs v-model="activeName" @tab-click="tabClick">
      <xtx-tabs-panel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </xtx-tabs-panel>
    </xtx-tabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <order-item
        @on-cancel="handlerCancel"
        @on-delete="handlerDelete"
        @on-confirm="handlerConfirm"
        @on-logistics="handlerLogistics"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      ></order-item>
    </div>

    <!-- 分页组件 -->
    <xtx-pagination
      v-if="total > 0"
      :currentPage="reqParams.page"
      :pageSize="reqParams.pageSize"
      :total="total"
      @currentChange="reqParams.page = $event"
    ></xtx-pagination>
    <!-- 取消原因组件 -->
    <order-cancel ref="orderCancelCom"></order-cancel>
    <order-logistics ref="orderLogisticsCom"></order-logistics>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { findOrderList, deleteOrder, confirmOrder } from "@/api/order";
import { orderStatus } from "@/api/constants";
import XtxTabsPanel from "../../../components/library/xtx-tabs-panel.vue";
import xtxTabs from "../../../components/library/xtx-tabs.vue";
import XtxPagination from "../../../components/library/xtx-pagination.vue";
import OrderItem from "./components/order-item.vue";
import OrderCancel from "./components/order-cancel.vue";
import Confirm from "@/components/library/Confirm";
import Message from "@/components/library/Message";
import OrderLogistics from "./components/order-logistics.vue";

export default {
  components: {
    xtxTabs,
    XtxTabsPanel,
    XtxPagination,
    OrderItem,
    OrderCancel,
    OrderLogistics,
  },
  name: "MemberOrder",
  setup(props, { emit }) {
    const activeName = ref("all");
    const loading = ref(false);
    const total = ref(0);
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0,
    });
    const orderList = ref([]);
    // 重新获取列表
    const getOrderList = () => {
      loading.value = true;
      findOrderList(reqParams).then((data) => {
        orderList.value = data.result.items;
        total.value = data.result.counts;
        loading.value = false;
      });
    };
    watch(
      reqParams,
      () => {
        getOrderList();
      },
      { immediate: true }
    );

    // 点击tab切换展示不同内容
    const tabClick = ({ index }) => {
      reqParams.page = 1;
      reqParams.orderState = index;
    };

    // 删除订单
    const handlerDelete = (order) => {
      Confirm({ text: "你确认要删除此商品吗?" })
        .then(() => {
          deleteOrder(order.id).then(() => {
            Message({ type: "success", message: "删除成功" });
            getOrderList();
          });
        })
        .catch(() => {});
    };

    return {
      activeName,
      tabClick,
      orderStatus,
      orderList,
      orderStatus,
      loading,
      reqParams,
      total,
      orderCancelCom,
      handlerDelete,
      ...useCancel(),
      ...useConfirm(),
      ...useLogistics(),
    };
  },
};
// 取消订单业务
const orderCancelCom = ref(null);
export const useCancel = () => {
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order);
  };
  return { handlerCancel, orderCancelCom };
};

// 确认收货
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: "确认收货吗?收货后货款将打给卖家。" })
      .then(() => {
        // 发送请求
        confirmOrder(order.id).then(() => {
          Message({ type: "success", message: "确认收货成功" });
          order.orderState = 4;
        });
      })
      .catch(() => {});
  };
  return {
    handlerConfirm,
  };
};

// 查看物流
const orderLogisticsCom = ref(null);
const useLogistics = () => {
  const handlerLogistics = (order) => {
    console.log(orderLogisticsCom.value);

    orderLogisticsCom.value.open(order);
  };
  return {
    handlerLogistics,
    orderLogisticsCom,
  };
};
</script>

<style scoped lang="less">
.order-list {
  background: #fff;
  padding: 20px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(~@/assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
