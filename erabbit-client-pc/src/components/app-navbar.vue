<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <router-link to="/member"
              ><i class="iconfont icon-user"></i>{{ profile.account }}
            </router-link>
          </li>
          <li><a @click="logout()" href="javascript:;">退出登录</a></li>
        </template>
        <template v-else>
          <li>
            <router-link to="/login">请先登录</router-link>
          </li>
          <li><a href="javascript:;">免费注册</a></li>
        </template>
        <li><a href="javascript:;">我的订单</a></li>
        <li><a href="javascript:;">会员中心</a></li>
        <li><a href="javascript:;">帮助中心</a></li>
        <li><a href="javascript:;">关于我们</a></li>
        <li>
          <a href="javascript:;"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { useStore } from "vuex";
import { computed } from "vue";
import { useRouter } from "vue-router";
import xtxCheckbox from "./library/xtx-checkbox.vue";
export default {
  components: { xtxCheckbox },
  name: "AppTopnav",
  setup(props) {
    const store = useStore();

    const profile = computed(() => {
      return store.state.user.profile;
    });
    const router = useRouter();
    const logout = () => {
      // 清空本地存储信息和清空vuex信息
      store.commit("user/setUser", {});
      // 清空购物车
      store.commit("cart/setCart", []);

      // 跳转登录
      router.push("/login");
    };

    return {
      profile,
      logout,
    };
  },
};
</script>
<style scoped lang="less">
.app-topnav {
  z-index: 6;
  background: #333;
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        // ~选择器的作用: 选择当前选择器的所有兄弟元素
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
