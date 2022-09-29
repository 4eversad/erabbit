<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            @click="changeSku(val, item)"
            :src="val.picture"
            :title="val.name"
            v-if="val.picture"
            :class="{ selected: val.selected, disabled: val.disabled }"
          />
          <span
            @click="changeSku(val, item)"
            :class="{ selected: val.selected, disabled: val.disabled }"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from "@/vender/power-set";
const spliter = "★";
// 得到一个路径字典
// 1.得到所有的sku集合 props.goods.skus
// 2.从所有的sku中筛选出有效的sku
// 3.使用powerset得到子集
// 4.根据子集往路径字典中存储key-value

// 得到路径字典
// -------------------------------------------------------------------
const getPathMap = (skus) => {
  // console.log(skus);
  const pathMap = {};
  skus.forEach((sku) => {
    // 筛选出有效sku
    if (sku.inventory > 0) {
      // 计算出当前有效sku的子集
      //  map()方法定义在JavaScript的Array中,它返回一个新的数组,
      // 数组中的元素为原始数组调用函数处理后的值。
      // 得到可选值数组
      const valueArr = sku.specs.map((val) => val.valueName);

      // 得到可选值子集
      const valueArrPowerSet = powerSet(valueArr);
      // 遍历子集,放到pathMap对象中, 生成路径字典
      valueArrPowerSet.forEach((arr) => {
        const key = arr.join(spliter);

        // console.log(key);

        // 给pathMap插值
        if (pathMap[key]) {
          // 不懂???这一步

          pathMap[key].push(sku.id);
        } else {
          pathMap[key] = [sku.id];
        }
      });
    }
  });
  // console.log(pathMap);
  return pathMap;
};
// ❤ 组合选择
// ---------------------------------------------
const getSelectedValue = (specs) => {
  const arr = [];
  specs.forEach((item) => {
    // 找出被选中的按钮对象
    const selectedVal = item.values.find((val) => val.selected);

    arr.push(selectedVal ? selectedVal.name : undefined);
  });

  return arr;
};

// 更新disabled的状态
// -------------------------------------------------------
const updateDisabledStatus = (specs, pathMap) => {
  // 1.约定每一个按钮的状态由本身的disabled数据来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValue(specs);
    item.values.forEach((val) => {
      // 2.判断当前是否选中,是选中不用判断
      if (val.selected) return;
      // 3.拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name;

      // 4.剔除undefined,按照分隔符拼接key
      const key = selectedValues.filter((value) => value).join(spliter);
      console.log(key);

      // 5.拿着key去路径字典中查找是否有数据,有可以点击,没有就禁用(true)
      val.disabled = !pathMap[key];
    });
  });
};
// ----------------------------------------------------------
// 初始化默认选中方法:
const initDefaultSelected = (goods, skuId) => {
  console.log(1234);
  
  // 找到想选中的那一条
  const sku = goods.skus.find((sku) => sku.id === skuId);
  goods.specs.forEach((item, i) => {
    const val = item.values.find((val) => val.name === sku.specs[i].valueName);
    val.selected = true;
  });
};

export default {
  name: "GoodsSku",
  props: {
    goods: {
      type: Object,
      default: {},
    },
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    console.log(props.goods);
    // 初始化默认选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId);
    }
    // -------------------------------------
    const pathMap = getPathMap(props.goods.skus);
    // ★组件初始化时就要更新禁用按钮状态
    updateDisabledStatus(props.goods.specs, pathMap);
    // -------------------------------------------------------
    // 选中与不选中 给每一个按钮都加上一个选中的状态数据 selected
    const changeSku = (val, item) => {
      // 当按钮禁用时,阻止程序运行
      if (val.disabled) return;
      if (val.selected) {
        val.selected = false;
      } else {
        item.values.forEach((i) => (i.selected = false));
        val.selected = true;
      }
      // ------------------------------------------------------
      // ★点击以后也要更新禁用按钮状态
      updateDisabledStatus(props.goods.specs, pathMap);
      // 将选择的sku通知父组件{skuId, price, oldPrice, inventory, specsText}
      // 选择完整的sku以后才拿到信息,再将信息传递给父组件
      // 不是完整的就提交空对象给父组件
      // 如何判断是否完整: 将过滤掉undefined后的selectedValues和规格种类的数量做对比
      const validSelectedValues = getSelectedValue(props.goods.specs).filter(
        (v) => v
      );
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)];

        const sku = props.goods.skus.find((sku) => sku.id === skuIds[0]);
        emit("change", {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // specsText为 属性名1 属性值1 属性名2 属性值2的格式
          specsText: sku.specs
            .reduce((p, c) => `${p} ${c.name}: ${c.valueName}`, "")
            .trim(),
          // 去掉空字符串
        });
      } else {
        // 父组件需要判断规格是否选择完整,所以需要传空对象, 不完整不能加入购物车
        emit("change", {});
      }
    };
    return {
      changeSku,
    };
  },
};
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>