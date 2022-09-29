<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:;"
          @click="changeBrand(item.id)"
          :class="{ active: item.id === filterData.brands.selectedBrand }"
          v-for="item in filterData.brands"
          >{{ item.name }}
         </a
        >
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item">
      <div class="head">{{ item.name }}:</div>
      <div class="body">
        <a
          href="javascript:;"
          @click="changeProp(item, prop.id)"
          :class="{ active: prop.id === item.selectedAttr }"
          v-for="prop in item.properties"
          :key="item.id"
          >{{ prop.name }}
        </a>
      </div>
    </div>
  </div>
  <div class="sub-filter" v-else>
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { findSubCategoryFilter } from "@/api/category";

export default {
  name: "SubFilter",
  setup(props, { emit }) {
    const route = useRoute();
    // 筛选后的数据
    const filterData = ref(null);
    const filterLoading = ref(false);

    // 在品牌和属性前面都加上'全部'选项
    // ------------------------------------------------------
    watch(
      () => route.params.id,
      (newVal) => {
        // 有值,且值为二级类目下的id
        if (newVal && `/category/sub/${newVal}` === route.path) {
          // 加载中
          filterLoading.value = true;
          findSubCategoryFilter(route.params.id).then((data) => {            
            // 每一组筛选缺少'全部'选项,需要追加到前面
            // 品牌前追加,id设置为空,这样就没有筛选条件
            // 每个品牌前面加上选中的属性
            data.result.brands.selectedBrand = null;
            data.result.brands.unshift({ id: null, name: "全部" });
            // 每个saleProperties中的properties前面加
            data.result.saleProperties.forEach((item) => {
              item.selectedAttr = null;
              item.properties.unshift({ id: null, name: "全部" });
            });
            filterData.value = data.result;
            // 加载完成 
            filterLoading.value = false;
          });
        }
      },
      { immediate: true }
    );
    // 获取筛选参数的函数
    // ----------------------------------------------------------
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] };
      // 参考数据: {brandId: 'xxxx', attrs:[{groupName: '颜色'}, {propertyName: '蓝色'}]}
      // 品牌  
      obj.brandId = filterData.value.brands.selectedBrand;
      // saleProperties包括不同的产品属性,如颜色/规格...
      // properties是每种属性不同的分类, 如蓝色/红色/黄色...
      filterData.value.saleProperties.forEach((item) => {
        // 找出正在点击的某一个商品属性的分类
        // 记得一定要判断这个条件, 否则会多出几个数组
        if (item.selectedAttr) {
          const prop = item.properties.find(
            (prop) => prop.id === item.selectedAttr
          );
          obj.attrs.push({ groupName: item.name, propertyName: prop.name });
        }
      });
      return obj;
    };
    // 修改品牌筛选条件
    // -------------------------------------------------------
    const changeBrand = (brandId) => {
      if (filterData.value.selectedBrand === brandId) return;
      filterData.value.brands.selectedBrand = brandId;
      
      emit("filterChange", getFilterParams());
    };
    // 修改属性筛选条件
    const changeProp = (item, propId) => {
      if (item.selectedAttr === propId) return;
      item.selectedAttr = propId;
      // 通知父组件筛选条件改变,同时调用函数,返回获取筛选的品牌和属性条件的对象给filterChange
      emit("filterChange", getFilterParams());
    };

    return {
      filterData,
      filterLoading,
      changeBrand,
      changeProp,
      getFilterParams,
    };
  },
};
</script>

<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}

.sub-category {
  min-height: 1000px;
  background-color: #f5f5f5;
}
.sub-bread {
  display: flex;
  padding: 25px 10px;
}
.sub-filter {
  background: #fff;
  padding: 25px;
  .xtx-skeleton {
    padding: 10px 0;
  }
}
</style>