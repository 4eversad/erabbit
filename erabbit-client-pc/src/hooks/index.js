// 提供复用逻辑的函数(钩子)

// target是DOM对象,apiFn是API函数
// 数据懒加载函数

import { ref, onUnmounted } from 'vue'
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from "dayjs";


export const useLazyData = (target, apiFn) => {
  const result = ref([])
  // const target = ref([])
  // stop停止观察
  const { stop } = useIntersectionObserver(
    // target是目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {

        stop();
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    },
    { threshold: 0 }
  )
  return result
}

/**
 * 支付倒计时
 * @param {Interger} countdown -倒计时秒数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0);
  const timeText = ref("");
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--;
      timeText.value = dayjs.unix(time.value).format("mm分ss秒");

      if (time <= 0) {
        pause();
      }
    },
    1000,
    { immediate: false }
  );
  onUnmounted(() => {
    // 离开时销毁定时器
    pause();
  });

  // 开启定时器
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format("mm分ss秒");

    resume()
  }
  return {
    start,
    timeText
  }
}
