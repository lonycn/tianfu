# 天福国家湿地公园可视化大屏开发TODO清单

## 项目技术栈
- **前端框架**: Vue 3 + Composition API + TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **图表库**: ECharts 5.x
- **地图**: 高德地图API
- **状态管理**: Pinia
- **样式**: SCSS
- **实时通信**: WebSocket

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── charts/         # 图表组件库
│   │   ├── BaseChart.vue
│   │   ├── GaugeChart.vue
│   │   ├── LineChart.vue
│   │   ├── BarChart.vue
│   │   ├── PieChart.vue
│   │   └── HeatmapChart.vue
│   ├── maps/           # 地图相关组件
│   │   ├── BaseMap.vue
│   │   ├── MarkerPopup.vue
│   │   └── TrackAnimation.vue
│   ├── common/         # 基础UI组件
│   │   ├── DataCard.vue
│   │   ├── StatusLight.vue
│   │   ├── NumberRoll.vue
│   │   ├── ImageCarousel.vue
│   │   └── ParticleBackground.vue
│   └── layout/         # 布局组件
│       ├── ScreenLayout.vue
│       ├── HeaderBar.vue
│       └── SidePanel.vue
├── views/              # 页面组件
│   ├── Overview.vue    # 首页总览
│   ├── Agriculture.vue # 智慧农业监测
│   ├── Quality.vue     # 绿色种植与质量监管
│   ├── Factory.vue     # 育秧工厂与农机展示
│   ├── Ecology.vue     # 湿地生态保护与鸟类展示
│   ├── Education.vue   # 教育研学与品牌传播
│   └── Maintenance.vue # 系统运维与预警
├── composables/        # 组合式函数
│   ├── useWebSocket.ts
│   ├── useScreenAdapter.ts
│   ├── useChartResize.ts
│   └── useDataPolling.ts
├── utils/              # 工具函数
│   ├── screenAdapter.ts
│   ├── dataFormatter.ts
│   └── constants.ts
├── api/                # 接口管理
│   ├── index.ts
│   ├── agriculture.ts
│   ├── quality.ts
│   └── ecology.ts
├── stores/             # Pinia状态管理
│   ├── index.ts
│   ├── overview.ts
│   ├── agriculture.ts
│   └── system.ts
├── assets/             # 静态资源
│   ├── images/
│   ├── icons/
│   └── videos/
└── styles/             # 样式文件
    ├── variables.scss
    ├── mixins.scss
    ├── global.scss
    └── themes.scss
```

## 开发任务清单

### 1. 项目初始化

#### 1.1 创建Vue3项目
- [ ] 使用Vite创建Vue3+TypeScript项目
- [ ] 安装依赖包：element-plus, echarts, @amap/amap-jsapi-loader, pinia, vue-router, sass
- [ ] 配置vite.config.ts，设置别名和代理
- [ ] 配置tsconfig.json
- [ ] 设置ESLint和Prettier

#### 1.2 基础配置文件

**vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    }
  }
})
```

**src/styles/variables.scss**
```scss
// 主题色彩
$primary-blue: #1890ff;
$primary-green: #52c41a;
$bg-gradient-start: #f0f9ff;
$bg-gradient-end: #e0f2fe;
$text-primary: #262626;
$text-secondary: #8c8c8c;
$border-color: #d9d9d9;

// 大屏尺寸
$screen-width: 3840px;
$screen-height: 2160px;
$base-font-size: 16px;

// 组件尺寸
$card-border-radius: 8px;
$card-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
$header-height: 80px;
$sidebar-width: 300px;

// 动画时间
$transition-fast: 0.2s;
$transition-normal: 0.3s;
$transition-slow: 0.5s;
```

### 2. 工具函数开发

#### 2.1 大屏适配工具

**src/utils/screenAdapter.ts**
```typescript
export interface ScreenConfig {
  width: number
  height: number
  scale: number
}

export class ScreenAdapter {
  private config: ScreenConfig
  private resizeHandler: () => void

  constructor(designWidth = 3840, designHeight = 2160) {
    this.config = {
      width: designWidth,
      height: designHeight,
      scale: 1
    }
    this.resizeHandler = this.handleResize.bind(this)
    this.init()
  }

  private init() {
    this.handleResize()
    window.addEventListener('resize', this.resizeHandler)
  }

  private handleResize() {
    const { clientWidth, clientHeight } = document.documentElement
    const scaleX = clientWidth / this.config.width
    const scaleY = clientHeight / this.config.height
    this.config.scale = Math.min(scaleX, scaleY)
    
    const screenElement = document.getElementById('screen-container')
    if (screenElement) {
      screenElement.style.transform = `scale(${this.config.scale})`
      screenElement.style.transformOrigin = 'top left'
    }
  }

  public getScale(): number {
    return this.config.scale
  }

  public destroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }
}
```

#### 2.2 数据格式化工具

**src/utils/dataFormatter.ts**
```typescript
export const formatNumber = (num: number, precision = 2): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(precision) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(precision) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(precision) + 'K'
  return num.toFixed(precision)
}

export const formatPercentage = (value: number, total: number): string => {
  return ((value / total) * 100).toFixed(1) + '%'
}

export const formatDate = (date: Date | string, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
```

### 3. 组合式函数开发

#### 3.1 WebSocket连接管理

**src/composables/useWebSocket.ts**
```typescript
import { ref, onUnmounted } from 'vue'

export interface WebSocketOptions {
  url: string
  protocols?: string | string[]
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket(options: WebSocketOptions) {
  const { url, protocols, reconnectInterval = 3000, maxReconnectAttempts = 5 } = options
  
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const data = ref<any>(null)
  const error = ref<Event | null>(null)

  const connect = () => {
    try {
      ws.value = new WebSocket(url, protocols)
      
      ws.value.onopen = () => {
        isConnected.value = true
        reconnectAttempts.value = 0
        console.log('WebSocket connected')
      }
      
      ws.value.onmessage = (event) => {
        try {
          data.value = JSON.parse(event.data)
        } catch {
          data.value = event.data
        }
      }
      
      ws.value.onerror = (event) => {
        error.value = event
        console.error('WebSocket error:', event)
      }
      
      ws.value.onclose = () => {
        isConnected.value = false
        if (reconnectAttempts.value < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.value++
            connect()
          }, reconnectInterval)
        }
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
    }
  }

  const send = (message: any) => {
    if (ws.value && isConnected.value) {
      const data = typeof message === 'string' ? message : JSON.stringify(message)
      ws.value.send(data)
    }
  }

  const close = () => {
    if (ws.value) {
      ws.value.close()
    }
  }

  onUnmounted(() => {
    close()
  })

  return {
    ws,
    isConnected,
    data,
    error,
    connect,
    send,
    close
  }
}
```

### 4. 基础组件开发

#### 4.1 图表基础组件

**src/components/charts/BaseChart.vue**
```vue
<template>
  <div ref="chartRef" :style="{ width, height }" class="base-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  option: EChartsOption
  width?: string
  height?: string
  theme?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '400px',
  theme: 'default'
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = async () => {
  if (!chartRef.value) return
  
  await nextTick()
  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.option)
  
  // 监听窗口大小变化
  const resizeHandler = () => {
    chartInstance?.resize()
  }
  window.addEventListener('resize', resizeHandler)
  
  return () => {
    window.removeEventListener('resize', resizeHandler)
  }
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(props.option, true)
  }
}

watch(() => props.option, updateChart, { deep: true })

onMounted(initChart)

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

defineExpose({
  chartInstance,
  updateChart
})
</script>

<style scoped>
.base-chart {
  position: relative;
}
</style>
```

#### 4.2 仪表盘组件

**src/components/charts/GaugeChart.vue**
```vue
<template>
  <BaseChart :option="chartOption" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'

interface Props {
  value: number
  max?: number
  title?: string
  unit?: string
  width?: string
  height?: string
  color?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  title: '',
  unit: '%',
  width: '100%',
  height: '300px',
  color: () => ['#52c41a', '#faad14', '#f5222d']
})

const chartOption = computed<EChartsOption>(() => ({
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: props.max,
      splitNumber: 10,
      itemStyle: {
        color: '#58D9F9',
        shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      progress: {
        show: true,
        roundCap: true,
        width: 18
      },
      pointer: {
        icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
        length: '75%',
        width: 16,
        offsetCenter: [0, '5%']
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 18
        }
      },
      axisTick: {
        splitNumber: 2,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        length: 12,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 30,
        color: '#999',
        fontSize: 20
      },
      title: {
        show: !!props.title,
        offsetCenter: [0, '30%'],
        color: '#333',
        fontSize: 20
      },
      detail: {
        fontSize: 50,
        offsetCenter: [0, '0%'],
        valueAnimation: true,
        formatter: function (value: number) {
          return Math.round(value) + props.unit
        },
        color: 'inherit'
      },
      data: [
        {
          value: props.value,
          name: props.title
        }
      ]
    }
  ]
}))
</script>
```

#### 4.3 数据卡片组件

**src/components/common/DataCard.vue**
```vue
<template>
  <div class="data-card" :class="{ 'data-card--clickable': clickable }" @click="handleClick">
    <div class="data-card__header" v-if="title || $slots.header">
      <slot name="header">
        <h3 class="data-card__title">{{ title }}</h3>
        <span class="data-card__subtitle" v-if="subtitle">{{ subtitle }}</span>
      </slot>
    </div>
    
    <div class="data-card__content">
      <slot></slot>
    </div>
    
    <div class="data-card__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.data-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: $card-border-radius;
  box-shadow: $card-shadow;
  padding: 20px;
  transition: all $transition-normal;
  border: 1px solid $border-color;
  
  &--clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }
  
  &__header {
    margin-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
  }
  
  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }
  
  &__subtitle {
    font-size: 14px;
    color: $text-secondary;
    margin-left: 8px;
  }
  
  &__content {
    flex: 1;
  }
  
  &__footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
```

### 5. 页面组件开发

#### 5.1 首页总览页面

**src/views/Overview.vue**
```vue
<template>
  <div class="overview-page">
    <!-- 顶部标题栏 -->
    <header class="overview-header">
      <div class="header-left">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
        <h1 class="system-title">天福国家湿地公园 AI+物联网智慧种植可视化大屏</h1>
      </div>
      <div class="header-right">
        <div class="current-time">{{ currentTime }}</div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="overview-main">
      <!-- 左侧湿地概况 -->
      <section class="left-section">
        <DataCard title="湿地概况" class="wetland-overview">
          <div class="wetland-map">
            <!-- 湿地分区图 -->
            <img src="@/assets/images/wetland-map.jpg" alt="湿地分区图" />
          </div>
          <div class="wetland-info">
            <div class="info-item">
              <span class="label">总面积：</span>
              <span class="value">{{ wetlandData.totalArea }}公顷</span>
            </div>
            <div class="info-item">
              <span class="label">湿地率：</span>
              <span class="value highlight">{{ wetlandData.wetlandRate }}%</span>
            </div>
            <div class="info-item">
              <span class="label">恢复面积：</span>
              <span class="value">{{ wetlandData.restoredArea }}公顷</span>
            </div>
          </div>
        </DataCard>
      </section>
      
      <!-- 右侧数据总览 -->
      <section class="right-section">
        <div class="data-overview-grid">
          <!-- 湿地率仪表盘 -->
          <DataCard title="湿地率" class="gauge-card">
            <GaugeChart 
              :value="wetlandData.wetlandRate" 
              :max="100" 
              unit="%" 
              height="200px"
            />
          </DataCard>
          
          <!-- 设备在线率 -->
          <DataCard title="设备在线率" class="gauge-card">
            <GaugeChart 
              :value="systemData.deviceOnlineRate" 
              :max="100" 
              unit="%" 
              height="200px"
              :color="['#52c41a', '#faad14', '#f5222d']"
            />
          </DataCard>
          
          <!-- 监测点数量 -->
          <DataCard title="监测点总数" class="stat-card">
            <div class="stat-number">
              <NumberRoll :value="systemData.totalMonitorPoints" />
            </div>
            <div class="stat-unit">个</div>
          </DataCard>
          
          <!-- 今日数据更新 -->
          <DataCard title="今日数据更新" class="stat-card">
            <div class="stat-number">
              <NumberRoll :value="systemData.todayDataUpdates" />
            </div>
            <div class="stat-unit">次</div>
          </DataCard>
        </div>
      </section>
    </main>
    
    <!-- 底部轮播图 -->
    <footer class="overview-footer">
      <ImageCarousel 
        :images="carouselImages" 
        :autoplay="true" 
        :interval="5000"
        height="200px"
      />
    </footer>
    
    <!-- 粒子背景 -->
    <ParticleBackground />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DataCard from '@/components/common/DataCard.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import NumberRoll from '@/components/common/NumberRoll.vue'
import ImageCarousel from '@/components/common/ImageCarousel.vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import { formatDate } from '@/utils/dataFormatter'

// 响应式数据
const currentTime = ref('')
const wetlandData = ref({
  totalArea: 779.2,
  wetlandRate: 63.62,
  restoredArea: 495.94
})

const systemData = ref({
  deviceOnlineRate: 98.5,
  totalMonitorPoints: 156,
  todayDataUpdates: 2847
})

const carouselImages = ref([
  { src: '@/assets/images/wetland1.jpg', title: '湿地全景' },
  { src: '@/assets/images/wetland2.jpg', title: '鸟类栖息地' },
  { src: '@/assets/images/wetland3.jpg', title: '生态修复区' },
  { src: '@/assets/images/wetland4.jpg', title: '智慧农业区' }
])

// 更新时间
const updateTime = () => {
  currentTime.value = formatDate(new Date(), 'YYYY年MM月DD日 HH:mm:ss')
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style lang="scss" scoped>
.overview-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, $bg-gradient-start 0%, $bg-gradient-end 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.overview-header {
  height: $header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  
  .header-left {
    display: flex;
    align-items: center;
    
    .logo {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
    
    .system-title {
      font-size: 32px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }
  
  .header-right {
    .current-time {
      font-size: 20px;
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.overview-main {
  flex: 1;
  display: flex;
  padding: 20px;
  gap: 20px;
}

.left-section {
  flex: 1;
  
  .wetland-overview {
    height: 100%;
    
    .wetland-map {
      margin-bottom: 20px;
      
      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
      }
    }
    
    .wetland-info {
      .info-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 18px;
        
        .label {
          color: $text-secondary;
        }
        
        .value {
          font-weight: 600;
          color: $text-primary;
          
          &.highlight {
            color: $primary-green;
            font-size: 20px;
          }
        }
      }
    }
  }
}

.right-section {
  flex: 1;
  
  .data-overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    height: 100%;
    
    .gauge-card {
      height: 280px;
    }
    
    .stat-card {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px;
      
      .stat-number {
        font-size: 48px;
        font-weight: 700;
        color: $primary-blue;
        margin-bottom: 8px;
      }
      
      .stat-unit {
        font-size: 18px;
        color: $text-secondary;
      }
    }
  }
}

.overview-footer {
  height: 220px;
  padding: 0 20px 20px;
}
</style>
```

### 6. 状态管理

#### 6.1 总览页面状态

**src/stores/overview.ts**
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WetlandData, SystemData } from '@/types'

export const useOverviewStore = defineStore('overview', () => {
  // 湿地数据
  const wetlandData = ref<WetlandData>({
    totalArea: 779.2,
    wetlandRate: 63.62,
    restoredArea: 495.94,
    protectedSpecies: 235,
    keyProtectedSpecies: 56
  })
  
  // 系统数据
  const systemData = ref<SystemData>({
    deviceOnlineRate: 98.5,
    totalMonitorPoints: 156,
    todayDataUpdates: 2847,
    totalDevices: 89,
    onlineDevices: 87
  })
  
  // 更新湿地数据
  const updateWetlandData = (data: Partial<WetlandData>) => {
    wetlandData.value = { ...wetlandData.value, ...data }
  }
  
  // 更新系统数据
  const updateSystemData = (data: Partial<SystemData>) => {
    systemData.value = { ...systemData.value, ...data }
  }
  
  // 获取实时数据
  const fetchRealTimeData = async () => {
    try {
      // 这里调用实际的API
      const response = await fetch('/api/overview/realtime')
      const data = await response.json()
      
      updateWetlandData(data.wetland)
      updateSystemData(data.system)
    } catch (error) {
      console.error('Failed to fetch real-time data:', error)
    }
  }
  
  return {
    wetlandData,
    systemData,
    updateWetlandData,
    updateSystemData,
    fetchRealTimeData
  }
})
```

### 7. 类型定义

**src/types/index.ts**
```typescript
// 湿地数据类型
export interface WetlandData {
  totalArea: number
  wetlandRate: number
  restoredArea: number
  protectedSpecies: number
  keyProtectedSpecies: number
}

// 系统数据类型
export interface SystemData {
  deviceOnlineRate: number
  totalMonitorPoints: number
  todayDataUpdates: number
  totalDevices: number
  onlineDevices: number
}

// 监测点数据类型
export interface MonitorPoint {
  id: string
  name: string
  type: 'rice' | 'orchard' | 'greenhouse' | 'storage'
  location: {
    lat: number
    lng: number
  }
  status: 'online' | 'offline' | 'warning'
  data: {
    temperature: number
    humidity: number
    soilMoisture: number
    lightIntensity: number
    ph: number
  }
  lastUpdate: string
}

// 图表配置类型
export interface ChartConfig {
  title?: string
  color?: string[]
  grid?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  animation?: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}
```

### 8. 样式主题

**src/styles/themes.scss**
```scss
// 主题色彩定义
:root {
  // 主色调
  --color-primary: #{$primary-blue};
  --color-success: #{$primary-green};
  --color-warning: #faad14;
  --color-danger: #f5222d;
  
  // 背景色
  --bg-primary: #{$bg-gradient-start};
  --bg-secondary: #{$bg-gradient-end};
  --bg-card: rgba(255, 255, 255, 0.95);
  
  // 文字颜色
  --text-primary: #{$text-primary};
  --text-secondary: #{$text-secondary};
  --text-light: #ffffff;
  
  // 边框颜色
  --border-color: #{$border-color};
  --border-light: rgba(255, 255, 255, 0.2);
}

// 暗色主题
[data-theme="dark"] {
  --bg-primary: #0f1419;
  --bg-secondary: #1a1f29;
  --bg-card: rgba(26, 31, 41, 0.95);
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: #3a3a3a;
}

// 全局样式
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
}

// 滚动条样式
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
}
```

### 9. 路由配置

**src/router/index.ts**
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Overview',
    component: () => import('@/views/Overview.vue'),
    meta: {
      title: '首页总览'
    }
  },
  {
    path: '/agriculture',
    name: 'Agriculture',
    component: () => import('@/views/Agriculture.vue'),
    meta: {
      title: '智慧农业监测'
    }
  },
  {
    path: '/quality',
    name: 'Quality',
    component: () => import('@/views/Quality.vue'),
    meta: {
      title: '绿色种植与质量监管'
    }
  },
  {
    path: '/factory',
    name: 'Factory',
    component: () => import('@/views/Factory.vue'),
    meta: {
      title: '育秧工厂与农机展示'
    }
  },
  {
    path: '/ecology',
    name: 'Ecology',
    component: () => import('@/views/Ecology.vue'),
    meta: {
      title: '湿地生态保护与鸟类展示'
    }
  },
  {
    path: '/education',
    name: 'Education',
    component: () => import('@/views/Education.vue'),
    meta: {
      title: '教育研学与品牌传播'
    }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/Maintenance.vue'),
    meta: {
      title: '系统运维与预警'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 天福国家湿地公园`
  }
  next()
})

export default router
```

### 10. 主应用入口

**src/main.ts**
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import '@/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
```

**src/App.vue**
```vue
<template>
  <div id="screen-container" class="screen-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ScreenAdapter } from '@/utils/screenAdapter'

let screenAdapter: ScreenAdapter

onMounted(() => {
  screenAdapter = new ScreenAdapter(3840, 2160)
})

onUnmounted(() => {
  if (screenAdapter) {
    screenAdapter.destroy()
  }
})
</script>

<style>
.screen-container {
  width: 3840px;
  height: 2160px;
  transform-origin: top left;
  position: relative;
}
</style>
```

## 开发注意事项

### 代码规范
1. 使用TypeScript严格模式
2. 组件名使用PascalCase
3. 文件名使用kebab-case
4. 变量名使用camelCase
5. 常量使用UPPER_SNAKE_CASE

### 性能优化
1. 图表组件使用防抖处理resize事件
2. 大数据列表使用虚拟滚动
3. 图片使用懒加载
4. 路由使用懒加载
5. 合理使用computed和watch

### 响应式设计
1. 使用rem单位进行缩放适配
2. 关键数据使用大字号显示
3. 保持4K大屏最佳显示效果
4. 兼容1080p显示器

### 数据更新策略
1. 关键数据使用WebSocket实时更新
2. 非关键数据使用定时轮询
3. 失败重试机制
4. 离线数据缓存

### 错误处理
1. 网络请求统一错误处理
2. 组件错误边界
3. 用户友好的错误提示
4. 日志记录和上报