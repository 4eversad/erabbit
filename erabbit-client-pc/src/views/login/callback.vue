<template>
  <LoginHeader>联合登录</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>

  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId="unionId" />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId="unionId" />
    </div>
  </section>

  <LoginFooter />
</template>

<script>
import { ref } from "vue";
import LoginHeader from "./components/login-header.vue";
import LoginFooter from "./components/login-footer.vue";
import CallbackBind from "./components/callback-bind.vue";
import CallbackPatch from "./components/callback-patch.vue";
import QC from "qc";
import { userQQLogin } from "@/api/user";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "PageCallback",
  components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
  setup() {
    const hasAccount = ref(true);
    //  默认认为已经注册且已经绑定
    const isBind = ref(false);
    const store = useStore();
    const router = useRouter();
    const unionId = ref(null);
    // 通过QQ的API获取openID就是后台需要的unionID然后进行登录
    // 如果失败,就是意味qq还未和小兔鲜进行绑定

    // 确保QQ已经登录
    if (QC.Login.check()) {
      // 第三方唯一标识,QQ唯一标识
      QC.Login.getMe((openId) => {
        unionId.value = openId;
        userQQLogin(openId)
          .then((data) => {
            console.log("登录成功");
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
              Message({ type: "success", message: "QQ登录成功" });
            });
          })
          .catch((e) => {
            // 登录失败,也就是没有绑定
            console.log("未绑定,登录失败");
            isBind.value = false;
          });
      });
    }

    return { hasAccount, isBind, unionId };
  },
};
</script>

<style scoped lang='less'>
.container {
  position: relative;
  padding: 25px 0;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
 