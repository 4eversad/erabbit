<script>
import { useVModel } from "@vueuse/core";
import { provide } from "vue";
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
  },
  setup(props, { emit }) {
    const activeName = useVModel(props, "modelValue", emit);
    // 点击时切换
    const tabClick = (name, index) => {
      activeName.value = name;
      emit("tab-click", { name, index });
    };
    provide("activeName", activeName);
    return { activeName, tabClick };
  },

  render() {
    // 在babel的帮助下,可以在vue中写jsx语法
    const panels = this.$slots.default();
    const dynamicPanels = [];
    panels.forEach((item) => {
      if (item.type.name === "XtxTabsPanel") {
        dynamicPanels.push(item);
      } else {
        item.children.forEach((item) => {
          dynamicPanels.push(item);
        });
      }
    });

    const nav = (
      <nav>
        {dynamicPanels.map((item, i) => {
          return (
            <a
              // 必须写成箭头函数, 否则会立即调用
              onClick={() => this.tabClick(item.props.name, i)}
              class={{ active: item.props.name === this.modelValue }}
              href="javascript:;"
            >
              {item.props.label}
            </a>
          );
        })}
      </nav>
    );

    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>;
  },
};
</script>

<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>