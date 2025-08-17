<template>
  <div class="agriculture-page">
    <!-- 动态科技背景 -->
    <div class="tech-bg">
      <div class="grid-overlay"></div>
      <div class="scan-line"></div>
    </div>
    
    <!-- 页面头部 -->
    <UnifiedHeader current-page="agriculture" />

    <!-- 主内容区域 -->
    <main class="page-main">
      <!-- 左侧区域 -->
      <section class="left-section">
        <!-- 环境监测概览 -->
        <div class="env-overview-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="icon-env"></i>
              环境监测总览
            </h2>
            <div class="real-time-badge">实时数据</div>
          </div>
          
          <div class="env-grid">
            <div v-for="item in envMonitorData" :key="item.id" class="env-item" :class="item.status">
              <div class="env-icon">{{ item.icon }}</div>
              <div class="env-info">
                <div class="env-label">{{ item.label }}</div>
                <div class="env-value">
                  <span class="value">{{ item.value }}</span>
                  <span class="unit">{{ item.unit }}</span>
                </div>
                <div class="env-range">{{ item.range }}</div>
              </div>
              <div class="env-chart">
                <canvas :ref="el => envChartRefs[item.id] = el" width="80" height="40"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- 作物生长监测 -->
        <div class="growth-monitor-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="icon-growth"></i>
              作物生长监测
            </h2>
            <select class="area-selector" v-model="selectedArea">
              <option v-for="area in plantingAreas" :key="area.id" :value="area.id">
                {{ area.name }}
              </option>
            </select>
          </div>
          
          <div class="growth-content">
            <!-- 生长阶段图 -->
            <div class="growth-stages">
              <div v-for="(stage, index) in growthStages" :key="index" 
                   class="stage-item" 
                   :class="{ active: stage.active, completed: stage.completed }">
                <div class="stage-dot"></div>
                <div class="stage-label">{{ stage.label }}</div>
                <div class="stage-date">{{ stage.date }}</div>
              </div>
              <div class="progress-line" :style="{ width: growthProgress + '%' }"></div>
            </div>
            
            <!-- 生长指标 -->
            <div class="growth-metrics">
              <div v-for="metric in growthMetrics" :key="metric.id" class="metric-item">
                <div class="metric-header">
                  <span class="metric-label">{{ metric.label }}</span>
                  <span class="metric-status" :class="metric.status">{{ metric.statusText }}</span>
                </div>
                <div class="metric-bar">
                  <div class="metric-fill" :style="{ width: metric.percentage + '%', backgroundColor: metric.color }"></div>
                </div>
                <div class="metric-value">{{ metric.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 中间区域 -->
      <section class="middle-section">
        <!-- IoT设备状态监控 -->
        <div class="device-monitor-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="icon-device"></i>
              IoT设备状态
            </h2>
            <div class="device-summary">
              <span class="online">在线: {{ currentAreaDeviceSummary.online }}</span>
              <span class="offline">离线: {{ currentAreaDeviceSummary.offline }}</span>
              <span class="alert">告警: {{ currentAreaDeviceSummary.alert }}</span>
            </div>
          </div>
          
          <!-- 区域切换标签 -->
          <div class="area-tabs">
            <button v-for="area in deviceAreas" :key="area.key"
                    class="area-tab"
                    :class="{ active: activeDeviceArea === area.key }"
                    @click="switchDeviceArea(area.key, true)">
              <span class="tab-icon">{{ area.icon }}</span>
              <span class="tab-label">{{ area.label }}</span>
              <span class="tab-count">{{ area.count }}</span>
            </button>
          </div>
          
          <div class="device-grid">
            <div v-for="device in currentAreaDevices" :key="device.id" 
                 class="device-item" 
                 :class="device.status">
              <div class="device-header">
                <div class="device-type">{{ device.type }}</div>
                <div class="device-id">{{ device.id }}</div>
              </div>
              <div class="device-metrics">
                <div class="metric" v-for="metric in device.metrics" :key="metric.name">
                  <span class="metric-name">{{ metric.name }}:</span>
                  <span class="metric-value">{{ metric.value }}</span>
                </div>
              </div>
              <div class="device-footer">
                <div class="last-update">{{ device.lastUpdate }}</div>
                <div class="signal-strength">
                  <i v-for="i in 4" :key="i" 
                     class="signal-bar" 
                     :class="{ active: i <= device.signalStrength }"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据趋势分析 -->
        <div class="trend-analysis-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="icon-trend"></i>
              24小时数据趋势
            </h2>
            <div class="trend-tabs">
              <button v-for="tab in trendTabs" :key="tab.key"
                      class="trend-tab"
                      :class="{ active: activeTrendTab === tab.key }"
                      @click="switchTrendTab(tab.key)">
                {{ tab.label }}
              </button>
            </div>
          </div>
          
          <div class="trend-chart-container">
            <canvas ref="trendChart" width="600" height="300"></canvas>
            <div class="trend-legend">
              <div v-for="item in trendLegend" :key="item.label" class="legend-item">
                <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右侧区域 -->
      <section class="right-section">
        <!-- AI智能分析 -->
        <div class="ai-analysis-card">
          <div class="card-header">
            <h2 class="card-title">
              <i class="icon-ai"></i>
              AI智能分析
            </h2>
            <div class="ai-status">
              <span class="status-dot active"></span>
              AI模型运行中
            </div>
          </div>
          
          <div class="ai-content">
            <!-- 病虫害预警 -->
            <div class="ai-module">
              <h3 class="module-title">病虫害预警</h3>
              <div class="pest-alerts">
                <div v-for="alert in pestAlerts" :key="alert.id" 
                     class="alert-item" 
                     :class="alert.level">
                  <div class="alert-icon">{{ alert.icon }}</div>
                  <div class="alert-info">
                    <div class="alert-title">{{ alert.title }}</div>
                    <div class="alert-desc">{{ alert.description }}</div>
                    <div class="alert-action">{{ alert.action }}</div>
                  </div>
                  <div class="alert-probability">{{ alert.probability }}%</div>
                </div>
              </div>
            </div>
            
            <!-- 产量预测 -->
            <div class="ai-module">
              <h3 class="module-title">产量预测</h3>
              <div class="yield-forecast">
                <div class="forecast-chart">
                  <canvas ref="yieldChart" width="260" height="140"></canvas>
                </div>
                <div class="forecast-summary">
                  <div class="summary-item">
                    <span class="label">预计产量:</span>
                    <span class="value">{{ yieldForecast.total }} 吨</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">较去年:</span>
                    <span class="value" :class="yieldForecast.trend">
                      {{ yieldForecast.change }}%
                    </span>
                  </div>
                  <div class="summary-item">
                    <span class="label">置信度:</span>
                    <span class="value">{{ yieldForecast.confidence }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 智能建议 -->
            <div class="ai-module">
              <h3 class="module-title">智能建议</h3>
              <div class="suggestions">
                <div v-for="(suggestion, index) in aiSuggestions" :key="index" class="suggestion-item">
                  <div class="suggestion-icon">💡</div>
                  <div class="suggestion-text">{{ suggestion }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作面板 -->
        <div class="control-panel">
          <button class="control-btn primary">
            <i class="icon-water"></i>
            灌溉控制
          </button>
          <button class="control-btn">
            <i class="icon-alert"></i>
            告警设置
          </button>
          <button class="control-btn">
            <i class="icon-report"></i>
            导出报告
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import UnifiedHeader from '@/components/UnifiedHeader.vue'
import { useMainStore } from '@/stores'

const mainStore = useMainStore()

// Canvas refs
const envChartRefs = ref<Record<string, HTMLCanvasElement | null>>({}) 
const trendChart = ref<HTMLCanvasElement | null>(null)
const yieldChart = ref<HTMLCanvasElement | null>(null)

// 状态数据
const selectedArea = ref(1)
const activeTrendTab = ref('temperature')
const activeDeviceArea = ref('birdwatch')
const isAutoSwitching = ref(true)
let autoSwitchInterval: number | null = null

// 环境监测数据
const envMonitorData = ref([
  {
    id: 'temp',
    icon: '🌡️',
    label: '空气温度',
    value: 23.5,
    unit: '°C',
    range: '适宜: 20-28°C',
    status: 'normal'
  },
  {
    id: 'humidity',
    icon: '💧',
    label: '空气湿度',
    value: 65,
    unit: '%',
    range: '适宜: 60-80%',
    status: 'normal'
  },
  {
    id: 'soil',
    icon: '🌱',
    label: '土壤湿度',
    value: 45,
    unit: '%',
    range: '适宜: 40-60%',
    status: 'normal'
  },
  {
    id: 'light',
    icon: '☀️',
    label: '光照强度',
    value: 35000,
    unit: 'Lux',
    range: '适宜: 30000-50000',
    status: 'normal'
  },
  {
    id: 'ph',
    icon: '🧪',
    label: '土壤pH',
    value: 6.5,
    unit: '',
    range: '适宜: 6.0-7.0',
    status: 'normal'
  },
  {
    id: 'co2',
    icon: '🌬️',
    label: 'CO₂浓度',
    value: 410,
    unit: 'ppm',
    range: '适宜: 380-450',
    status: 'normal'
  }
])

// 种植区域
const plantingAreas = computed(() => mainStore.plantingAreas)

// 生长阶段
const growthStages = ref([
  { label: '播种', date: '03/15', completed: true, active: false },
  { label: '出苗', date: '03/25', completed: true, active: false },
  { label: '分蘖', date: '04/20', completed: true, active: false },
  { label: '抽穗', date: '06/10', completed: false, active: true },
  { label: '结实', date: '07/15', completed: false, active: false },
  { label: '成熟', date: '09/20', completed: false, active: false }
])

const growthProgress = computed(() => {
  const completed = growthStages.value.filter(s => s.completed).length
  return (completed / growthStages.value.length) * 100
})

// 生长指标
const growthMetrics = ref([
  {
    id: 'height',
    label: '株高',
    value: '82cm',
    percentage: 82,
    status: 'good',
    statusText: '正常',
    color: '#52c41a'
  },
  {
    id: 'leaf',
    label: '叶绿素',
    value: 'SPAD 42',
    percentage: 85,
    status: 'good',
    statusText: '良好',
    color: '#52c41a'
  },
  {
    id: 'density',
    label: '群体密度',
    value: '28株/m²',
    percentage: 90,
    status: 'excellent',
    statusText: '优秀',
    color: '#1890ff'
  }
])

// IoT设备区域数据
const deviceAreas = ref([
  { key: 'birdwatch', label: '观鸟区', icon: '🦅', count: 8 },
  { key: 'seedling', label: '育秧工厂', icon: '🌱', count: 12 },
  { key: 'machinery', label: '农机', icon: '🚜', count: 6 },
  { key: 'water', label: '水质监测', icon: '💧', count: 10 },
  { key: 'rice', label: '稻田监测', icon: '🌾', count: 15 },
  { key: 'orchard', label: '果园', icon: '🍎', count: 8 },
  { key: 'nursery', label: '育苗区', icon: '🌱', count: 10 },
  { key: 'storage', label: '冷库', icon: '❄️', count: 4 }
])

// 各区域设备数据
const devicesByArea = ref<Record<string, Array<{
  id: string
  type: string
  status: string
  metrics: Array<{ name: string; value: string }>
  lastUpdate: string
  signalStrength: number
}>>>({
  birdwatch: [
    {
      id: 'BIRD-CAM-01',
      type: '鸟类监测相机',
      status: 'online',
      metrics: [
        { name: '拍摄数', value: '156张' },
        { name: '识别种类', value: '12种' }
      ],
      lastUpdate: '1分钟前',
      signalStrength: 4
    },
    {
      id: 'BIRD-MIC-01',
      type: '声音传感器',
      status: 'online',
      metrics: [
        { name: '音频数', value: '89段' },
        { name: '识别数', value: '23种' }
      ],
      lastUpdate: '3分钟前',
      signalStrength: 3
    },
    {
      id: 'BIRD-ENV-01',
      type: '环境监测',
      status: 'online',
      metrics: [
        { name: '噪音', value: '42dB' },
        { name: '人流', value: '低' }
      ],
      lastUpdate: '30秒前',
      signalStrength: 4
    }
  ],
  seedling: [
    {
      id: 'SEED-ENV-01',
      type: '环境控制器',
      status: 'online',
      metrics: [
        { name: '温度', value: '28°C' },
        { name: '湿度', value: '85%' }
      ],
      lastUpdate: '1分钟前',
      signalStrength: 4
    },
    {
      id: 'SEED-IRR-01',
      type: '喷灌系统',
      status: 'online',
      metrics: [
        { name: '状态', value: '运行中' },
        { name: '流量', value: '12L/h' }
      ],
      lastUpdate: '2分钟前',
      signalStrength: 4
    },
    {
      id: 'SEED-LIGHT-01',
      type: '补光系统',
      status: 'online',
      metrics: [
        { name: '光照', value: '18000Lux' },
        { name: '光谱', value: '全谱' }
      ],
      lastUpdate: '30秒前',
      signalStrength: 3
    },
    {
      id: 'SEED-CONV-01',
      type: '传送带',
      status: 'alert',
      metrics: [
        { name: '速度', value: '2m/min' },
        { name: '运行时间', value: '4.2h' }
      ],
      lastUpdate: '5分钟前',
      signalStrength: 4
    }
  ],
  machinery: [
    {
      id: 'MACH-HARV-01',
      type: '收割机',
      status: 'online',
      metrics: [
        { name: '位置', value: 'A区' },
        { name: '燃油', value: '65%' }
      ],
      lastUpdate: '10分钟前',
      signalStrength: 3
    },
    {
      id: 'MACH-TRAC-01',
      type: '拖拉机',
      status: 'offline',
      metrics: [
        { name: '位置', value: '--' },
        { name: '状态', value: '维保中' }
      ],
      lastUpdate: '2小时前',
      signalStrength: 0
    },
    {
      id: 'MACH-DRONE-01',
      type: '植保无人机',
      status: 'online',
      metrics: [
        { name: '电量', value: '78%' },
        { name: '作业面积', value: '12.5亩' }
      ],
      lastUpdate: '15分钟前',
      signalStrength: 4
    }
  ],
  water: [
    {
      id: 'WATER-PH-01',
      type: 'pH监测器',
      status: 'online',
      metrics: [
        { name: 'pH值', value: '7.2' },
        { name: '温度', value: '18°C' }
      ],
      lastUpdate: '1分钟前',
      signalStrength: 4
    },
    {
      id: 'WATER-DO-01',
      type: '溶氧监测',
      status: 'online',
      metrics: [
        { name: '溶氧', value: '8.5mg/L' },
        { name: '饱和度', value: '92%' }
      ],
      lastUpdate: '2分钟前',
      signalStrength: 4
    },
    {
      id: 'WATER-TUR-01',
      type: '浊度仪',
      status: 'alert',
      metrics: [
        { name: '浊度', value: '15NTU' },
        { name: '状态', value: '偏高' }
      ],
      lastUpdate: '30秒前',
      signalStrength: 3
    }
  ],
  rice: [
    {
      id: 'RICE-ENV-01',
      type: '综合气象站',
      status: 'online',
      metrics: [
        { name: '温度', value: '24.5°C' },
        { name: '湿度', value: '72%' }
      ],
      lastUpdate: '30秒前',
      signalStrength: 4
    },
    {
      id: 'RICE-SOIL-01',
      type: '土壤监测',
      status: 'online',
      metrics: [
        { name: '湿度', value: '48%' },
        { name: 'EC', value: '1.8ms/cm' }
      ],
      lastUpdate: '1分钟前',
      signalStrength: 4
    },
    {
      id: 'RICE-PEST-01',
      type: '虫情监测',
      status: 'online',
      metrics: [
        { name: '捕获', value: '23只' },
        { name: '类型', value: '稻飞虱' }
      ],
      lastUpdate: '10分钟前',
      signalStrength: 3
    },
    {
      id: 'RICE-CAM-01',
      type: '生长监测相机',
      status: 'online',
      metrics: [
        { name: '拍摄', value: '24张/天' },
        { name: '生长阶段', value: '抽穗期' }
      ],
      lastUpdate: '30分钟前',
      signalStrength: 4
    }
  ],
  orchard: [
    {
      id: 'ORCH-ENV-01',
      type: '气象监测',
      status: 'online',
      metrics: [
        { name: '温度', value: '26°C' },
        { name: '光照', value: '42000Lux' }
      ],
      lastUpdate: '1分钟前',
      signalStrength: 4
    },
    {
      id: 'ORCH-FRUIT-01',
      type: '果实监测相机',
      status: 'online',
      metrics: [
        { name: '成熟度', value: '85%' },
        { name: '预估产量', value: '1200kg' }
      ],
      lastUpdate: '1小时前',
      signalStrength: 3
    }
  ],
  nursery: [
    {
      id: 'NURS-ENV-01',
      type: '环境控制',
      status: 'online',
      metrics: [
        { name: '温度', value: '25°C' },
        { name: '湿度', value: '75%' }
      ],
      lastUpdate: '30秒前',
      signalStrength: 4
    },
    {
      id: 'NURS-IRR-01',
      type: '灌溉系统',
      status: 'online',
      metrics: [
        { name: '状态', value: '待机' },
        { name: '上次灌溉', value: '2小时前' }
      ],
      lastUpdate: '5分钟前',
      signalStrength: 4
    }
  ],
  storage: [
    {
      id: 'COLD-TEMP-01',
      type: '温度控制',
      status: 'online',
      metrics: [
        { name: '温度', value: '2°C' },
        { name: '设定', value: '0-4°C' }
      ],
      lastUpdate: '30秒前',
      signalStrength: 4
    },
    {
      id: 'COLD-HUM-01',
      type: '湿度监测',
      status: 'online',
      metrics: [
        { name: '湿度', value: '85%' },
        { name: '状态', value: '正常' }
      ],
      lastUpdate: '1分钟前',
      signalStrength: 4
    },
    {
      id: 'COLD-DOOR-01',
      type: '门禁系统',
      status: 'online',
      metrics: [
        { name: '状态', value: '关闭' },
        { name: '今日开门', value: '3次' }
      ],
      lastUpdate: '10分钟前',
      signalStrength: 3
    }
  ]
})

// 当前区域设备
const currentAreaDevices = computed(() => {
  return devicesByArea.value[activeDeviceArea.value] || []
})

// 当前区域设备统计
const currentAreaDeviceSummary = computed(() => {
  const devices = currentAreaDevices.value
  const online = devices.filter(d => d.status === 'online').length
  const offline = devices.filter(d => d.status === 'offline').length
  const alert = devices.filter(d => d.status === 'alert').length
  return { online, offline, alert }
})

// 趋势标签
const trendTabs = ref([
  { key: 'temperature', label: '温度' },
  { key: 'humidity', label: '湿度' },
  { key: 'soil', label: '土壤' },
  { key: 'light', label: '光照' }
])

const trendLegend = ref([
  { label: '当前值', value: '23.5°C', color: '#1890ff' },
  { label: '平均值', value: '22.8°C', color: '#52c41a' },
  { label: '最高值', value: '26.2°C', color: '#fa8c16' }
])

// AI分析数据
const pestAlerts = ref([
  {
    id: 1,
    icon: '🐛',
    title: '稻飞虱风险',
    description: '检测到稻飞虱数量增加',
    action: '建议采取防治措施',
    level: 'warning',
    probability: 75
  },
  {
    id: 2,
    icon: '🦠',
    title: '纹枯病风险',
    description: '温湿度条件适宜病害发生',
    action: '注意通风降湿',
    level: 'low',
    probability: 35
  }
])

const yieldForecast = ref({
  total: 8500,
  change: 12.5,
  trend: 'up',
  confidence: 85
})

const aiSuggestions = ref([
  '根据当前生长阶段，建议增加氮肥施用量10%',
  '预计未来3天有降雨，可暂缓灌溉计划',
  '光照充足，适合进行叶面施肥'
])

// 热力图参数
const heatmapParams = ref([
  { key: 'temperature', label: '温度分布' },
  { key: 'humidity', label: '湿度分布' },
  { key: 'soil', label: '土壤状态' },
  { key: 'light', label: '光照强度' }
])

// 数据卡片
const dataCards = ref([
  {
    id: 'rice-temp',
    type: 'rice',
    icon: '🌾',
    title: '水稻田温度',
    value: '22.8',
    unit: '°C',
    status: 'normal',
    statusText: '正常',
    trend: 'up',
    trendText: '+0.3°C'
  },
  {
    id: 'orchard-humidity',
    type: 'orchard',
    icon: '🍎',
    title: '果园湿度',
    value: '63',
    unit: '%',
    status: 'normal',
    statusText: '正常',
    trend: 'stable',
    trendText: '稳定'
  },
  {
    id: 'greenhouse-co2',
    type: 'greenhouse',
    icon: '🏠',
    title: '大棚CO₂',
    value: '420',
    unit: 'ppm',
    status: 'normal',
    statusText: '正常',
    trend: 'down',
    trendText: '-15ppm'
  },
  {
    id: 'storage-temp',
    type: 'storage',
    icon: '❄️',
    title: '冷库温度',
    value: '4.0',
    unit: '°C',
    status: 'normal',
    statusText: '正常',
    trend: 'stable',
    trendText: '±0.1°C'
  }
])

// 农业图像数据
const agricultureImages = ref([
  {
    id: 1,
    icon: '🐛',
    label: '虫情监测',
    captureTime: '2024-01-15 14:30',
    location: '水稻田-01',
    aiResult: '检测到稻飞虱 3只',
    quality: '高清'
  },
  {
    id: 2,
    icon: '🌾',
    label: '作物长势',
    captureTime: '2024-01-15 14:25',
    location: '水稻田-02',
    aiResult: '长势良好，预计产量正常',
    quality: '高清'
  },
  {
    id: 3,
    icon: '🍎',
    label: '果实监测',
    captureTime: '2024-01-15 14:20',
    location: '果园-01',
    aiResult: '果实成熟度85%',
    quality: '高清'
  },
  {
    id: 4,
    icon: '🌡️',
    label: '环境监控',
    captureTime: '2024-01-15 14:15',
    location: '大棚-01',
    aiResult: null,
    quality: '高清'
  }
])

const selectedImageDetail = computed(() => {
  return agricultureImages.value.find(img => img.id === activeImage.value)
})

// 切换趋势标签
const switchTrendTab = (tab: string) => {
  activeTrendTab.value = tab
  drawTrendChart()
}

// 切换设备区域
const switchDeviceArea = (area: string, manual = false) => {
  activeDeviceArea.value = area
  
  // 如果是手动切换，暂停自动切换10秒
  if (manual && autoSwitchInterval) {
    isAutoSwitching.value = false
    clearInterval(autoSwitchInterval)
    autoSwitchInterval = null
    
    // 10秒后恢复自动切换
    setTimeout(() => {
      startAutoSwitch()
    }, 10000)
  }
}

// 开始自动切换
const startAutoSwitch = () => {
  if (autoSwitchInterval) return
  
  isAutoSwitching.value = true
  autoSwitchInterval = setInterval(() => {
    const currentIndex = deviceAreas.value.findIndex(area => area.key === activeDeviceArea.value)
    const nextIndex = (currentIndex + 1) % deviceAreas.value.length
    activeDeviceArea.value = deviceAreas.value[nextIndex].key
  }, 5000) // 每5秒切换一次
}

// 停止自动切换
const stopAutoSwitch = () => {
  isAutoSwitching.value = false
  if (autoSwitchInterval) {
    clearInterval(autoSwitchInterval)
    autoSwitchInterval = null
  }
}

// 绘制环境数据小图表
const drawEnvChart = (canvasId: string) => {
  const canvas = envChartRefs.value[canvasId]
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 80, 40)
  
  // 绘制迷你折线图
  const gradient = ctx.createLinearGradient(0, 0, 0, 40)
  gradient.addColorStop(0, 'rgba(24, 144, 255, 0.3)')
  gradient.addColorStop(1, 'rgba(24, 144, 255, 0)')
  
  ctx.fillStyle = gradient
  ctx.strokeStyle = '#1890ff'
  ctx.lineWidth = 1.5
  
  const data = Array.from({ length: 8 }, () => Math.random() * 30 + 5)
  const stepX = 80 / (data.length - 1)
  
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = index * stepX
    const y = 40 - (value / 40) * 35
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  // 填充区域
  ctx.lineTo(80, 40)
  ctx.lineTo(0, 40)
  ctx.closePath()
  ctx.fill()
  
  // 绘制线条
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = index * stepX
    const y = 40 - (value / 40) * 35
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
}

// 绘制趋势图
const drawTrendChart = () => {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 600, 300)
  
  // 绘制网格
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.lineWidth = 1
  
  // 水平网格线
  for (let i = 0; i <= 6; i++) {
    const y = i * 50
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(600, y)
    ctx.stroke()
  }
  
  // 绘制主曲线
  const hours = 24
  const stepX = 600 / hours
  const data1 = Array.from({ length: hours }, (_, i) => 
    Math.sin(i / 4) * 20 + 25 + Math.random() * 5
  )
  const data2 = Array.from({ length: hours }, (_, i) => 
    Math.cos(i / 3) * 15 + 22 + Math.random() * 3
  )
  
  // 绘制第一条曲线
  ctx.strokeStyle = '#1890ff'
  ctx.lineWidth = 2
  ctx.beginPath()
  data1.forEach((value, index) => {
    const x = index * stepX
    const y = 300 - (value / 50) * 300
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  
  // 绘制第二条曲线
  ctx.strokeStyle = '#52c41a'
  ctx.beginPath()
  data2.forEach((value, index) => {
    const x = index * stepX
    const y = 300 - (value / 50) * 300
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
}

// 绘制产量预测图
const drawYieldChart = () => {
  if (!yieldChart.value) return
  
  const ctx = yieldChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 260, 140)
  
  // 绘制柱状图
  const months = ['七月', '八月', '九月', '十月']
  const data = [7500, 8000, 8500, 8200]
  const barWidth = 45
  const gap = 18
  const startX = 15
  
  data.forEach((value, index) => {
    const x = startX + index * (barWidth + gap)
    const height = (value / 10000) * 110
    const y = 120 - height
    
    // 绘制柱子
    const gradient = ctx.createLinearGradient(0, y, 0, 120)
    gradient.addColorStop(0, '#52c41a')
    gradient.addColorStop(1, 'rgba(82, 196, 26, 0.2)')
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, barWidth, height)
    
    // 绘制标签
    ctx.fillStyle = '#8c8c8c'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(months[index], x + barWidth / 2, 135)
    
    // 绘制数值
    ctx.fillStyle = '#ffffff'
    ctx.font = '10px sans-serif'
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
  })
}

onMounted(() => {
  // 初始化图表
  setTimeout(() => {
    envMonitorData.value.forEach(item => {
      drawEnvChart(item.id)
    })
    drawTrendChart()
    drawYieldChart()
  }, 100)
  
  // 开始自动切换设备区域
  startAutoSwitch()
  
  // 定时更新数据
  const updateInterval = setInterval(() => {
    // 模拟数据更新
    mainStore.updateRealTimeData({
      temperature: 23.5 + Math.random() * 2 - 1,
      humidity: 65 + Math.random() * 10 - 5
    })
  }, 5000)
  
  onUnmounted(() => {
    clearInterval(updateInterval)
    stopAutoSwitch()
  })
})
</script>

<style scoped lang="scss">
.agriculture-page {
  width: 100%;
  height: 100vh;
  background: #0a0f1b;
  color: #ffffff;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

// 科技背景
.tech-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(24, 144, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(24, 144, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.8), transparent);
    animation: scan 4s linear infinite;
  }
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}

// 图标样式
.icon-env::before { content: '🌍'; margin-right: 8px; }
.icon-growth::before { content: '🌱'; margin-right: 8px; }
.icon-device::before { content: '📡'; margin-right: 8px; }
.icon-trend::before { content: '📈'; margin-right: 8px; }
.icon-ai::before { content: '🤖'; margin-right: 8px; }
.icon-water::before { content: '💧'; margin-right: 8px; }
.icon-alert::before { content: '⚠️'; margin-right: 8px; }
.icon-report::before { content: '📄'; margin-right: 8px; }

// 主内容布局
.page-main {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  padding: 24px;
  gap: 24px;
  max-height: calc(100vh - 80px);
  overflow: hidden;
}

.left-section {
  flex: 0 0 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

.middle-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.right-section {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(82, 196, 26, 0.3);
    border-radius: 3px;
  }
}

// 通用卡片样式
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
  }
}

// 环境监测卡片
.env-overview-card {
  background: linear-gradient(135deg, rgba(16, 24, 40, 0.95), rgba(26, 35, 53, 0.95));
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  flex: 0 0 auto;
  max-height: 45vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  .real-time-badge {
    background: rgba(82, 196, 26, 0.2);
    color: #52c41a;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .env-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    overflow-y: auto;
    padding-right: 8px;
    flex: 1;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(24, 144, 255, 0.3);
      border-radius: 3px;
    }
  }
  
  .env-item {
    background: rgba(12, 20, 38, 0.4);
    border: 1px solid rgba(24, 144, 255, 0.1);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.3s ease;
    min-height: 70px;
    
    &:hover {
      border-color: rgba(24, 144, 255, 0.3);
      transform: translateX(2px);
    }
    
    &.normal {
      .env-value { color: #52c41a; }
    }
    
    &.warning {
      border-color: rgba(250, 173, 20, 0.3);
      .env-value { color: #faad14; }
    }
    
    &.danger {
      border-color: rgba(255, 77, 79, 0.3);
      .env-value { color: #ff4d4f; }
    }
    
    .env-icon {
      font-size: 24px;
    }
    
    .env-info {
      flex: 1;
      
      .env-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.65);
        margin-bottom: 4px;
      }
      
      .env-value {
        font-size: 20px;
        font-weight: 600;
        
        .unit {
          font-size: 14px;
          font-weight: 400;
          margin-left: 4px;
          color: rgba(255, 255, 255, 0.45);
        }
      }
      
      .env-range {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.45);
        margin-top: 2px;
      }
    }
    
    .env-chart {
      width: 80px;
      height: 40px;
    }
  }
}

// 作物生长监测
.growth-monitor-card {
  background: linear-gradient(135deg, rgba(16, 24, 40, 0.95), rgba(26, 35, 53, 0.95));
  border: 1px solid rgba(82, 196, 26, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .area-selector {
    background: rgba(12, 20, 38, 0.6);
    border: 1px solid rgba(82, 196, 26, 0.3);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #52c41a;
    }
  }
  
  .growth-stages {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    padding: 20px 0;
    
    .stage-item {
      position: relative;
      flex: 1;
      text-align: center;
      z-index: 2;
      
      .stage-dot {
        width: 12px;
        height: 12px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        margin: 0 auto 8px;
        transition: all 0.3s ease;
      }
      
      .stage-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.65);
        margin-bottom: 4px;
      }
      
      .stage-date {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.45);
      }
      
      &.completed {
        .stage-dot {
          background: #52c41a;
          border-color: #52c41a;
        }
        .stage-label {
          color: #52c41a;
        }
      }
      
      &.active {
        .stage-dot {
          width: 16px;
          height: 16px;
          background: #1890ff;
          border-color: #1890ff;
          box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2);
        }
        .stage-label {
          color: #1890ff;
          font-weight: 600;
        }
      }
    }
    
    .progress-line {
      position: absolute;
      top: 26px;
      left: 0;
      height: 2px;
      background: #52c41a;
      transition: width 0.3s ease;
      z-index: 1;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 26px;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 0;
    }
  }
  
  .growth-metrics {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .metric-item {
      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .metric-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
        }
        
        .metric-status {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          
          &.good {
            background: rgba(82, 196, 26, 0.2);
            color: #52c41a;
          }
          
          &.excellent {
            background: rgba(24, 144, 255, 0.2);
            color: #1890ff;
          }
        }
      }
      
      .metric-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 4px;
        
        .metric-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
      }
      
      .metric-value {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.65);
        text-align: right;
      }
    }
  }
}

// IoT设备状态监控
.device-monitor-card {
  background: linear-gradient(135deg, rgba(16, 24, 40, 0.95), rgba(26, 35, 53, 0.95));
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  flex: 1;
  min-height: 45vh;
  display: flex;
  flex-direction: column;
  
  .card-header {
    margin-bottom: 16px;
  }
  
  .device-summary {
    display: flex;
    gap: 16px;
    font-size: 14px;
    
    span {
      padding: 4px 12px;
      border-radius: 12px;
      
      &.online {
        background: rgba(82, 196, 26, 0.2);
        color: #52c41a;
      }
      
      &.offline {
        background: rgba(255, 77, 79, 0.2);
        color: #ff4d4f;
      }
      
      &.alert {
        background: rgba(250, 173, 20, 0.2);
        color: #faad14;
      }
    }
  }
  
  .area-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    
    .area-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: rgba(12, 20, 38, 0.6);
      border: 1px solid rgba(24, 144, 255, 0.2);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      .tab-icon {
        font-size: 16px;
      }
      
      .tab-label {
        font-weight: 500;
      }
      
      .tab-count {
        background: rgba(24, 144, 255, 0.2);
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 600;
      }
      
      &:hover {
        background: rgba(24, 144, 255, 0.1);
        border-color: rgba(24, 144, 255, 0.4);
        transform: translateY(-1px);
      }
      
      &.active {
        background: rgba(24, 144, 255, 0.2);
        border-color: #1890ff;
        color: #ffffff;
        position: relative;
        
        .tab-count {
          background: #1890ff;
          color: #ffffff;
        }
        
        // 自动切换进度条
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: #1890ff;
          animation: progress 5s linear;
        }
      }
    }
  }
  
  @keyframes progress {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  
  .device-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;
    align-content: start;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(24, 144, 255, 0.3);
      border-radius: 3px;
      
      &:hover {
        background: rgba(24, 144, 255, 0.5);
      }
    }
  }
  
  .device-item {
    background: rgba(12, 20, 38, 0.5);
    border: 1px solid rgba(24, 144, 255, 0.15);
    border-radius: 10px;
    padding: 18px;
    transition: all 0.3s ease;
    height: fit-content;
    
    &:hover {
      background: rgba(12, 20, 38, 0.7);
      border-color: rgba(24, 144, 255, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    &.online {
      border-color: rgba(82, 196, 26, 0.2);
    }
    
    &.offline {
      border-color: rgba(255, 77, 79, 0.2);
      opacity: 0.6;
    }
    
    &.alert {
      border-color: rgba(250, 173, 20, 0.3);
      animation: alertPulse 2s infinite;
    }
    
    .device-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      .device-type {
        font-size: 15px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 600;
      }
      
      .device-id {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
        font-family: monospace;
      }
    }
    
    .device-metrics {
      margin-bottom: 12px;
      
      .metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        line-height: 2;
        padding: 4px 0;
        
        .metric-name {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .metric-value {
          color: #1890ff;
          font-weight: 600;
          font-size: 15px;
        }
      }
    }
    
    .device-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      
      .last-update {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }
      
      .signal-strength {
        display: flex;
        gap: 3px;
        align-items: flex-end;
        
        .signal-bar {
          width: 4px;
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          transition: all 0.3s ease;
          
          &.active {
            background: #52c41a;
          }
          
          &:nth-child(2) { height: 14px; }
          &:nth-child(3) { height: 18px; }
          &:nth-child(4) { height: 22px; }
        }
      }
    }
  }
}

@keyframes alertPulse {
  0%, 100% {
    border-color: rgba(250, 173, 20, 0.3);
  }
  50% {
    border-color: rgba(250, 173, 20, 0.6);
  }
}

// 数据趋势分析
.trend-analysis-card {
  background: linear-gradient(135deg, rgba(16, 24, 40, 0.95), rgba(26, 35, 53, 0.95));
  border: 1px solid rgba(24, 144, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(10px);
  flex: 1;
  
  .trend-tabs {
    display: flex;
    gap: 8px;
    
    .trend-tab {
      padding: 6px 16px;
      background: rgba(12, 20, 38, 0.6);
      border: 1px solid rgba(24, 144, 255, 0.2);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(24, 144, 255, 0.4);
      }
      
      &.active {
        background: rgba(24, 144, 255, 0.2);
        border-color: #1890ff;
        color: #1890ff;
      }
    }
  }
  
  .trend-chart-container {
    position: relative;
    
    canvas {
      width: 100%;
      height: 300px;
    }
    
    .trend-legend {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 16px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        
        .legend-label {
          color: rgba(255, 255, 255, 0.65);
        }
        
        .legend-value {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }
      }
    }
  }
}

// AI智能分析
.ai-analysis-card {
  background: linear-gradient(135deg, rgba(16, 24, 40, 0.95), rgba(26, 35, 53, 0.95));
  border: 1px solid rgba(82, 196, 26, 0.2);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  
  .ai-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #52c41a;
    
    .status-dot {
      width: 8px;
      height: 8px;
      background: #52c41a;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }
  
  .ai-module {
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .module-title {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 10px;
      padding-left: 12px;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 14px;
        background: #52c41a;
        border-radius: 2px;
      }
    }
  }
  
  .pest-alerts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .alert-item {
      background: rgba(12, 20, 38, 0.4);
      border: 1px solid rgba(24, 144, 255, 0.1);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      gap: 12px;
      transition: all 0.3s ease;
      
      &.warning {
        border-color: rgba(250, 173, 20, 0.3);
        background: rgba(250, 173, 20, 0.05);
      }
      
      &.low {
        border-color: rgba(24, 144, 255, 0.2);
      }
      
      .alert-icon {
        font-size: 24px;
      }
      
      .alert-info {
        flex: 1;
        
        .alert-title {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 4px;
        }
        
        .alert-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 4px;
        }
        
        .alert-action {
          font-size: 11px;
          color: #1890ff;
        }
      }
      
      .alert-probability {
        font-size: 18px;
        font-weight: 600;
        color: #faad14;
      }
    }
  }
  
  .yield-forecast {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .forecast-chart {
      width: 100%;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(12, 20, 38, 0.4);
      border-radius: 8px;
      padding: 10px;
    }
    
    .forecast-summary {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(12, 20, 38, 0.4);
        border-radius: 6px;
        
        .label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
        }
        
        .value {
          font-size: 16px;
          font-weight: 500;
          color: #1890ff;
          
          &.up {
            color: #52c41a;
            
            &::before {
              content: '+';
            }
          }
          
          &.down {
            color: #ff4d4f;
          }
        }
      }
    }
  }
  
  .suggestions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .suggestion-item {
      display: flex;
      gap: 8px;
      padding: 8px;
      background: rgba(12, 20, 38, 0.4);
      border-radius: 6px;
      
      .suggestion-icon {
        font-size: 16px;
      }
      
      .suggestion-text {
        flex: 1;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.85);
        line-height: 1.4;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

// 操作面板
.control-panel {
  display: flex;
  gap: 12px;
  
  .control-btn {
    flex: 1;
    padding: 12px 16px;
    background: rgba(16, 24, 40, 0.8);
    border: 1px solid rgba(24, 144, 255, 0.2);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
      background: rgba(24, 144, 255, 0.1);
      border-color: rgba(24, 144, 255, 0.4);
      transform: translateY(-1px);
    }
    
    &.primary {
      background: rgba(24, 144, 255, 0.15);
      border-color: #1890ff;
      color: #1890ff;
      
      &:hover {
        background: rgba(24, 144, 255, 0.25);
      }
    }
    
    i {
      font-style: normal;
    }
  }
}
</style>