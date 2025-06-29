<template>
  <div ref="chartRef" class="chart-container" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'

interface Props {
  option: EChartsOption
  width?: string
  height?: string
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%',
  theme: 'dark'
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: ECharts | null = null

// 初始化图表
const initChart = async () => {
  if (!chartRef.value) return
  
  await nextTick()
  
  // 注册暗色主题
  echarts.registerTheme('dark', {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#ffffff'
    },
    title: {
      textStyle: {
        color: '#ffffff'
      }
    },
    legend: {
      textStyle: {
        color: '#b8c5d1'
      }
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    categoryAxis: {
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLabel: {
        color: '#b8c5d1'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    valueAxis: {
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLabel: {
        color: '#b8c5d1'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  })
  
  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.option)
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(props.option, true)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 销毁图表
const destroyChart = () => {
  if (chartInstance) {
    window.removeEventListener('resize', handleResize)
    chartInstance.dispose()
    chartInstance = null
  }
}

// 监听配置变化
watch(
  () => props.option,
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  destroyChart()
})

// 暴露方法给父组件
defineExpose({
  chartInstance,
  updateChart,
  handleResize
})
</script>

<style scoped lang="scss">
.chart-container {
  position: relative;
  
  &:hover {
    .chart-loading {
      opacity: 0;
    }
  }
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: $text-secondary;
  font-size: $font-size-sm;
  opacity: 0;
  transition: opacity $transition-normal;
  pointer-events: none;
}
</style>