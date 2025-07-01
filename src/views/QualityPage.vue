<template>
  <div class="quality-page">
    <!-- 背景动画 -->
    <div class="bg-animation">
      <div 
        v-for="i in 10" 
        :key="i" 
        class="particle" 
        :style="getParticleStyle(i)"
      ></div>
    </div>
    
    <!-- 网格背景 -->
    <div class="grid-bg"></div>
    
    <!-- 页面头部 -->
    <UnifiedHeader current-page="quality" />

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：绿色认证概览 -->
      <section class="left-section">
        <!-- 认证基地统计 -->
        <div class="certification-overview">
          <h2 class="section-title">绿色认证基地概览</h2>
          <div class="cert-stats">
            <div class="stat-card primary">
              <div class="stat-icon">🌾</div>
              <div class="stat-content">
                <div class="stat-value">3,000</div>
                <div class="stat-label">绿色大米基地(亩)</div>
              </div>
            </div>
            
            <div class="stat-card secondary">
              <div class="stat-icon">🥬</div>
              <div class="stat-content">
                <div class="stat-value">340</div>
                <div class="stat-label">有机蔬菜基地(亩)</div>
              </div>
            </div>
            
            <div class="stat-card tertiary">
              <div class="stat-icon">🍎</div>
              <div class="stat-content">
                <div class="stat-value">4,031</div>
                <div class="stat-label">绿色果园基地(亩)</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 认证地图分布 -->
        <div class="certification-map">
          <h3 class="subsection-title">认证基地分布图</h3>
          <div class="map-container">
            <svg viewBox="0 0 500 350" class="cert-map-svg">
              <!-- 背景区域 -->
              <rect x="0" y="0" width="500" height="350" fill="#0c1426" stroke="#7ED321" stroke-width="1" opacity="0.3"/>
              
              <!-- 绿色大米基地 -->
              <rect x="50" y="50" width="180" height="100" fill="#7ED321" opacity="0.4" rx="5"/>
              <text x="140" y="75" fill="#7ED321" text-anchor="middle" font-size="12">绿色大米基地</text>
              <text x="140" y="90" fill="#7ED321" text-anchor="middle" font-size="10">3000亩</text>
              
              <!-- 有机蔬菜基地 -->
              <rect x="270" y="50" width="180" height="100" fill="#4A90E2" opacity="0.4" rx="5"/>
              <text x="360" y="75" fill="#4A90E2" text-anchor="middle" font-size="12">有机蔬菜基地</text>
              <text x="360" y="90" fill="#4A90E2" text-anchor="middle" font-size="10">340亩</text>
              
              <!-- 绿色果园基地 -->
              <rect x="160" y="180" width="180" height="120" fill="#F5A623" opacity="0.4" rx="5"/>
              <text x="250" y="205" fill="#F5A623" text-anchor="middle" font-size="12">绿色果园基地</text>
              <text x="250" y="220" fill="#F5A623" text-anchor="middle" font-size="10">4031亩</text>
              
              <!-- 认证标识 -->
              <g v-for="cert in certificationMarkers" :key="cert.id">
                <circle 
                  :cx="cert.x" 
                  :cy="cert.y" 
                  r="8" 
                  :fill="cert.color"
                  stroke="white"
                  stroke-width="2"
                />
                <text 
                  :x="cert.x" 
                  :y="cert.y + 3" 
                  fill="white" 
                  text-anchor="middle" 
                  font-size="8"
                  font-weight="bold"
                >✓</text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      <!-- 右侧：质量监管数据 -->
      <section class="right-section">
        <!-- 质量检测统计 -->
        <div class="quality-stats">
          <h2 class="section-title">质量检测统计</h2>
          <div class="stats-grid">
            <div class="quality-card">
              <div class="card-header">
                <div class="card-icon">🏛️</div>
                <div class="card-title">镇级抽检</div>
              </div>
              <div class="card-content">
                <div class="main-metric">
                  <span class="value">265</span>
                  <span class="unit">批次</span>
                </div>
                <div class="sub-metrics">
                  <div class="sub-metric">
                    <span class="label">合格率</span>
                    <span class="value success">100%</span>
                  </div>
                  <div class="sub-metric">
                    <span class="label">本月新增</span>
                    <span class="value">23批次</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="quality-card">
              <div class="card-header">
                <div class="card-icon">🏢</div>
                <div class="card-title">企业自检</div>
              </div>
              <div class="card-content">
                <div class="main-metric">
                  <span class="value">279</span>
                  <span class="unit">批次</span>
                </div>
                <div class="sub-metrics">
                  <div class="sub-metric">
                    <span class="label">合格率</span>
                    <span class="value success">100%</span>
                  </div>
                  <div class="sub-metric">
                    <span class="label">本月新增</span>
                    <span class="value">31批次</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 合格率仪表盘 -->
          <div class="compliance-gauge">
            <h3 class="gauge-title">综合合格率</h3>
            <div class="gauge-container">
              <canvas ref="gaugeCanvas" width="200" height="200"></canvas>
              <div class="gauge-value">
                <span class="percentage">100%</span>
                <span class="label">合格率</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 抽检趋势图表 -->
        <div class="inspection-trends">
          <h3 class="subsection-title">月度抽检趋势</h3>
          <div class="chart-container">
            <canvas ref="trendChart" width="400" height="200"></canvas>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color" style="background: #7ED321;"></div>
              <span>镇级抽检</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #4A90E2;"></div>
              <span>企业自检</span>
            </div>
          </div>
        </div>
        
        <!-- 质量追溯平台 -->
        <div class="traceability-platform">
          <h3 class="subsection-title">品质可追溯平台</h3>
          <div class="platform-stats">
            <div class="platform-item">
              <div class="item-icon">📱</div>
              <div class="item-content">
                <div class="item-value">1,247</div>
                <div class="item-label">入网监管主体</div>
              </div>
            </div>
            
            <div class="platform-item">
              <div class="item-icon">🔍</div>
              <div class="item-content">
                <div class="item-value">15,632</div>
                <div class="item-label">产品追溯码</div>
              </div>
            </div>
            
            <div class="platform-item">
              <div class="item-icon">📊</div>
              <div class="item-content">
                <div class="item-value">98.7%</div>
                <div class="item-label">追溯覆盖率</div>
              </div>
            </div>
          </div>
          
          <!-- 追溯流程 -->
          <div class="traceability-flow">
            <div class="flow-step" v-for="(step, index) in traceabilitySteps" :key="index">
              <div class="step-icon">{{ step.icon }}</div>
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.description }}</div>
              <div class="step-connector" v-if="index < traceabilitySteps.length - 1">→</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UnifiedHeader from '@/components/UnifiedHeader.vue'

const router = useRouter()
const gaugeCanvas = ref<HTMLCanvasElement>()
const trendChart = ref<HTMLCanvasElement>()

const currentTime = ref('')

// 认证标识数据
const certificationMarkers = ref([
  { id: 1, x: 100, y: 100, color: '#7ED321' },
  { id: 2, x: 180, y: 120, color: '#7ED321' },
  { id: 3, x: 320, y: 100, color: '#4A90E2' },
  { id: 4, x: 400, y: 120, color: '#4A90E2' },
  { id: 5, x: 200, y: 230, color: '#F5A623' },
  { id: 6, x: 280, y: 250, color: '#F5A623' },
  { id: 7, x: 320, y: 270, color: '#F5A623' }
])

// 追溯流程步骤
const traceabilitySteps = ref([
  {
    icon: '🌱',
    title: '种植源头',
    description: '种子来源记录'
  },
  {
    icon: '🚜',
    title: '生产过程',
    description: '农事操作记录'
  },
  {
    icon: '🔬',
    title: '质量检测',
    description: '检测报告上传'
  },
  {
    icon: '📦',
    title: '包装加工',
    description: '加工环节记录'
  },
  {
    icon: '🚚',
    title: '流通销售',
    description: '物流信息追踪'
  }
])

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

const drawGauge = () => {
  if (!gaugeCanvas.value) return
  
  const ctx = gaugeCanvas.value.getContext('2d')
  if (!ctx) return
  
  const centerX = 100
  const centerY = 100
  const radius = 80
  const percentage = 100
  
  // 清空画布
  ctx.clearRect(0, 0, 200, 200)
  
  // 绘制背景圆弧
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.2)'
  ctx.lineWidth = 10
  ctx.stroke()
  
  // 绘制进度圆弧
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * percentage / 100))
  ctx.strokeStyle = '#7ED321'
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.stroke()
}

const drawTrendChart = () => {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 400, 200)
  
  // 模拟数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const townData = [45, 52, 48, 61, 55, 67]
  const companyData = [38, 45, 42, 58, 52, 63]
  
  const barWidth = 25
  const spacing = 40
  const startX = 50
  const maxValue = Math.max(...townData, ...companyData)
  
  // 绘制柱状图
  months.forEach((month, index) => {
    const x = startX + index * (barWidth * 2 + spacing)
    
    // 镇级抽检
    const townHeight = (townData[index] / maxValue) * 150
    ctx.fillStyle = '#7ED321'
    ctx.fillRect(x, 180 - townHeight, barWidth, townHeight)
    
    // 企业自检
    const companyHeight = (companyData[index] / maxValue) * 150
    ctx.fillStyle = '#4A90E2'
    ctx.fillRect(x + barWidth + 5, 180 - companyHeight, barWidth, companyHeight)
    
    // 月份标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(month, x + barWidth, 195)
  })
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  setTimeout(() => {
    drawGauge()
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
.quality-page {
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

// 认证概览
.certification-overview {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.cert-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &.primary {
    background: rgba(126, 211, 33, 0.1);
    border: 1px solid rgba(126, 211, 33, 0.3);
    
    &:hover {
      border-color: #7ED321;
      box-shadow: 0 0 15px rgba(126, 211, 33, 0.3);
    }
  }
  
  &.secondary {
    background: rgba(74, 144, 226, 0.1);
    border: 1px solid rgba(74, 144, 226, 0.3);
    
    &:hover {
      border-color: #4A90E2;
      box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
    }
  }
  
  &.tertiary {
    background: rgba(245, 166, 35, 0.1);
    border: 1px solid rgba(245, 166, 35, 0.3);
    
    &:hover {
      border-color: #F5A623;
      box-shadow: 0 0 15px rgba(245, 166, 35, 0.3);
    }
  }
  
  .stat-icon {
    font-size: 32px;
  }
  
  .stat-content {
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #4A90E2;
    }
    
    .stat-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

// 认证地图
.certification-map {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
}

.map-container {
  height: 100%;
  
  .cert-map-svg {
    width: 100%;
    height: 100%;
  }
}

// 质量统计
.quality-stats {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.quality-card {
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  
  .card-icon {
    font-size: 20px;
  }
  
  .card-title {
    font-size: 14px;
    font-weight: bold;
    color: #4A90E2;
  }
}

.card-content {
  .main-metric {
    margin-bottom: 15px;
    
    .value {
      font-size: 28px;
      font-weight: bold;
      color: #7ED321;
    }
    
    .unit {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-left: 5px;
    }
  }
  
  .sub-metrics {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .sub-metric {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    
    .label {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .value {
      color: #4A90E2;
      font-weight: bold;
      
      &.success {
        color: #7ED321;
      }
    }
  }
}

// 合格率仪表盘
.compliance-gauge {
  text-align: center;
  
  .gauge-title {
    font-size: 16px;
    color: #7ED321;
    margin-bottom: 15px;
  }
  
  .gauge-container {
    position: relative;
    display: inline-block;
    
    .gauge-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      
      .percentage {
        display: block;
        font-size: 24px;
        font-weight: bold;
        color: #7ED321;
      }
      
      .label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

// 抽检趋势
.inspection-trends {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.chart-container {
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  
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
  }
}

// 追溯平台
.traceability-platform {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.platform-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  
  .item-icon {
    font-size: 20px;
  }
  
  .item-content {
    .item-value {
      font-size: 18px;
      font-weight: bold;
      color: #4A90E2;
    }
    
    .item-label {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

.traceability-flow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  position: relative;
  
  .step-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .step-title {
    font-size: 12px;
    font-weight: bold;
    color: #4A90E2;
    margin-bottom: 4px;
  }
  
  .step-desc {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .step-connector {
    position: absolute;
    right: -15px;
    top: 12px;
    font-size: 16px;
    color: #7ED321;
  }
}
</style>