<template>
  <div class="xtx-pagination">
    <a
      @click="changePager(myCurrentPage - 1)"
      v-if="myCurrentPage > 1"
      href="javascript:;"
      >上一页</a
    >
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a
      v-for="i in pager.btnArr"
      :key="i"
      href="javascript:;"
      :class="{ active: i === myCurrentPage }"
      @click="changePager(i)"
      >{{ i }}</a
    >
    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      @click="changePager(myCurrentPage + 1)"
      v-if="myCurrentPage < pager.pageCount"
      href="javascript:;"
      >下一页</a
    >
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from "vue";
export default {
  name: "XtxPagination",
  props: {
    total: {
      type: Number,
      default: 100,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    // 需要的数据
    // 1.约定按钮的个数: 5个
    const count = 5;
    // 2.当前显示的页码
    const myCurrentPage = ref(1);
    // 3.页数=总条数/每页显示条数 + 向上取整
    // 总条数
    const myTotal = ref(100);
    // 每页显示条数
    const myPageSize = ref(10);
    // 其他数据(总页数, 起始按钮, 结束按钮, 按钮数组) 依赖上面的数据得到
    const pager = computed(() => {
      const pageCount = Math.ceil(myTotal.value / myPageSize.value);
      // 按钮当前个数和当前页码 ===> 起始按钮, 结束按钮, 按钮数组
      // 理想情况
      const offset = Math.floor(count / 2);
      let start = myCurrentPage.value - offset;
      let end = start + count - 1;
      // 如果起始页小于1需要处理
      if (start < 1) {
        start = 1;
        end = start + count - 1 > pageCount ? pageCount : start + count - 1;
      }
      if (end > pageCount) {
        end = pageCount;
        start = end - count + 1 < 1 ? 1 : end - count + 1;
      }
      const btnArr = [];
      for (let i = start; i <= end; i++) {
        btnArr.push(i);
      }

      return {
        pageCount,
        btnArr,
        start,
        end,
      };
    });
    // 监听props的变化更新组件内数据
    watch(
      props,
      () => {
        // 改变数据
        myTotal.value = props.total;
        myPageSize.value = props.pageSize;
        myCurrentPage.value = props.currentPage;
      },
      { immediate: true }
    );

    // 切换分页函数
    const changePager = (page) => {
      myCurrentPage.value = page;
      emit("currentChange", page);
    };

    return {
      myCurrentPage,
      pager,
      changePager,
    };
  },
};
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
