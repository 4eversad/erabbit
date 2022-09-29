<template>
  <ul class="app-header-nav">
    <li class="home"><RouterLink to="/">首页</RouterLink></li>
    <li
      v-for="item in list"
      :key="item.id"
      @mousemove="show(item)"
      @mouseleave="hide(item)"
    >
      <router-link @click="hide(item)" :to="`/category/${item.id}`">
        {{ item.name }}
      </router-link>

      <!-- 弹出层 -->
      <div class="layer" :class="{ open: item.open }">  
        <ul >
          <li v-for="sub in item.children" :key="sub.id">
            <RouterLink @click="hide(item)" :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture" alt="" />
              <p>{{ sub.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  setup(props) {
    const store = useStore();
    // list指的是category分类板块里的state的list
    const list = computed(() => {
      return store.state.category.list;
    });

    //跳转的时候不会关闭弹窗,需要用数据来控制
    //vuex每个分类加上open数据
    //vuex提供显示和隐藏函数来修改open的数据
    //在组件中使用vuex的mutations中的函数

    const show = (item) => {
      store.commit("category/show", item.id);
    };
    const hide = (item) => {
      store.commit("category/hide", item.id);
    };
    return { list, show, hide };
  },
};
</script>

<style lang="less" scoped>
.app-header-nav {
  position: relative;
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;
    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }
    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }

      // 子分类
    }
  }
}
.layer {
  &.open {
    // 用css解析出来就是 .layer.open (注意中间没有空格)
    // 中间没有空格的选择器表示一个元素要同时拥有这两个类名,这个类才会生效
    // 也就是说 class = 'layer open'才生效
    height: 132px;
    opacity: 1;
  }
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 70px;
    align-items: center;
    height: 132px;
    li {
      width: 110px;
      text-align: center;
      img {
        width: 60px;
        height: 60px;
      }
      p {
        padding-top: 10px;
      }
      &:hover {
        p {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>




