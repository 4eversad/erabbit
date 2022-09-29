<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <sub-bread></sub-bread>
      <!-- 筛选区 -->
      <sub-filter @filterChange="filterChange"></sub-filter>
      <!-- 其实就相当于:modelValue="isAllChecked"
       @update:modelValue="(checked.value) => {isAllChecked=Checked.value}"-->
      <!-- <xtx-checkbox v-model="isAllChecked"></xtx-checkbox> {{isAllChecked}} -->

      <!-- 商品面板(排序组件+列表) -->
      <div class="goods-list">
        <sub-sort @sortChange="sortChange"></sub-sort>
        <!-- 筛选结果区域 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <goods-item :goods="goods"></goods-item>
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <xtx-infinite-loading
          @infinite="getData"
          :loading="loading"
          :finished="finished"
        ></xtx-infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
import XtxCheckbox from "../../components/library/xtx-checkbox.vue";
import subBread from "./components/sub-bread.vue";
import SubFilter from "./components/sub-filter.vue";
import { ref, watch } from "vue";
import SubSort from "./components/sub-sort.vue";
import GoodsItem from "./components/goods-item.vue";
import XtxInfiniteLoading from "../../components/library/xtx-infinite-loading.vue";
import { findSubCategoryGoods } from "@/api/category";
import { useRoute } from "vue-router";

export default {
  components: {
    subBread,
    SubFilter,
    XtxCheckbox,
    SubSort,
    GoodsItem,
    XtxInfiniteLoading,
  },
  name: "SubCategory",
  setup() {
    const loading = ref(false);
    const finished = ref(false);
    const route = useRoute();
    // 商品列表
    const goodsList = ref([]);
    // 请求参数(页码+请求数量)
    let reqParams = {
      page: 1,
      pageSize: 20,
    };
    const getData = () => {
      // 加载中
      loading.value = true;
      reqParams.categoryId = route.params.id;
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          // 有数据就追加数据 由于result.items是数组形式的,所以用...解构来追加
          goodsList.value.push(...result.items);
          // page改为下一页
          reqParams.page++;
          // 加载完成
        } else {
          // 没有数据的情况
          finished.value = true;
        }
        loading.value = false;
      });
    };
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && `/category/sub/${newVal}` === route.path) {
          finished.value = false;
          goodsList.value = [];
          reqParams = {
            page: 1,
            pageSize: 20,
          };
        }
      },
      { immediate: true }
    );

    // 更改排序组件的筛选数据,重新请求
    const sortChange = (sortParams) => {
      finished.value = false;
      reqParams = { ...reqParams, ...sortParams };
      reqParams.page = 1;
      goodsList.value = [];
    };
    // 筛选条件
    const filterChange = (filterParams) => {
      // 更改筛选组件的筛选数据,重新请求
      finished.value = false;
      reqParams = { ...reqParams, ...filterParams };
      reqParams.page = 1;
      goodsList.value = [];
    };

    return {
      getData,
      loading,
      finished,
      goodsList,
      reqParams,
      sortChange,
      filterChange,
    };
  },
};
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>