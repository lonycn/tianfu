<template>
  <div class="data-overview">
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg primary">
            📊
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalArea.toFixed(1) }}</div>
          <div class="stat-label">总种植面积(亩)</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg success">
            🌱
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ averageYield.toFixed(1) }}%</div>
          <div class="stat-label">平均产量预测</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg warning">
            🔧
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ deviceStatus.sensors.online }}</div>
          <div class="stat-label">在线传感器</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <div class="icon-bg info">
            💧
          </div>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ deviceStatus.irrigation.running }}</div>
          <div class="stat-label">运行灌溉系统</div>
        </div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-area">
      <!-- 环境数据趋势图 -->
      <div class="chart-container">
        <h4 class="chart-title">环境数据趋势</h4>
        <ChartContainer :option="environmentChartOption" height="200px" />
      </div>
      
      <!-- 产量分布饼图 -->
      <div class="chart-container">
        <h4 class="chart-title">各区域产量分布</h4>
        <ChartContainer :option="yieldChartOption" height="200px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useMainStore } from '@/stores'
import { useRealTimeData, useDeviceMonitor } from '@/composables/useRealTime'
import ChartContainer from '@/components/ChartContainer.vue'
import { generateMockData } from '@/utils'
import type { EChartsOption } from 'echarts'

const store = useMainStore()
const { realTimeData } = useRealTimeData()
const { deviceStatus } = useDeviceMonitor()

// 计算属性
const totalArea = computed(() => store.totalArea)
const averageYield = computed(() => store.averageYield)

// 生成模拟历史数据
const generateHistoryData = () => {
  const hours = []
  const temperature = []
  const humidity = []
  const soilMoisture = []
  
  for (let i = 23; i >= 0; i--) {
    const hour = new Date()
    hour.setHours(hour.getHours() - i)
    hours.push(hour.getHours().toString().padStart(2, '0') + ':00')
    
    temperature.push(generateMockData(20, 35, 1))
    humidity.push(generateMockData(40, 80, 1))
    soilMoisture.push(generateMockData(30, 70, 1))
  }
  
  return { hours, temperature, humidity, soilMoisture }
}

const historyData = ref(generateHistoryData())

// 环境数据趋势图配置
const environmentChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(26, 35, 50, 0.9)',
    borderColor: 'rgba(0, 212, 255, 0.5)',
    textStyle: {
      color: '#ffffff'
    }
  },
  legend: {
    data: ['温度', '湿度', '土壤湿度'],
    textStyle: {
      color: '#b8c5d1'
    },
    top: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: historyData.value.hours,
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.2)'
      }
    },
    axisLabel: {
      color: '#b8c5d1',
      fontSize: 10
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.2)'
      }
    },
    axisLabel: {
      color: '#b8c5d1',
      fontSize: 10
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  series: [
    {
      name: '温度',
      type: 'line',
      data: historyData.value.temperature,
      smooth: true,
      lineStyle: {
        color: '#00d4ff',
        width: 2
      },
      itemStyle: {
        color: '#00d4ff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.1)' }
          ]
        }
      }
    },
    {
      name: '湿度',
      type: 'line',
      data: historyData.value.humidity,
      smooth: true,
      lineStyle: {
        color: '#00ff88',
        width: 2
      },
      itemStyle: {
        color: '#00ff88'
      }
    },
    {
      name: '土壤湿度',
      type: 'line',
      data: historyData.value.soilMoisture,
      smooth: true,
      lineStyle: {
        color: '#ffd700',
        width: 2
      },
      itemStyle: {
        color: '#ffd700'
      }
    }
  ]
}))

// 产量分布饼图配置
const yieldChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(26, 35, 50, 0.9)',
    borderColor: 'rgba(0, 212, 255, 0.5)',
    textStyle: {
      color: '#ffffff'
    },
    formatter: '{a} <br/>{b}: {c}亩 ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: 0,
    textStyle: {
      color: '#b8c5d1',
      fontSize: 10
    }
  },
  series: [
    {
      name: '种植面积',
      type: 'pie',
      radius: ['30%', '60%'],
      center: ['50%', '45%'],
      data: store.plantingAreas.map(area => ({
        value: area.area,
        name: area.name,
        itemStyle: {
          color: area.id === 1 ? '#00d4ff' : area.id === 2 ? '#00ff88' : '#ff6b35'
        }
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        color: '#ffffff',
        fontSize: 10
      },
      labelLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      }
    }
  ]
}))

// 定时更新历史数据
onMounted(() => {
  setInterval(() => {
    historyData.value = generateHistoryData()
  }, 30000) // 30秒更新一次
})
</script>

<style scoped lang="scss">
.data-overview {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid $border-secondary;
  border-radius: 8px;
  transition: all $transition-normal ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: $border-primary;
    transform: translateY(-2px);
  }
}

.stat-icon {
  .icon-bg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    
    &.primary {
      background: rgba(0, 212, 255, 0.2);
      color: $primary-color;
    }
    
    &.success {
      background: rgba(46, 213, 115, 0.2);
      color: $success-color;
    }
    
    &.warning {
      background: rgba(255, 215, 0, 0.2);
      color: $warning-color;
    }
    
    &.info {
      background: rgba(0, 255, 136, 0.2);
      color: $secondary-color;
    }
  }
}

.stat-content {
  flex: 1;
  
  .stat-value {
    font-size: $font-size-xl;
    font-weight: bold;
    color: $text-primary;
    line-height: 1;
    margin-bottom: 2px;
  }
  
  .stat-label {
    font-size: $font-size-xs;
    color: $text-secondary;
    line-height: 1;
  }
}

.charts-area {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid $border-secondary;
  border-radius: 8px;
  padding: 15px;
  
  .chart-title {
    margin: 0 0 10px 0;
    font-size: $font-size-sm;
    color: $text-primary;
    font-weight: 500;
  }
}

@media (max-width: $breakpoint-lg) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-area {
    grid-template-columns: 1fr;
  }
}

@media (max-width: $breakpoint-md) {
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .chart-container {
    padding: 12px;
  }
}
</style>