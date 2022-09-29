<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle()" :class="{ active: visible }">
      <!-- 没有完整地址时使用这个span -->
      <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
      <!-- 有完整地址时会显示这个span -->
      <span class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-show="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span
          @click="changeItem(item)"
          class="ellipsis"
          v-for="item in currList"
          :key="item.code"
        >
          {{ item.name }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import axios from "axios";
export default {
  name: "XtxCity",
  props: {
    fullLocation: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "请选择配送地址",
    },
  },
  setup(props, { emit }) {
    const visible = ref(false);
    // 定义城市数据的变量
    const allCityData = ref([]);
    // 正在加载数据
    const loading = ref(false);
    // 提供打开和关闭两种方法
    const open = () => {
      // 每次重新点开都清空,可以重新选择地区
      for (const key in changeResult) {
        changeResult[key] = "";
      }
      visible.value = true;
      loading.value = true;
      // 获取地区数据
      getCityData().then((data) => {
        allCityData.value = data;
        loading.value = false;
      });
    };
    const close = () => {
      visible.value = false;
    };
    // 提供一个切换函数
    const toggle = () => {
      visible.value ? close() : open();
    };
    // 点击元素外部关闭城市选择框
    const target = ref(null);
    onClickOutside(target, () => {
      // 只有点击了元素外部才会触发该事件
      close();
    });
    // 使用计算属性,显示当前需要展示的地区信息
    const currList = computed(() => {
      // 默认为省一级
      let list = allCityData.value;
      // 市一级
      if (changeResult.provinceCode && changeResult.provinceCode) {
        list = list.find((p) => p.code === changeResult.provinceCode).areaList;
      }
      // 地区一级
      if (changeResult.cityCode && changeResult.cityCode) {
        list = list.find((c) => c.code === changeResult.cityCode).areaList;
      }

      return list;
    });
    const changeResult = reactive({
      // 当点击按钮选择地区时记录下来
      provinceCode: "",
      provinceName: "",
      cityCode: "",
      cityName: "",
      countyCode: "",
      countyName: "",
      fullLocation: "",
    });
    const changeItem = (item) => {
      if (item.level === 0) {
        // 省级
        changeResult.provinceCode = item.code;
        changeResult.provinceName = item.name;
      }
      if (item.level === 1) {
        changeResult.cityCode = item.code;
        changeResult.cityName = item.name;
      }
      if (item.level === 2) {
        changeResult.countyCode = item.code;
        changeResult.countyName = item.name;
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`;

        // 最后一级, 关闭选择框并通知父组件
        close();
        emit("change", changeResult);
      }
    };

    return {
      visible,
      toggle,
      target,
      currList,
      loading,
      changeResult,
      changeItem,
    };
  },
};
// 获取省市区的数据
const getCityData = () => {
  // 数据:https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 当本地没有数据,就去请求数据
  // 当本地有缓存时,使用本地缓存的数据
  // 使用promise封装请求,既可能是同步也可能是异步请求
  return new Promise((resolve, reject) => {
    // 约定将缓存存储在window.cityData里
    if (window.cityData) {
      // 假如已有缓存,那就直接返回缓存的内容
      resolve(window.cityData);
    } else {
      const url =
        "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json";
      axios.get(url).then((res) => {
        // 缓存
        window.cityData = res.data;
        resolve(res.data);
      });
    }
  });
};
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    margin-left: 5px;
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    // 省略...
    .loading {
      height: 290px;
      width: 100%;
      background: url(~@/assets/images/loading.gif) no-repeat center;
    }

    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>

