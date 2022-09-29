  <template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="showAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{
            showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, " $1****$2")
          }}
        </li>
        <li>
          <span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g, '' )
          }}{{ showAddress.address }}
        </li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog()" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
    <!-- 对话框组件 -切换收货地址 -->
    <!-- vue3 v-model:visible 语法糖 拆解: (:visible + @update:visible) 原: :modelValue @update:modelValue-->
    <xtx-dialog v-model:visible="visibleDialog" title="切换收货地址">
      <div
        :class="{ active: selectedAddress && selectedAddress.id === item.id }"
        @click="selectedAddress = item"
        class="text item"
        v-for="item in list"
        :key="item.id"
      >
        <ul>
          <li>
            <span>收<i />货<i />人：</span>{{ item.receiver }}
          </li>
          <li>
            <span>联系方式：</span
            >{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/, " $1****$2") }}
          </li>
          <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '' ) + item.address }}</li>
        </ul>
      </div>
      <template #footer>
        <XtxButton
          @click="visibleDialog = false"
          type="gray"
          style="margin-right: 20px"
          >取消</XtxButton
        >
        <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
      </template>
    </xtx-dialog>
  </div>
  <!-- 收货地址添加编辑组件 -->
  <address-edit
    @on-success="successHandler"
    ref="addressEditCom"
  ></address-edit>
</template>
<script>
import { ref } from "vue";
import xtxDialog from "@/components/library/xtx-dialog.vue";
import AddressEdit from "./address-edit.vue";
export default {
  name: "CheckoutAddress",
  components: { xtxDialog, AddressEdit },
  props: {
    // list为父组件的order.userAddresses 为用户的地址列表数组
    list: {
      type: Array,
      default: [],
    },
  },
  // 在拥有根元素的组件中触发自定义组件,有没有emits选项无所谓
  // 如果你的组件渲染的代码片段中, vue3规范: 需要在emits中申明你触发的自定义事件
  emits: ["change"],
  setup(props, { emit }) {
    // 1.找到默认收货地址（defaultAddress）
    // 2.没有默认收货地址, 使用第一条收货地址
    // 3.如果没有数据, 提示添加数据
    const showAddress = ref(null);
    // isDefault: 是否为默认 0为是, 1为否
    const defaultAddress = props.list.find((item) => item.isDefault === 0);
    if (defaultAddress) {
      showAddress.value = defaultAddress;
    } else {
      if (props.list.length) {
        showAddress.value = props.list[0];
      }
    }
    const visibleDialog = ref(false);
    // 默认通知父组件一个收货地址id
    emit("change", showAddress.value && showAddress.value.id);
    const selectedAddress = ref(null);
    const confirmAddressFn = () => {
      // 1.将显示的地址换成选中的地址
      showAddress.value = selectedAddress.value;
      // 2.把选中的地址的id通知父组件
      emit("change", selectedAddress.value?.id);
      // 关闭对话框
      visibleDialog.value = false;
    };

    // 打开对话框(切换地址用)
    const openDialog = () => {
      // 数据在每次打开前重新置空
      visibleDialog.value = true;
      selectedAddress.value = null;
    };
    const addressEditCom = ref(null);

    // 打开编辑地址的对话框(添加地址和修改地址)
    const openAddressEdit = (address) => {
      console.log(address);
      // 区分修改和添加 添加address为空对象, 修改就是当前的地址
      addressEditCom.value.open(address);
    };
    const successHandler = (formData) => {
      // 如果是添加,就在最前面追加一条
      // address为将被修改的地址 formData为新的地址数据
      const address = props.list.find(item => item.id === formData.id) 
      if(address) {
        // 修改
        for(const key in address) {
          address[key] = formData[key];
        }
      }
      // 当我们在修改formData时,数组中的数据也会更新, 因为是同一引用地址
      // 啥时候修改formData, 当我们打开对话框需要清空之前的信息
      // 克隆formData数据
      const jsonStr = JSON.stringify(formData)
      props.list.unshift(JSON.parse(jsonStr));
    };
    return { 
      showAddress,
      visibleDialog,
      selectedAddress,
      confirmAddressFn,
      openDialog,
      openAddressEdit,
      addressEditCom,
      successHandler,
    };
  },
};
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    .body {
      height: 400px;
      overflow: auto;
    }
  }
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}

.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
