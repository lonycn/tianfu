<template>
  <div class="agriculture-page">
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
    <UnifiedHeader current-page="agriculture" />

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：监测点地图 -->
      <section class="left-section">
        <div class="monitoring-map">
          <h2 class="section-title">农业监测点分布</h2>
          <div class="map-container">
            <svg viewBox="0 0 500 400" class="monitoring-svg">
              <!-- 背景区域 -->
              <rect x="0" y="0" width="500" height="400" fill="#0c1426" stroke="#4A90E2" stroke-width="1" opacity="0.3"/>
              
              <!-- 水稻田区域 -->
              <rect x="50" y="50" width="180" height="120" fill="#7ED321" opacity="0.3" rx="5"/>
              <text x="140" y="75" fill="#7ED321" text-anchor="middle" font-size="12">水稻田监测区</text>
              
              <!-- 果园区域 -->
              <rect x="270" y="50" width="180" height="120" fill="#F5A623" opacity="0.3" rx="5"/>
              <text x="360" y="75" fill="#F5A623" text-anchor="middle" font-size="12">果园监测区</text>
              
              <!-- 大棚区域 -->
              <rect x="50" y="200" width="180" height="120" fill="#BD10E0" opacity="0.3" rx="5"/>
              <text x="140" y="225" fill="#BD10E0" text-anchor="middle" font-size="12">大棚监测区</text>
              
              <!-- 冷库区域 -->
              <rect x="270" y="200" width="180" height="120" fill="#4A90E2" opacity="0.3" rx="5"/>
              <text x="360" y="225" fill="#4A90E2" text-anchor="middle" font-size="12">冷库监测区</text>
              
              <!-- 监测点 -->
              <circle 
                v-for="point in monitoringPoints" 
                :key="point.id"
                :cx="point.x" 
                :cy="point.y" 
                :r="6" 
                :fill="point.status === 'online' ? '#7ED321' : '#D0021B'"
                class="monitoring-point"
                @click="selectPoint(point)"
              />
              
              <!-- 选中点的详情 -->
              <g v-if="selectedPoint">
                <rect 
                  :x="selectedPoint.x + 10" 
                  :y="selectedPoint.y - 40" 
                  width="120" 
                  height="60" 
                  fill="rgba(26, 35, 50, 0.9)" 
                  stroke="#4A90E2" 
                  rx="5"
                />
                <text :x="selectedPoint.x + 15" :y="selectedPoint.y - 25" fill="white" font-size="10">{{ selectedPoint.name }}</text>
                <text :x="selectedPoint.x + 15" :y="selectedPoint.y - 15" fill="#4A90E2" font-size="9">温度: {{ selectedPoint.temperature }}°C</text>
                <text :x="selectedPoint.x + 15" :y="selectedPoint.y - 5" fill="#4A90E2" font-size="9">湿度: {{ selectedPoint.humidity }}%</text>
              </g>
            </svg>
          </div>
        </div>
        
        <!-- 环境热力图 -->
        <div class="heatmap-section">
          <h3 class="subsection-title">环境参数热力图</h3>
          <div class="heatmap-controls">
            <button 
              v-for="param in heatmapParams" 
              :key="param.key"
              :class="['param-btn', { active: activeParam === param.key }]"
              @click="switchHeatmap(param.key)"
            >
              {{ param.label }}
            </button>
          </div>
          <div class="heatmap-display">
            <canvas ref="heatmapCanvas" width="300" height="200"></canvas>
          </div>
        </div>
      </section>

      <!-- 右侧：实时数据和图像 -->
      <section class="right-section">
        <!-- 实时数据卡片 -->
        <div class="data-cards">
          <div 
            v-for="card in dataCards" 
            :key="card.id"
            class="data-card"
            :class="card.type"
          >
            <div class="card-header">
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-title">{{ card.title }}</div>
              <div class="card-status" :class="card.status">{{ card.statusText }}</div>
            </div>
            <div class="card-content">
              <div class="main-value">
                <span class="value">{{ card.value }}</span>
                <span class="unit">{{ card.unit }}</span>
              </div>
              <div class="trend" :class="card.trend">
                <span class="trend-icon">{{ card.trend === 'up' ? '↗' : card.trend === 'down' ? '↘' : '→' }}</span>
                <span class="trend-text">{{ card.trendText }}</span>
              </div>
            </div>
            <div class="card-chart">
              <canvas :ref="el => chartRefs[card.id] = el" width="200" height="60"></canvas>
            </div>
          </div>
        </div>
        
        <!-- 农业图像展示 -->
        <div class="image-section">
          <h3 class="subsection-title">实时农业图像</h3>
          <div class="image-gallery">
            <div 
              v-for="image in agricultureImages" 
              :key="image.id"
              class="image-item"
              :class="{ active: activeImage === image.id }"
              @click="selectImage(image.id)"
            >
              <div class="image-placeholder">
                <div class="image-icon">{{ image.icon }}</div>
                <div class="image-label">{{ image.label }}</div>
              </div>
              <div class="image-info">
                <div class="capture-time">{{ image.captureTime }}</div>
                <div class="ai-result" v-if="image.aiResult">
                  <span class="ai-tag">AI识别</span>
                  <span class="ai-text">{{ image.aiResult }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 图像详情 -->
          <div class="image-detail" v-if="selectedImageDetail">
            <h4>{{ selectedImageDetail.label }}详情</h4>
            <div class="detail-content">
              <div class="detail-item">
                <span class="label">拍摄时间:</span>
                <span class="value">{{ selectedImageDetail.captureTime }}</span>
              </div>
              <div class="detail-item">
                <span class="label">设备位置:</span>
                <span class="value">{{ selectedImageDetail.location }}</span>
              </div>
              <div class="detail-item" v-if="selectedImageDetail.aiResult">
                <span class="label">AI分析:</span>
                <span class="value ai-highlight">{{ selectedImageDetail.aiResult }}</span>
              </div>
              <div class="detail-item">
                <span class="label">图像质量:</span>
                <span class="value">{{ selectedImageDetail.quality }}</span>
              </div>
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
const heatmapCanvas = ref<HTMLCanvasElement>()
const chartRefs = ref<Record<string, HTMLCanvasElement>>({})

const currentTime = ref('')
const selectedPoint = ref<any>(null)
const activeParam = ref('temperature')
const activeImage = ref(1)

// 监测点数据
const monitoringPoints = ref([
  { id: 1, name: '水稻田-01', x: 100, y: 100, temperature: 22.5, humidity: 68, status: 'online' },
  { id: 2, name: '水稻田-02', x: 180, y: 130, temperature: 23.1, humidity: 65, status: 'online' },
  { id: 3, name: '果园-01', x: 320, y: 90, temperature: 24.2, humidity: 62, status: 'online' },
  { id: 4, name: '果园-02', x: 400, y: 120, temperature: 23.8, humidity: 64, status: 'offline' },
  { id: 5, name: '大棚-01', x: 100, y: 250, temperature: 26.5, humidity: 75, status: 'online' },
  { id: 6, name: '大棚-02', x: 180, y: 280, temperature: 25.9, humidity: 73, status: 'online' },
  { id: 7, name: '冷库-01', x: 320, y: 240, temperature: 4.2, humidity: 85, status: 'online' },
  { id: 8, name: '冷库-02', x: 400, y: 270, temperature: 3.8, humidity: 87, status: 'online' }
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

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const left = Math.random() * 100
  const animationDuration = Math.random() * 4 + 3
  const animationDelay = Math.random() * 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

const goBack = () => {
  router.push('/')
}

const selectPoint = (point: any) => {
  selectedPoint.value = point
}

const switchHeatmap = (param: string) => {
  activeParam.value = param
  drawHeatmap()
}

const selectImage = (imageId: number) => {
  activeImage.value = imageId
}

const drawHeatmap = () => {
  if (!heatmapCanvas.value) return
  
  const ctx = heatmapCanvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 300, 200)
  
  // 绘制热力图网格
  const gridSize = 20
  const cols = Math.floor(300 / gridSize)
  const rows = Math.floor(200 / gridSize)
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const intensity = Math.random()
      const hue = activeParam.value === 'temperature' ? (1 - intensity) * 240 : intensity * 120
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.6)`
      ctx.fillRect(j * gridSize, i * gridSize, gridSize, gridSize)
    }
  }
}

const drawChart = (canvasId: string) => {
  const canvas = chartRefs.value[canvasId]
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 200, 60)
  
  // 绘制简单的趋势线
  ctx.strokeStyle = '#4A90E2'
  ctx.lineWidth = 2
  ctx.beginPath()
  
  const data = Array.from({ length: 10 }, () => Math.random() * 40 + 10)
  const stepX = 200 / (data.length - 1)
  
  data.forEach((value, index) => {
    const x = index * stepX
    const y = 60 - (value / 60) * 60
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  setTimeout(() => {
    drawHeatmap()
    dataCards.value.forEach(card => {
      drawChart(card.id)
    })
  }, 100)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped lang="scss">
.agriculture-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0c1426 0%, #1a2332 50%, #0c1426 100%);
  color: #ffffff;
  overflow: hidden;
  position: relative;
}

// 背景动画和网格（复用首页样式）
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
  border-bottom: 1px solid rgba(126, 211, 33, 0.3);
  
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
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.right-section {
  flex: 1;
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

// 监测地图
.monitoring-map {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
}

.map-container {
  height: 100%;
  
  .monitoring-svg {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .monitoring-point {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      r: 8;
      filter: drop-shadow(0 0 5px currentColor);
    }
  }
}

// 热力图
.heatmap-section {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.heatmap-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.param-btn {
  padding: 6px 12px;
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  
  &:hover {
    border-color: #4A90E2;
  }
  
  &.active {
    background: rgba(74, 144, 226, 0.3);
    border-color: #4A90E2;
    color: #4A90E2;
  }
}

.heatmap-display {
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
}

// 数据卡片
.data-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.data-card {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
  }
  
  &.rice {
    border-color: rgba(126, 211, 33, 0.5);
    
    &:hover {
      border-color: #7ED321;
      box-shadow: 0 0 15px rgba(126, 211, 33, 0.3);
    }
  }
  
  &.orchard {
    border-color: rgba(245, 166, 35, 0.5);
    
    &:hover {
      border-color: #F5A623;
      box-shadow: 0 0 15px rgba(245, 166, 35, 0.3);
    }
  }
  
  &.greenhouse {
    border-color: rgba(189, 16, 224, 0.5);
    
    &:hover {
      border-color: #BD10E0;
      box-shadow: 0 0 15px rgba(189, 16, 224, 0.3);
    }
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  
  .card-icon {
    font-size: 20px;
  }
  
  .card-title {
    flex: 1;
    font-size: 14px;
    font-weight: bold;
  }
  
  .card-status {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
    
    &.normal {
      background: rgba(126, 211, 33, 0.2);
      color: #7ED321;
    }
    
    &.warning {
      background: rgba(245, 166, 35, 0.2);
      color: #F5A623;
    }
    
    &.error {
      background: rgba(208, 2, 27, 0.2);
      color: #D0021B;
    }
  }
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  
  .main-value {
    .value {
      font-size: 24px;
      font-weight: bold;
      color: #4A90E2;
    }
    
    .unit {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-left: 4px;
    }
  }
  
  .trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    
    &.up {
      color: #7ED321;
    }
    
    &.down {
      color: #D0021B;
    }
    
    &.stable {
      color: #F5A623;
    }
  }
}

.card-chart {
  height: 60px;
  background: rgba(12, 20, 38, 0.4);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 图像展示
.image-section {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
}

.image-gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.image-item {
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
  }
  
  &.active {
    border-color: #7ED321;
    box-shadow: 0 0 10px rgba(126, 211, 33, 0.3);
  }
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  
  .image-icon {
    font-size: 32px;
  }
  
  .image-label {
    font-size: 12px;
    font-weight: bold;
  }
}

.image-info {
  .capture-time {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 5px;
  }
  
  .ai-result {
    display: flex;
    align-items: center;
    gap: 5px;
    
    .ai-tag {
      padding: 2px 6px;
      background: rgba(126, 211, 33, 0.2);
      color: #7ED321;
      border-radius: 8px;
      font-size: 8px;
    }
    
    .ai-text {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.image-detail {
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  padding: 15px;
  
  h4 {
    color: #4A90E2;
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .detail-content {
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid rgba(74, 144, 226, 0.1);
      font-size: 12px;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        color: rgba(255, 255, 255, 0.6);
      }
      
      .value {
        color: #4A90E2;
        
        &.ai-highlight {
          color: #7ED321;
          font-weight: bold;
        }
      }
    }
  }
}
</style>