<template>
  <XtxBread>
    <xtx-bread-item to="/">首页</xtx-bread-item>
    <xtx-bread-item v-if="category.top" :to="`/category/${category.top.id}`"
      >{{ category.top.name }}
    </xtx-bread-item>
    <xtx-bread-item v-if="category.sub" :to="`/category/sub/${category.sub.id}`"
      >{{ category.sub.name }}
    </xtx-bread-item>
  </XtxBread>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";
export default {
  components: {},
  name: "SubCategory",

  setup(props) {
    const store = useStore();
    const route = useRoute();
    const category = computed(() => {
      const cate = {};
      // 由于当前是在二级类目中,vuex中的list是一级类目的,所以要从一级类目开始遍历
      store.state.category.list.forEach((top) => {
        if (top.children) {
          const sub = top.children.find((sub) => {
            return sub.id === route.params.id;
          });
          if (sub) {
            cate.top = { id: top.id, name: top.name };
            cate.sub = { id: sub.id, name: sub.name };
          }
        }
      });
      return cate;
    });
    return {
      category,
    };
  },
};
</script>