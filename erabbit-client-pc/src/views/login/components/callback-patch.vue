<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{ errors }"
    class="xtx-form"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          :class="{ err: errors.account }"
          v-model="form.account"
          name="account"
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="errors.account">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{ err: errors.account }"
          v-model="form.mobile"
          name="mobile"
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{ err: errors.code }"
          v-model="form.code"
          name="code"
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span @click="send()" class="code">
          {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
        </span>
      </div>
      <div class="error" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.password }"
          v-model="form.password"
          name="password"
          class="input"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="errors.password">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{ err: errors.rePassword }"
          v-model="form.rePassword"
          name="rePassword"
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="errors.rePassword">{{ errors.rePassword }}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import schema from "@/utils/vee-validate-schema";

import { useIntervalFn } from "@vueuse/core";
import Message from "@/components/library/Message";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Form, Field } from "vee-validate";
import { reactive, ref, onUnmounted } from "vue";
import { userQQPatchCode, userQQPatchLogin } from "@/api/user";
export default {
  name: "CallbackPatch",
  props: {
    unionId: {
      type: String,
      default: "",
    },
  },
  components: {
    Form,
    Field,
  },
  setup(props, { emit }) {
    // 表单校验: 用户名是否存在+两次密码输入是否一致
    // 发送验证码
    // ----------------------------------------------------------------------
    // 发送短信验证码
    const time = ref(0);
    const formCom = ref(null);
    // pause函数-暂停(销毁) resume-打开 3个参数: 回调函数+执行间隔+是否立即开启定时器
    const { pause, resume } = useIntervalFn(
      () => {
        time.value--;
        if (time.value <= 0) {
          pause();
        }
      },
      1000,
      { immediate: false }
    );
    onUnmounted(() => {
      // 销毁定时器
      pause();
    });
    const send = async () => {
      // 1. 发送验证码
      // 1.1 绑定发送验证码按钮点击事件
      // 1.2 校验手机号 如果成功才发验证码,并开启60s的倒计时,倒计时中不能再次点击,结束后恢复
      // 1.3 如果失败,那就返回校验结果
      const valid = mySchema.mobile(form.mobile);
      if (valid === true) {
        // 通过
        // 没有倒计时才可以发送请求
        if (time.value === 0) {
          userQQPatchCode(form.mobile)
            .then((res) => {})
            .catch((e) => console.log(e));

          Message({ type: "success", message: "发送验证码成功" });
          // 成功发送验证码以后将时间改为60秒
          time.value = 60;
          // 开启倒计时
          resume();
        }
      } else {
        // 失败 使用vee的错误函数,显示错误信息 setFieldError(字段, 错误信息) 设置字段错误
        formCom.value.setFieldError("mobile", valid);
      }
    };
    // -----------------------------------------------------------------
    // 完善信息

    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null,
    });
    // 校验规则
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword,
    };
    // 立即绑定----------------------------------------
    // 立即绑定
    const store = useStore();
    const router = useRouter();
    const submit = async () => {
      console.log("点击了立刻绑定");
      // 先整体校验,再绑定
      const valid = formCom.value.validate();
      if (valid) {
        // 表示校验通过
        userQQPatchLogin({
          unionId: props.unionId,
          ...form,
        })
          .then((data) => {
            console.log("绑定成功");
            // 登录成功 data.result就是用户信息
            // 1.存储用户信息到vuex中
            const { id, account, avatar, mobile, nickname, token } =
              data.result;
            store.commit("user/setUser", {
              id,
              account,
              avatar,
              mobile,
              nickname,
              token,
            });
            store.dispatch("cart/mergeCart").then(() => {
              // 2.跳转到来源页
              router.push(store.state.user.redirectUrl);
              // 3.成功提示
              Message({ type: "success", message: "完善信息成功" });
            });
          })
          .catch((e) => {
            Message({ type: "error", message: "绑定失败" });
            console.log("绑定失败");
          });
      } else {
        console.log("未通过校验");
      }
    };
    return {
      form,
      mySchema,
      time,
      send,
      submit,
      formCom,
    };
  },
};
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>

