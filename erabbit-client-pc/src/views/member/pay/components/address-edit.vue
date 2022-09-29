<template>
  <XtxDialog
    :title="`${formData.id ? '修改' : '添加'}收货地址`"
    v-model:visible="visibleDialog"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              v-model="formData.receiver"
              class="input"
              placeholder="请输入收货人"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              v-model="formData.contact"
              class="input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              :fullLocation="formData.fullLocation"
              @change="changeCity"
              placeholder="请选择所在地区"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              v-model="formData.address"
              class="input"
              placeholder="请输入详细地址"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              v-model="formData.postalCode"
              class="input"
              placeholder="请输入邮政编码"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              v-model="formData.addressTags"
              class="input"
              placeholder="请输入地址标签，逗号分隔"
            />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <XtxButton
        @click="visibleDialog = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>

<script>
import { reactive, ref } from "vue";
import XtxDialog from "../../../../components/library/xtx-dialog.vue";
import { addAddress } from "@/api/order";
import { editAddress } from "@/api/order";
import Message from "@/components/library/Message";

export default {
  components: { XtxDialog },
  setup(props, { emit }) {
    const visibleDialog = ref(false);
    // 定义一个open函数, 作为打开对话框的函数(组件实例拥有open函数)
    const open = (address) => {
      if (address.id) {
        // 如果有id, 那就是将修改,否则就是清空
        visibleDialog.value = true;
        for (const key in address) {
          formData[key] = address[key];
        }
      } else {
        visibleDialog.value = true;
        for (const key in formData) {
          if (key === "isDefault") {
            formData[key] = 1;
          } else {
            formData[key] = null;
          }
        }
      }
    };
    // 定义表单数据
    const formData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      // 城市组件显示文字,完整行政区地址
      fullLocation: null,
    });
    const changeCity = (result) => {
      formData.provinceCode = result.provinceCode;
      formData.cityCode = result.cityCode;
      formData.countyCode = result.countyCode;
      formData.fullLocation = result.fullLocation;
    };
    // 提交地址(修改);
    const submit = () => {
      if (formData.id) {
        // 修改地址
        editAddress(formData).then((data) => {
          Message({ type: "success", message: "修改地址成功" });
          // 挂壁对话框
          visibleDialog.value = false;  
          // 需要在地址(切换地址)列表中加一条,触发自定义事件
          emit("on-success", formData);
        });
      } else {
        // 添加地址
        // 发送请求
        addAddress(formData).then((data) => {
          formData.id = data.result.id;
          Message({ type: "success", message: "添加地址成功" });
          // 挂壁对话框
          visibleDialog.value = false;
          // 需要在地址(切换地址)列表中加一条,触发自定义事件
          emit("on-success", formData);
        });
      }
    };

    return { visibleDialog, open, formData, formData, changeCity, submit };
  },
};
</script>

<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>