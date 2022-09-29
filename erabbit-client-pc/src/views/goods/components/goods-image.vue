<template>
  <div class="goods-image">
    <!-- 大图预览 放大镜图片部分 -->
    <div
      v-show="show"
      class="large"
      :style="[{ backgroundImage: `url(${images[currIndex]})` }, largePosition]"
    >
      <!-- <img :src="images[currIndex]" alt="" /> -->
    </div>
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <!-- 遮罩层 -->
      <!-- 绑定样式 -->
      <div v-show="show" class="layer" :style="layerPosition"></div>
    </div>
    <ul class="small">
      <li
        v-for="(img, i) in images"
        :key="img"
        :class="{ active: i === currIndex }"
      >
        <img :src="img" alt="" @mouseenter="currIndex = i" />
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useMouseInElement } from "@vueuse/core";
export default {
  name: "GoodsImage",
  props: {
    images: {
      type: Array,
      default: {},
    },
  },
  setup(props) {
    const currIndex = ref(0);
    // 1.是否显示遮罩层和大图
    const show = ref(false);

    // 2.遮罩的坐标(定义为样式使用, 方便:style绑定使用)
    const layerPosition = reactive({
      left: 0,
      top: 0,
    });

    // 3.大图的背景定位(样式)
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0,
    });

    // 4.使用useMouseInElement得到基于元素左上角的坐标(ElementX/Y)和是否离开元素(isOutside)
    const target = ref(null);
    
    // useMouseInElement里面要写上target才能在元素中生效啊啊啊!!!!
    const { elementX, elementY, isOutside } = useMouseInElement(target);
    watch([elementX, elementY, isOutside], () => {
      
      
      // 5.根据数据修改我们的样式数据和是否显示
      show.value = !isOutside.value;
      // position是遮罩层的左上角的坐标位置
      const position = { x: 0, y: 0 };
      // elementX/Y.value是鼠标在元素内的坐标位置 别忘了.value!!!
      // 判断鼠标的位置在哪些范围内遮罩层是不动的
      if (elementX.value < 100) {
        position.x = 0;
      } else if (elementX.value > 300) {
        position.x = 200;
      } else {
        position.x = elementX.value - 100;
      }
      if (elementY.value < 100) {
        position.y = 0;
      } else if (elementY.value > 300) {
        position.y = 200;
      } else {
        position.y = elementY.value - 100;
      }
      layerPosition.left = position.x + "px";
      layerPosition.top = position.y + "px";
      largePosition.backgroundPositionX = -2 * position.x + "px";
      largePosition.backgroundPositionY = -2 * position.y + "px";
    });

    return {
      currIndex,
      show,
      layerPosition,
      largePosition,
      target,
    };
  },
};
</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
  // 大图预览
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
    overflow: hidden;
    z-index: 401;
    img {
      max-width: 800px;
      max-height: 800px;
      width: 800px;
      height: 800px;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>