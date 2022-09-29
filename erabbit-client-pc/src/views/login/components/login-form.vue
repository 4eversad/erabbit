<template>
  <div class="account-box">
    <div class="toggle">
      <a href="javascript:;" @click="isMsgLogin = false" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a href="javascript:;" @click="isMsgLogin = true" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      ref="formCom"
      class="form"
      :validation-schema="schema"
      autocomplete="false"
      v-slot="{ errors }"
    >
      <!-- 账号登录 -->
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <!-- 用户名错误提示 -->
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <!-- 密码错误提示 -->
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <!-- 短信登录 -->
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              v-model="form.mobile"
              name="mobile"
              type="text"
              placeholder="请输入手机号"
            />
          </div>
          <!-- 手机号错误提示 -->
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              v-model="form.code"
              name="code"
              type="text"
              placeholder="请输入验证码"
            />
            <button @click="send()" class="code">
              {{ time === 0 ? "发送验证码" : `${time}秒后发送` }}
            </button>
          </div>
          <!-- 验证码错误提示 -->
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <!-- 同意协议 -->
      <div class="form-item">
        <div class="agree">
          <!-- 勾选框 -->
          <Field as="xtxCheckbox" name="isAgree" v-model="form.isAgree"></Field>
          <!-- <xtx-checkbox v-model="form.isAgree"></xtx-checkbox> -->

          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <!-- 提示用户勾选登录协议 -->
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />{{ errors.isAgree }}
        </div>
      </div>
      <a @click="login()" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { onUnmounted, reactive, ref, watch } from "vue";
import { Form, Field } from "vee-validate";
import xtxCheckbox from "../../../components/library/xtx-checkbox.vue";
import schema from "@/utils/vee-validate-schema";
import XtxMessage from "../../../components/library/xtx-message.vue";
import Message from "../../../components/library/Message";

import {
  userAccountLogin,
  userMobileLoginMsg,
  userMobileLogin,
} from "@/api/user";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useIntervalFn } from "@vueuse/core";
import QC from "qc";

export default {
  components: { xtxCheckbox, Form, Field, XtxMessage },
  name: "LoginForm",
  setup(props, { emit }) {
    // 切换短信登录

    const isMsgLogin = ref(false);

    // 表单数据对象
    let form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null,
    });

    // vee校验步骤
    // 1.导入组件,使用组件 加上name:校验规则
    // 2.每个field需要进行数据绑定,字段名称最好和后台接口需要的一致
    // 3.定义name属性指定的校验规则函数 form的validation-schema接收定义好的校验规则函数
    // 4.自定义组件需要校验必须先支持v-model, 然后Field使用as指定组件名称
    const mySchema = {
      // 校验函数规则, 返回true就是校验成功,返回一个字符串(错误信息)就是校验失败
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree,
    };

    const formCom = ref(null);
    // 监听isMsgLogin来重置表单数据(数据+校验结果)
    watch(isMsgLogin, (newVal) => {
      form.isAgree = true;
      form.account = null;
      form.password = null;
      form.mobile = null;
      form.code = null;
      formCom.value.resetForm();
      // console.log("登录方式为短信登录:" + newVal);

      //  form组件提供一个清除校验结果的方法 resetForm  用ref
    });
    // 登录时整体校验方法:
    const store = useStore();
    // route-获取路由信息的
    const route = useRoute();
    // router-调API方法的
    const router = useRouter();
    const login = async () => {
      // form组件提供一个校验表单的整体的结果 使用validate函数 返回的是一个Promise
      const valid = await formCom.value.validate();
      // valid为true/false
      if (valid) {
        try {
          let data = null;
          // 注意此处的判断;
          if (isMsgLogin.value) {
            // 短信登录
            // 2.手机号登录
            // 2.1 准备一个API做手机号登录
            // 2.2 调用API
            // 2.3 成功: 存储用户信息+跳转到来源页或者首页+消息提示
            // 失败: 提示
            const { mobile, code } = form;
            data = await userMobileLogin({ mobile, code });
            console.log(data);
          } else {
            console.log("账号登录中");

            // 账号登录
            // 1.准备一个API做账号登录
            // 2.调用API
            // 3.成功: 存储用户信息+跳转到来源页或者首页+消息提示
            // 失败: 提示
            const { account, password } = form;
            data = await userAccountLogin({ account, password });
          }
          const { id, account, avatar, mobile, nickname, token } = data.result;
          store.commit("user/setUser", {
            id,
            account,
            avatar,
            mobile,
            nickname,
            token,
          });
          // 进行跳转
          store.dispatch("cart/mergeCart").then(() => {
            router.push(route.query.redirectUrl || "/");
            Message({ type: "success", message: "登录成功" });
          });
        } catch (e) {
          if (e.response.data) {
            Message({
              type: "error",
              message: e.response.data.message || "登录失败",
            });
          }
        }
      }
    };
    const time = ref(0);
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
          await userMobileLoginMsg(form.mobile);
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

    return {
      isMsgLogin,
      form,
      schema: mySchema,
      login,
      formCom,
      send,
      time,
    };
  },
};
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
          border: none;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>