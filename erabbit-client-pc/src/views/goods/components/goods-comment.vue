  <template>
  <div class="goods-comment">
    <!-- 评价头部  -->
    <div class="head">
      <div class="data" v-if="commentInfo">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags" v-if="commentInfo">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            v-for="(item, index) in commentInfo.tags"
            :key="item.title"
            :class="{ active: currIndex === index }"
            @click="changeTag(index)"
            >{{ item.title }}({{ item.tagCount }})</a
          >
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
        @click="changeSort(null)"
        >默认</a
      >
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
        @click="changeSort('createTime')"
        >最新</a
      >
      <a
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
        @click="changeSort('praiseCount')"
        >最热</a
      >
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i
              v-for="i in item.score"
              :key="i + 's'"
              class="iconfont icon-wjx01"
            ></i>
            <i
              v-for="i in 5 - item.score"
              :key="i + 'k'"
              class="iconfont icon-wjx02"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <!-- 评论图片组件 -->
          <goods-comment-image
            v-if="item.pictures.length"
            :pictures="item.pictures"
          ></goods-comment-image>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <xtx-pagination
      :total="total"
      :pageSize="reqParams.pageSize"
      :currentChange="reqParams.page"
      @currentPage="changePageFn"
      v-if="total "
    ></xtx-pagination>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { findGoodsCommentInfo, findGoodsCommentList } from "@/api/product";
import { useRoute } from "vue-router";
import goodsCommentImage from "./goods-comment-image.vue";
import XtxPagination from "../../../components/library/xtx-pagination.vue";

export default {
  components: { goodsCommentImage, XtxPagination },
  name: "GoodsComment",
  setup(props, { emit }) {
    const commentInfo = ref(null);
    const route = useRoute();
    // ------------------------------
    // 获取评价信息
    findGoodsCommentInfo(route.params.id).then((data) => {
      // 设置数据之前在前面追加全部评价tag和有图tag
      data.result.tags.unshift({
        title: "有图",
        tagCount: data.result.hasPictureCount,
        // 添加标识 方便切换筛选条件
        type: "img",
      });
      data.result.tags.unshift({
        title: "全部评价",
        tagCount: data.result.evaluateCount,
        type: "all",
      });
      commentInfo.value = data.result;
    });
    // -----------------------------------
    // 激活tag
    const currIndex = ref(0);

    // ----------------------------------
    // 切换评价tag
    const changeTag = (index) => {
      currIndex.value = index;
      // 切换时更改筛选条件
      const tag = commentInfo.value.tags[index];
      // 情况1: 全部评价(都为null,此时查询全部评价)
      if (tag.type === "all") {
        reqParams.hasPicture = null;
        reqParams.tag = null;
      }
      // 情况2: 有图(此时hasPicture为true)
      else if (tag.type === "img") {
        reqParams.hasPicture = true;
        reqParams.tag = null;
      }
      // 情况3: 正常tag(此时tag为true)
      else {
        reqParams.hasPicture = null;
        reqParams.tag = tag.title;
      }
      // 重置页码 在此处比较合适,不要放在watch里,不然有问题
      reqParams.page = 1;
    };
    // ----------------------------------------
    // 切换排序功能
    const changeSort = (sortField) => {
      reqParams.sortField = sortField;
    };

    // ---------------------------------------
    // 准备筛选条件数据
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 排序方式: praiseCount 热度 createTime 最新
      sortField: null,
    });

    // 在初始化时和切换筛选条件时发请求
    const commentList = ref([]);
    // 定义评价总条数
    const total = ref(0);
    watch(
      reqParams,
      () => {
        findGoodsCommentList(route.params.id, reqParams).then((data) => {
          commentList.value = data.result.items;
          total.value = data.result.counts;
          console.log(commentList.value);
        });
      },
      { immediate: true }
    );

    // 定义转换数据的函数(修改specs的函数)
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name} ${c.nameValue}`, "").trim();
    };
    // 格式化昵称(匿名)
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + "****" + nickname.substr(-1);
    };

    // 实现分页切换
    const changePageFn = (newPage) => {
      reqParams.page = newPage;
    };

    // -------------------------------
    return {
      commentInfo,
      currIndex,
      changeTag,
      reqParams,
      commentList,
      changeSort,
      formatSpecs,
      formatNickname,
      total,
      changePageFn,
    };
  },
};
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
}
.list {
  padding: 0 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }
    .text {
      color: #666;
      line-height: 24px;
    }
    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>