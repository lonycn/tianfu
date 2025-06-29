<template>
  <div class="ecology-page">
    <!-- 背景动画 -->
    <div class="bg-animation">
      <div 
        v-for="i in 12" 
        :key="i" 
        class="particle" 
        :style="getParticleStyle(i)"
      ></div>
    </div>
    
    <!-- 网格背景 -->
    <div class="grid-bg"></div>
    
    <!-- 页面头部 -->
    <UnifiedHeader current-page="ecology" />

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：环境监测数据 -->
      <section class="left-section">
        <!-- 空气质量监测 -->
        <div class="air-quality-monitor">
          <h2 class="section-title">空气质量实时监测</h2>
          <div class="aqi-display">
            <div class="aqi-main">
              <div class="aqi-value" :class="getAQILevel(currentAQI).class">{{ currentAQI }}</div>
              <div class="aqi-label">AQI指数</div>
              <div class="aqi-status" :style="{ color: getAQILevel(currentAQI).color }">
                {{ getAQILevel(currentAQI).status }}
              </div>
            </div>
            
            <div class="pollutant-details">
              <div class="pollutant-item" v-for="pollutant in pollutants" :key="pollutant.name">
                <div class="pollutant-name">{{ pollutant.name }}</div>
                <div class="pollutant-value">{{ pollutant.value }}</div>
                <div class="pollutant-unit">{{ pollutant.unit }}</div>
                <div class="pollutant-bar">
                  <div 
                    class="pollutant-progress" 
                    :style="{ width: `${pollutant.percentage}%`, backgroundColor: pollutant.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 水质监测 -->
        <div class="water-quality-monitor">
          <h3 class="subsection-title">水质监测数据</h3>
          <div class="water-stations">
            <div 
              class="station-card" 
              v-for="station in waterStations" 
              :key="station.id"
              @click="selectWaterStation(station.id)"
              :class="{ active: selectedWaterStation === station.id }"
            >
              <div class="station-header">
                <div class="station-icon">💧</div>
                <div class="station-name">{{ station.name }}</div>
                <div class="station-status" :class="station.status">{{ station.statusText }}</div>
              </div>
              
              <div class="station-metrics">
                <div class="metric-row">
                  <span class="metric-label">pH值:</span>
                  <span class="metric-value">{{ station.ph }}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">溶解氧:</span>
                  <span class="metric-value">{{ station.dissolvedOxygen }}mg/L</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">浊度:</span>
                  <span class="metric-value">{{ station.turbidity }}NTU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右侧：生态保护数据 -->
      <section class="right-section">
        <!-- 生物多样性统计 -->
        <div class="biodiversity-stats">
          <h2 class="section-title">生物多样性统计</h2>
          <div class="species-overview">
            <div class="species-category" v-for="category in speciesData" :key="category.name">
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-content">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-count">{{ category.count }}种</div>
                <div class="category-trend" :class="category.trend">
                  {{ category.trendText }}
                </div>
              </div>
              <div class="category-chart">
                <canvas 
                  :ref="el => categoryCharts[category.name] = el" 
                  width="60" 
                  height="60"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 湿地保护区域 -->
        <div class="wetland-protection">
          <h3 class="subsection-title">湿地保护区域分布</h3>
          <div class="protection-map">
            <svg viewBox="0 0 500 300" class="wetland-map-svg">
              <!-- 湿地区域 -->
              <g v-for="area in wetlandAreas" :key="area.id">
                <path 
                  :d="area.path" 
                  :fill="area.color" 
                  :opacity="area.opacity"
                  :stroke="area.strokeColor"
                  stroke-width="2"
                />
                <text 
                  :x="area.labelX" 
                  :y="area.labelY" 
                  :fill="area.textColor" 
                  text-anchor="middle" 
                  font-size="12"
                  font-weight="bold"
                >{{ area.name }}</text>
                <text 
                  :x="area.labelX" 
                  :y="area.labelY + 15" 
                  :fill="area.textColor" 
                  text-anchor="middle" 
                  font-size="10"
                >{{ area.area }}公顷</text>
              </g>
              
              <!-- 监测点 -->
              <g v-for="point in monitoringPoints" :key="point.id">
                <circle 
                  :cx="point.x" 
                  :cy="point.y" 
                  r="6" 
                  :fill="point.color"
                  stroke="white"
                  stroke-width="2"
                />
                <circle 
                  :cx="point.x" 
                  :cy="point.y" 
                  r="12" 
                  fill="none"
                  :stroke="point.color"
                  stroke-width="1"
                  opacity="0.5"
                >
                  <animate 
                    attributeName="r" 
                    values="12;18;12" 
                    dur="2s" 
                    repeatCount="indefinite"
                  />
                  <animate 
                    attributeName="opacity" 
                    values="0.5;0;0.5" 
                    dur="2s" 
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </svg>
          </div>
          
          <div class="protection-stats">
            <div class="stat-item">
              <div class="stat-icon">🌿</div>
              <div class="stat-content">
                <div class="stat-value">2,847</div>
                <div class="stat-label">保护区面积(公顷)</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">🔬</div>
              <div class="stat-content">
                <div class="stat-value">24</div>
                <div class="stat-label">监测点位</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">98.5%</div>
                <div class="stat-label">生态完整性</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 环境趋势分析 -->
        <div class="environmental-trends">
          <h3 class="subsection-title">环境质量趋势分析</h3>
          <div class="trend-tabs">
            <div 
              class="trend-tab" 
              v-for="tab in trendTabs" 
              :key="tab.id"
              @click="selectTrendTab(tab.id)"
              :class="{ active: selectedTrendTab === tab.id }"
            >
              {{ tab.name }}
            </div>
          </div>
          
          <div class="trend-chart-container">
            <canvas ref="trendChart" width="450" height="200"></canvas>
          </div>
          
          <div class="trend-summary">
            <div class="summary-item" v-for="summary in currentTrendSummary" :key="summary.label">
              <div class="summary-label">{{ summary.label }}</div>
              <div class="summary-value" :class="summary.trend">{{ summary.value }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import UnifiedHeader from '@/components/UnifiedHeader.vue'

const router = useRouter()
const trendChart = ref<HTMLCanvasElement>()
const categoryCharts = ref<Record<string, HTMLCanvasElement>>({})

const currentTime = ref('')
const currentAQI = ref(45)
const selectedWaterStation = ref(1)
const selectedTrendTab = ref('air')

// 污染物数据
const pollutants = ref([
  { name: 'PM2.5', value: 12, unit: 'μg/m³', percentage: 24, color: '#7ED321' },
  { name: 'PM10', value: 28, unit: 'μg/m³', percentage: 35, color: '#4A90E2' },
  { name: 'SO2', value: 8, unit: 'μg/m³', percentage: 16, color: '#F5A623' },
  { name: 'NO2', value: 15, unit: 'μg/m³', percentage: 30, color: '#BD10E0' },
  { name: 'CO', value: 0.6, unit: 'mg/m³', percentage: 12, color: '#50E3C2' },
  { name: 'O3', value: 85, unit: 'μg/m³', percentage: 53, color: '#FF6B6B' }
])

// 水质监测站点
const waterStations = ref([
  {
    id: 1,
    name: '湿地核心区',
    status: 'excellent',
    statusText: '优',
    ph: 7.2,
    dissolvedOxygen: 8.5,
    turbidity: 2.1
  },
  {
    id: 2,
    name: '缓冲区域',
    status: 'good',
    statusText: '良',
    ph: 7.0,
    dissolvedOxygen: 7.8,
    turbidity: 3.2
  },
  {
    id: 3,
    name: '实验区',
    status: 'good',
    statusText: '良',
    ph: 6.9,
    dissolvedOxygen: 7.2,
    turbidity: 4.1
  }
])

// 物种数据
const speciesData = ref([
  {
    name: '鸟类',
    icon: '🦅',
    count: 156,
    trend: 'up',
    trendText: '↗ +8种',
    data: [45, 52, 48, 61, 55, 67]
  },
  {
    name: '植物',
    icon: '🌱',
    count: 342,
    trend: 'up',
    trendText: '↗ +15种',
    data: [120, 135, 128, 145, 138, 152]
  },
  {
    name: '水生动物',
    icon: '🐟',
    count: 89,
    trend: 'stable',
    trendText: '→ 稳定',
    data: [28, 32, 30, 35, 33, 36]
  },
  {
    name: '昆虫',
    icon: '🦋',
    count: 278,
    trend: 'up',
    trendText: '↗ +12种',
    data: [85, 92, 88, 98, 95, 105]
  }
])

// 湿地保护区域
const wetlandAreas = ref([
  {
    id: 1,
    name: '核心保护区',
    area: 1247,
    path: 'M50,50 L200,50 L200,150 L50,150 Z',
    color: '#7ED321',
    opacity: 0.3,
    strokeColor: '#7ED321',
    textColor: '#7ED321',
    labelX: 125,
    labelY: 90
  },
  {
    id: 2,
    name: '缓冲区',
    area: 856,
    path: 'M220,60 L380,60 L380,180 L220,180 Z',
    color: '#4A90E2',
    opacity: 0.3,
    strokeColor: '#4A90E2',
    textColor: '#4A90E2',
    labelX: 300,
    labelY: 110
  },
  {
    id: 3,
    name: '实验区',
    area: 744,
    path: 'M100,200 L350,200 L350,280 L100,280 Z',
    color: '#F5A623',
    opacity: 0.3,
    strokeColor: '#F5A623',
    textColor: '#F5A623',
    labelX: 225,
    labelY: 235
  }
])

// 监测点位
const monitoringPoints = ref([
  { id: 1, x: 100, y: 80, color: '#7ED321' },
  { id: 2, x: 170, y: 120, color: '#7ED321' },
  { id: 3, x: 250, y: 90, color: '#4A90E2' },
  { id: 4, x: 320, y: 140, color: '#4A90E2' },
  { id: 5, x: 150, y: 230, color: '#F5A623' },
  { id: 6, x: 280, y: 250, color: '#F5A623' }
])

// 趋势分析标签
const trendTabs = ref([
  { id: 'air', name: '空气质量' },
  { id: 'water', name: '水质状况' },
  { id: 'biodiversity', name: '生物多样性' }
])

// 趋势摘要数据
const trendSummaryData = {
  air: [
    { label: '月均AQI', value: '42', trend: 'up' },
    { label: '优良天数', value: '28天', trend: 'up' },
    { label: '同比改善', value: '+15%', trend: 'up' }
  ],
  water: [
    { label: '水质达标率', value: '100%', trend: 'stable' },
    { label: '平均pH值', value: '7.1', trend: 'stable' },
    { label: '溶解氧', value: '8.2mg/L', trend: 'up' }
  ],
  biodiversity: [
    { label: '物种总数', value: '865种', trend: 'up' },
    { label: '新发现物种', value: '3种', trend: 'up' },
    { label: '保护成效', value: '98.5%', trend: 'up' }
  ]
}

const currentTrendSummary = computed(() => {
  return trendSummaryData[selectedTrendTab.value as keyof typeof trendSummaryData] || []
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const left = Math.random() * 100
  const animationDuration = Math.random() * 5 + 4
  const animationDelay = Math.random() * 3
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

const getAQILevel = (aqi: number) => {
  if (aqi <= 50) {
    return { status: '优', color: '#7ED321', class: 'excellent' }
  } else if (aqi <= 100) {
    return { status: '良', color: '#4A90E2', class: 'good' }
  } else if (aqi <= 150) {
    return { status: '轻度污染', color: '#F5A623', class: 'moderate' }
  } else {
    return { status: '重度污染', color: '#FF6B6B', class: 'poor' }
  }
}

const goBack = () => {
  router.push('/')
}

const selectWaterStation = (stationId: number) => {
  selectedWaterStation.value = stationId
}

const selectTrendTab = (tabId: string) => {
  selectedTrendTab.value = tabId
  setTimeout(() => {
    drawTrendChart()
  }, 100)
}

const drawCategoryChart = (canvasElement: HTMLCanvasElement, data: number[]) => {
  const ctx = canvasElement.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 60, 60)
  
  const centerX = 30
  const centerY = 30
  const radius = 25
  const maxValue = Math.max(...data)
  
  // 绘制背景圆
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.2)'
  ctx.lineWidth = 4
  ctx.stroke()
  
  // 绘制数据线
  ctx.beginPath()
  data.forEach((value, index) => {
    const angle = (index / (data.length - 1)) * Math.PI * 2 - Math.PI / 2
    const r = (value / maxValue) * radius
    const x = centerX + Math.cos(angle) * r
    const y = centerY + Math.sin(angle) * r
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.strokeStyle = '#7ED321'
  ctx.lineWidth = 2
  ctx.stroke()
  
  // 绘制数据点
  data.forEach((value, index) => {
    const angle = (index / (data.length - 1)) * Math.PI * 2 - Math.PI / 2
    const r = (value / maxValue) * radius
    const x = centerX + Math.cos(angle) * r
    const y = centerY + Math.sin(angle) * r
    
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, 2 * Math.PI)
    ctx.fillStyle = '#7ED321'
    ctx.fill()
  })
}

const drawTrendChart = () => {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 450, 200)
  
  // 模拟不同类型的趋势数据
  const trendData = {
    air: [42, 38, 45, 35, 40, 32, 45],
    water: [95, 97, 96, 98, 97, 99, 98],
    biodiversity: [850, 855, 860, 862, 863, 865, 865]
  }
  
  const data = trendData[selectedTrendTab.value as keyof typeof trendData] || []
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
  
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  
  const stepX = 400 / (data.length - 1)
  const startX = 25
  const startY = 170
  const chartHeight = 140
  
  // 绘制网格线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = startY - (i * chartHeight / 5)
    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(startX + 400, y)
    ctx.stroke()
  }
  
  // 绘制趋势线
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = startX + index * stepX
    const y = startY - ((value - minValue) / range) * chartHeight
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.strokeStyle = '#7ED321'
  ctx.lineWidth = 3
  ctx.stroke()
  
  // 绘制数据点
  data.forEach((value, index) => {
    const x = startX + index * stepX
    const y = startY - ((value - minValue) / range) * chartHeight
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#7ED321'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.strokeStyle = '#7ED321'
    ctx.lineWidth = 2
    ctx.stroke()
  })
  
  // 绘制标签
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  labels.forEach((label, index) => {
    const x = startX + index * stepX
    ctx.fillText(label, x, 190)
  })
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  setTimeout(() => {
    // 绘制物种分类图表
    speciesData.value.forEach(species => {
      const canvas = categoryCharts.value[species.name]
      if (canvas) {
        drawCategoryChart(canvas, species.data)
      }
    })
    
    // 绘制趋势图表
    drawTrendChart()
  }, 100)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped lang="scss">
.ecology-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0c1426 0%, #1a2332 50%, #0c1426 100%);
  color: #ffffff;
  overflow: hidden;
  position: relative;
}

// 背景动画
.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: rgba(126, 211, 33, 0.6);
  border-radius: 50%;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10px) rotate(360deg);
    opacity: 0;
  }
}

.grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(126, 211, 33, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(126, 211, 33, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 1;
}

// 头部
.page-header {
  position: relative;
  z-index: 10;
  padding: 20px;
  border-bottom: 1px solid rgba(74, 144, 226, 0.3);
  
  @media (min-width: 768px) {
    padding: 20px 40px;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(126, 211, 33, 0.2);
  border: 1px solid rgba(126, 211, 33, 0.5);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(126, 211, 33, 0.3);
    transform: translateX(-2px);
  }
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #7ED321;
  margin: 0;
}

.time-display {
  font-size: 18px;
  color: #4A90E2;
  font-weight: bold;
}

// 主内容
.page-main {
  position: relative;
  z-index: 10;
  display: flex;
  padding: 20px;
  gap: 20px;
  height: calc(100vh - 140px);
  
  @media (min-width: 768px) {
    padding: 30px 40px;
    gap: 30px;
  }
  
  @media (max-width: 767px) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 140px);
  }
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.right-section {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #7ED321;
  border-left: 4px solid #7ED321;
  padding-left: 12px;
}

.subsection-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #4A90E2;
}

// 空气质量监测
.air-quality-monitor {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.aqi-display {
  display: flex;
  gap: 20px;
}

.aqi-main {
  text-align: center;
  
  .aqi-value {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 5px;
    
    &.excellent {
      color: #7ED321;
    }
    
    &.good {
      color: #4A90E2;
    }
    
    &.moderate {
      color: #F5A623;
    }
    
    &.poor {
      color: #FF6B6B;
    }
  }
  
  .aqi-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 8px;
  }
  
  .aqi-status {
    font-size: 16px;
    font-weight: bold;
  }
}

.pollutant-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pollutant-item {
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  grid-template-rows: 1fr 1fr;
  gap: 5px;
  align-items: center;
  
  .pollutant-name {
    grid-row: 1 / 3;
    font-size: 12px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .pollutant-value {
    font-size: 16px;
    font-weight: bold;
    color: #7ED321;
  }
  
  .pollutant-unit {
    grid-row: 1 / 3;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .pollutant-bar {
    grid-column: 2;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    
    .pollutant-progress {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }
}

// 水质监测
.water-quality-monitor {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
}

.water-stations {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.station-card {
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
  }
  
  &.active {
    border-color: #7ED321;
    box-shadow: 0 0 15px rgba(126, 211, 33, 0.3);
  }
}

.station-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  
  .station-icon {
    font-size: 18px;
  }
  
  .station-name {
    flex: 1;
    font-size: 14px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .station-status {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    
    &.excellent {
      background: rgba(126, 211, 33, 0.2);
      color: #7ED321;
    }
    
    &.good {
      background: rgba(74, 144, 226, 0.2);
      color: #4A90E2;
    }
  }
}

.station-metrics {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  
  .metric-label {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .metric-value {
    color: #7ED321;
    font-weight: bold;
  }
}

// 生物多样性统计
.biodiversity-stats {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.species-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.species-category {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
  }
  
  .category-icon {
    font-size: 24px;
  }
  
  .category-content {
    flex: 1;
    
    .category-name {
      font-size: 14px;
      color: #4A90E2;
      margin-bottom: 5px;
    }
    
    .category-count {
      font-size: 18px;
      font-weight: bold;
      color: #7ED321;
      margin-bottom: 3px;
    }
    
    .category-trend {
      font-size: 10px;
      
      &.up {
        color: #7ED321;
      }
      
      &.stable {
        color: #4A90E2;
      }
      
      &.down {
        color: #FF6B6B;
      }
    }
  }
  
  .category-chart {
    width: 60px;
    height: 60px;
  }
}

// 湿地保护
.wetland-protection {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.protection-map {
  margin-bottom: 20px;
  
  .wetland-map-svg {
    width: 100%;
    height: 300px;
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
  }
}

.protection-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  
  .stat-icon {
    font-size: 20px;
  }
  
  .stat-content {
    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #4A90E2;
    }
    
    .stat-label {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

// 环境趋势分析
.environmental-trends {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.trend-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.trend-tab {
  padding: 8px 16px;
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  
  &:hover {
    border-color: #4A90E2;
  }
  
  &.active {
    background: rgba(126, 211, 33, 0.2);
    border-color: #7ED321;
    color: #7ED321;
  }
}

.trend-chart-container {
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

.trend-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.summary-item {
  text-align: center;
  padding: 10px;
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  
  .summary-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 5px;
  }
  
  .summary-value {
    font-size: 16px;
    font-weight: bold;
    
    &.up {
      color: #7ED321;
    }
    
    &.stable {
      color: #4A90E2;
    }
    
    &.down {
      color: #FF6B6B;
    }
  }
}
</style>