<template>
  <dv-full-screen-container>
    <div class="technology-page">
    <!-- 背景动画 -->
    <div class="bg-animation">
      <div 
        v-for="i in 15" 
        :key="i" 
        class="particle" 
        :style="getParticleStyle(i)"
      ></div>
    </div>
    
    <!-- 网格背景 -->
    <div class="grid-bg"></div>
    
    <!-- 页面头部 -->
    <UnifiedHeader />

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：智慧农业技术 -->
      <section class="left-section">
        <!-- 物联网设备监控 -->
        <div class="iot-monitoring">
          <h2 class="section-title">物联网设备实时监控</h2>
          <div class="device-overview">
            <div class="device-stats">
              <div class="stat-card online">
                <div class="stat-icon">📡</div>
                <div class="stat-content">
                  <div class="stat-value">{{ onlineDevices }}</div>
                  <div class="stat-label">在线设备</div>
                </div>
                <div class="stat-indicator online"></div>
              </div>
              
              <div class="stat-card offline">
                <div class="stat-icon">⚠️</div>
                <div class="stat-content">
                  <div class="stat-value">{{ offlineDevices }}</div>
                  <div class="stat-label">离线设备</div>
                </div>
                <div class="stat-indicator offline"></div>
              </div>
              
              <div class="stat-card maintenance">
                <div class="stat-icon">🔧</div>
                <div class="stat-content">
                  <div class="stat-value">{{ maintenanceDevices }}</div>
                  <div class="stat-label">维护中</div>
                </div>
                <div class="stat-indicator maintenance"></div>
              </div>
            </div>
            
            <!-- 设备分布图 -->
            <div class="device-map">
              <h3 class="map-title">设备分布图</h3>
              <div class="map-container">
                <svg viewBox="0 0 400 250" class="device-map-svg">
                  <!-- 区域划分 -->
                  <rect x="20" y="20" width="120" height="80" fill="rgba(126, 211, 33, 0.1)" stroke="#7ED321" stroke-width="1" rx="5"/>
                  <text x="80" y="45" fill="#7ED321" text-anchor="middle" font-size="12">种植区A</text>
                  
                  <rect x="160" y="20" width="120" height="80" fill="rgba(74, 144, 226, 0.1)" stroke="#4A90E2" stroke-width="1" rx="5"/>
                  <text x="220" y="45" fill="#4A90E2" text-anchor="middle" font-size="12">种植区B</text>
                  
                  <rect x="300" y="20" width="80" height="80" fill="rgba(245, 166, 35, 0.1)" stroke="#F5A623" stroke-width="1" rx="5"/>
                  <text x="340" y="45" fill="#F5A623" text-anchor="middle" font-size="12">管理区</text>
                  
                  <rect x="20" y="120" width="180" height="100" fill="rgba(189, 16, 224, 0.1)" stroke="#BD10E0" stroke-width="1" rx="5"/>
                  <text x="110" y="145" fill="#BD10E0" text-anchor="middle" font-size="12">湿地保护区</text>
                  
                  <rect x="220" y="120" width="160" height="100" fill="rgba(80, 227, 194, 0.1)" stroke="#50E3C2" stroke-width="1" rx="5"/>
                  <text x="300" y="145" fill="#50E3C2" text-anchor="middle" font-size="12">实验区</text>
                  
                  <!-- 设备点位 -->
                  <g v-for="device in deviceLocations" :key="device.id">
                    <circle 
                      :cx="device.x" 
                      :cy="device.y" 
                      r="6" 
                      :fill="device.status === 'online' ? '#7ED321' : device.status === 'offline' ? '#FF6B6B' : '#F5A623'"
                      stroke="white"
                      stroke-width="2"
                    />
                    <circle 
                      :cx="device.x" 
                      :cy="device.y" 
                      r="12" 
                      fill="none"
                      :stroke="device.status === 'online' ? '#7ED321' : device.status === 'offline' ? '#FF6B6B' : '#F5A623'"
                      stroke-width="1"
                      opacity="0.5"
                      v-if="device.status === 'online'"
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
                    
                    <!-- 设备标签 -->
                    <text 
                      :x="device.x" 
                      :y="device.y - 15" 
                      fill="white" 
                      text-anchor="middle" 
                      font-size="8"
                    >{{ device.name }}</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 智能控制系统 -->
        <div class="smart-control">
          <h3 class="subsection-title">智能控制系统</h3>
          <div class="control-panels">
            <div class="control-panel" v-for="system in controlSystems" :key="system.id">
              <div class="panel-header">
                <div class="panel-icon">{{ system.icon }}</div>
                <div class="panel-title">{{ system.name }}</div>
                <div class="panel-status" :class="system.status">{{ system.statusText }}</div>
              </div>
              
              <div class="panel-controls">
                <div class="control-item" v-for="control in system.controls" :key="control.name">
                  <div class="control-label">{{ control.label }}</div>
                  <div class="control-value">{{ control.value }}</div>
                  <div class="control-actions">
                    <button class="control-btn" @click="adjustControl(system.id, control.name, -1)">-</button>
                    <button class="control-btn" @click="adjustControl(system.id, control.name, 1)">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右侧：数字化管理系统 -->
      <section class="right-section">
        <!-- 数据分析平台 -->
        <div class="data-analytics">
          <h2 class="section-title">数据分析平台</h2>
          <div class="analytics-dashboard">
            <!-- 数据收集统计 -->
            <div class="data-collection">
              <h4 class="dashboard-subtitle">数据收集统计</h4>
              <div class="collection-stats">
                <div class="collection-item" v-for="item in dataCollection" :key="item.type">
                  <div class="item-icon">{{ item.icon }}</div>
                  <div class="item-content">
                    <div class="item-label">{{ item.label }}</div>
                    <div class="item-value">{{ item.value }}</div>
                    <div class="item-trend" :class="item.trend">{{ item.trendText }}</div>
                  </div>
                  <div class="item-chart">
                    <canvas 
                      :ref="el => dataCharts[item.type] = el" 
                      width="50" 
                      height="30"
                    ></canvas>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- AI分析结果 -->
            <div class="ai-analysis">
              <h4 class="dashboard-subtitle">AI智能分析</h4>
              <div class="analysis-results">
                <div class="analysis-card" v-for="result in aiAnalysis" :key="result.id">
                  <div class="card-header">
                    <div class="card-icon">{{ result.icon }}</div>
                    <div class="card-title">{{ result.title }}</div>
                    <div class="card-confidence" :class="getConfidenceLevel(result.confidence)">
                      {{ result.confidence }}%
                    </div>
                  </div>
                  <div class="card-content">
                    <div class="analysis-text">{{ result.analysis }}</div>
                    <div class="recommendation">{{ result.recommendation }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 数字化管理工具 -->
        <div class="digital-tools">
          <h3 class="subsection-title">数字化管理工具</h3>
          <div class="tools-grid">
            <div class="tool-card" v-for="tool in digitalTools" :key="tool.id" @click="openTool(tool.id)">
              <div class="tool-icon">{{ tool.icon }}</div>
              <div class="tool-content">
                <div class="tool-name">{{ tool.name }}</div>
                <div class="tool-description">{{ tool.description }}</div>
                <div class="tool-stats">
                  <div class="tool-stat">
                    <span class="stat-label">使用率:</span>
                    <span class="stat-value">{{ tool.usage }}%</span>
                  </div>
                  <div class="tool-stat">
                    <span class="stat-label">效率提升:</span>
                    <span class="stat-value success">+{{ tool.efficiency }}%</span>
                  </div>
                </div>
              </div>
              <div class="tool-status" :class="tool.status">{{ tool.statusText }}</div>
            </div>
          </div>
        </div>
        
        <!-- 技术创新成果 -->
        <div class="innovation-achievements">
          <h3 class="subsection-title">技术创新成果</h3>
          <div class="achievements-timeline">
            <div class="timeline-item" v-for="(achievement, index) in innovations" :key="achievement.id">
              <div class="timeline-marker">
                <div class="marker-dot"></div>
                <div class="marker-line" v-if="index < innovations.length - 1"></div>
              </div>
              <div class="timeline-content">
                <div class="achievement-date">{{ achievement.date }}</div>
                <div class="achievement-title">{{ achievement.title }}</div>
                <div class="achievement-description">{{ achievement.description }}</div>
                <div class="achievement-impact">
                  <span class="impact-label">影响指标:</span>
                  <span class="impact-value">{{ achievement.impact }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </div>
  </dv-full-screen-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UnifiedHeader from '@/components/UnifiedHeader.vue'

const router = useRouter()
const dataCharts = ref<Record<string, HTMLCanvasElement>>({})
const onlineDevices = ref(247)
const offlineDevices = ref(3)
const maintenanceDevices = ref(8)

// 设备位置数据
const deviceLocations = ref([
  { id: 1, name: 'T01', x: 60, y: 60, status: 'online' },
  { id: 2, name: 'T02', x: 100, y: 80, status: 'online' },
  { id: 3, name: 'H01', x: 180, y: 60, status: 'online' },
  { id: 4, name: 'H02', x: 240, y: 80, status: 'offline' },
  { id: 5, name: 'C01', x: 320, y: 60, status: 'maintenance' },
  { id: 6, name: 'W01', x: 80, y: 160, status: 'online' },
  { id: 7, name: 'W02', x: 140, y: 180, status: 'online' },
  { id: 8, name: 'S01', x: 260, y: 160, status: 'online' },
  { id: 9, name: 'S02', x: 320, y: 180, status: 'online' }
])

// 智能控制系统
const controlSystems = ref([
  {
    id: 1,
    name: '灌溉系统',
    icon: '💧',
    status: 'active',
    statusText: '运行中',
    controls: [
      { name: 'flow', label: '流量', value: '15L/min' },
      { name: 'pressure', label: '压力', value: '2.5bar' }
    ]
  },
  {
    id: 2,
    name: '温控系统',
    icon: '🌡️',
    status: 'active',
    statusText: '运行中',
    controls: [
      { name: 'temperature', label: '温度', value: '25°C' },
      { name: 'humidity', label: '湿度', value: '65%' }
    ]
  },
  {
    id: 3,
    name: '照明系统',
    icon: '💡',
    status: 'standby',
    statusText: '待机',
    controls: [
      { name: 'brightness', label: '亮度', value: '80%' },
      { name: 'duration', label: '时长', value: '12h' }
    ]
  }
])

// 数据收集统计
const dataCollection = ref([
  {
    type: 'sensor',
    icon: '📊',
    label: '传感器数据',
    value: '1,247,856',
    trend: 'up',
    trendText: '↗ +12%',
    data: [45, 52, 48, 61, 55, 67, 72]
  },
  {
    type: 'image',
    icon: '📷',
    label: '图像数据',
    value: '89,432',
    trend: 'up',
    trendText: '↗ +8%',
    data: [25, 28, 32, 35, 38, 42, 45]
  },
  {
    type: 'weather',
    icon: '🌤️',
    label: '气象数据',
    value: '365,789',
    trend: 'stable',
    trendText: '→ 稳定',
    data: [30, 32, 31, 33, 32, 34, 33]
  },
  {
    type: 'soil',
    icon: '🌱',
    label: '土壤数据',
    value: '156,234',
    trend: 'up',
    trendText: '↗ +15%',
    data: [18, 22, 25, 28, 32, 35, 38]
  }
])

// AI分析结果
const aiAnalysis = ref([
  {
    id: 1,
    icon: '🌾',
    title: '作物生长预测',
    confidence: 94,
    analysis: '基于当前环境数据，预计水稻将在15-18天内进入抽穗期',
    recommendation: '建议增加磷钾肥施用量，调整灌溉频次至每日2次'
  },
  {
    id: 2,
    icon: '🦠',
    title: '病虫害风险评估',
    confidence: 87,
    analysis: '检测到稻飞虱活动增加，未来7天内爆发风险较高',
    recommendation: '建议启动生物防治措施，释放天敌昆虫进行防控'
  },
  {
    id: 3,
    icon: '💧',
    title: '水资源优化',
    confidence: 91,
    analysis: '当前土壤含水量适中，可减少20%灌溉用水',
    recommendation: '调整灌溉计划，采用精准滴灌技术提高水资源利用效率'
  }
])

// 数字化工具
const digitalTools = ref([
  {
    id: 1,
    name: '智能决策系统',
    icon: '🧠',
    description: '基于AI的农业决策支持',
    usage: 95,
    efficiency: 35,
    status: 'active',
    statusText: '运行中'
  },
  {
    id: 2,
    name: '无人机巡检',
    icon: '🚁',
    description: '自动化农田巡检监测',
    usage: 78,
    efficiency: 60,
    status: 'active',
    statusText: '运行中'
  },
  {
    id: 3,
    name: '区块链溯源',
    icon: '🔗',
    description: '农产品全链条追溯',
    usage: 82,
    efficiency: 45,
    status: 'active',
    statusText: '运行中'
  },
  {
    id: 4,
    name: '大数据分析',
    icon: '📈',
    description: '多维度数据深度分析',
    usage: 88,
    efficiency: 50,
    status: 'active',
    statusText: '运行中'
  }
])

// 技术创新成果
const innovations = ref([
  {
    id: 1,
    date: '2024-01',
    title: '智能水肥一体化系统',
    description: '开发了基于物联网的精准水肥管理系统，实现自动化灌溉和施肥',
    impact: '节水30%，增产15%'
  },
  {
    id: 2,
    date: '2024-03',
    title: 'AI病虫害识别技术',
    description: '运用深度学习技术，实现病虫害的早期识别和预警',
    impact: '识别准确率95%，减少农药使用25%'
  },
  {
    id: 3,
    date: '2024-06',
    title: '无人机植保技术',
    description: '引入无人机植保技术，提高作业效率和精准度',
    impact: '作业效率提升80%，农药利用率提高40%'
  },
  {
    id: 4,
    date: '2024-09',
    title: '数字孪生农场',
    description: '构建农场数字孪生模型，实现虚拟仿真和优化决策',
    impact: '决策准确率提升45%，运营成本降低20%'
  }
])



const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const left = Math.random() * 100
  const animationDuration = Math.random() * 6 + 5
  const animationDelay = Math.random() * 4
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

const getConfidenceLevel = (confidence: number) => {
  if (confidence >= 90) return 'high'
  if (confidence >= 70) return 'medium'
  return 'low'
}

const adjustControl = (systemId: number, controlName: string, delta: number) => {
  // 模拟控制调整
  console.log(`调整系统 ${systemId} 的 ${controlName}，变化量: ${delta}`)
}

const openTool = (toolId: number) => {
  // 模拟打开工具
  console.log(`打开工具: ${toolId}`)
}

const drawMiniChart = (canvas: HTMLCanvasElement, data: number[]) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 50, 30)
  
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  
  const stepX = 45 / (data.length - 1)
  
  ctx.beginPath()
  data.forEach((value, index) => {
    const x = 2 + index * stepX
    const y = 25 - ((value - minValue) / range) * 20
    
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
    const x = 2 + index * stepX
    const y = 25 - ((value - minValue) / range) * 20
    
    ctx.beginPath()
    ctx.arc(x, y, 1.5, 0, 2 * Math.PI)
    ctx.fillStyle = '#7ED321'
    ctx.fill()
  })
}

onMounted(() => {
  setTimeout(() => {
    // 绘制数据收集图表
    dataCollection.value.forEach(item => {
      const canvas = dataCharts.value[item.type]
      if (canvas) {
        drawMiniChart(canvas, item.data)
      }
    })
  }, 100)
})

onUnmounted(() => {
  // 页面清理逻辑
})
</script>

<style scoped lang="scss">
.technology-page {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, #0c1426 0%, #1a2332 50%, #0c1426 100%);
  color: #ffffff;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

// 头部样式现在由UnifiedHeader组件处理

/* 背景动画 */
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



/* 主内容 */
.page-main {
  position: relative;
  z-index: 10;
  display: flex;
  padding: 20px;
  gap: 20px;
  flex: 1;
  overflow: hidden;
  
  @media (min-width: 768px) {
    padding: 30px 40px;
    gap: 30px;
  }
  
  @media (max-width: 767px) {
     flex-direction: column;
     overflow-y: auto;
   }
 }

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow-y: auto;
}

.right-section {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow-y: auto;
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

.dashboard-subtitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #4A90E2;
}

/* 物联网设备监控 */
.iot-monitoring {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.device-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.device-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: rgba(12, 20, 38, 0.6);
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
  
  &.online {
    border: 1px solid rgba(126, 211, 33, 0.3);
    
    &:hover {
      border-color: #7ED321;
      box-shadow: 0 0 15px rgba(126, 211, 33, 0.3);
    }
  }
  
  &.offline {
    border: 1px solid rgba(255, 107, 107, 0.3);
    
    &:hover {
      border-color: #FF6B6B;
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
    }
  }
  
  &.maintenance {
    border: 1px solid rgba(245, 166, 35, 0.3);
    
    &:hover {
      border-color: #F5A623;
      box-shadow: 0 0 15px rgba(245, 166, 35, 0.3);
    }
  }
  
  .stat-icon {
    font-size: 24px;
  }
  
  .stat-content {
    flex: 1;
    
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
  
  .stat-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    
    &.online {
      background: #7ED321;
      box-shadow: 0 0 8px rgba(126, 211, 33, 0.6);
    }
    
    &.offline {
      background: #FF6B6B;
      box-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
    }
    
    &.maintenance {
      background: #F5A623;
      box-shadow: 0 0 8px rgba(245, 166, 35, 0.6);
    }
  }
}

.device-map {
  .map-title {
    font-size: 14px;
    color: #4A90E2;
    margin-bottom: 10px;
  }
  
  .map-container {
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 15px;
    
    .device-map-svg {
      width: 100%;
      height: 250px;
    }
  }
}

// 智能控制系统
.smart-control {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.control-panels {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-panel {
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

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  
  .panel-icon {
    font-size: 18px;
  }
  
  .panel-title {
    flex: 1;
    font-size: 14px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .panel-status {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    
    &.active {
      background: rgba(126, 211, 33, 0.2);
      color: #7ED321;
    }
    
    &.standby {
      background: rgba(245, 166, 35, 0.2);
      color: #F5A623;
    }
  }
}

.panel-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .control-label {
    width: 60px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .control-value {
    flex: 1;
    font-size: 14px;
    font-weight: bold;
    color: #7ED321;
  }
  
  .control-actions {
    display: flex;
    gap: 5px;
    
    .control-btn {
      width: 24px;
      height: 24px;
      border: 1px solid rgba(74, 144, 226, 0.3);
      background: rgba(74, 144, 226, 0.1);
      color: #4A90E2;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #4A90E2;
        background: rgba(74, 144, 226, 0.2);
      }
    }
  }
}

// 数据分析平台
.data-analytics {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.analytics-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-collection {
  .collection-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .collection-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    
    .item-icon {
      font-size: 18px;
    }
    
    .item-content {
      flex: 1;
      
      .item-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 2px;
      }
      
      .item-value {
        font-size: 16px;
        font-weight: bold;
        color: #4A90E2;
        margin-bottom: 2px;
      }
      
      .item-trend {
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
    
    .item-chart {
      width: 50px;
      height: 30px;
    }
  }
}

.ai-analysis {
  .analysis-results {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .analysis-card {
    background: rgba(12, 20, 38, 0.4);
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
    margin-bottom: 10px;
    
    .card-icon {
      font-size: 16px;
    }
    
    .card-title {
      flex: 1;
      font-size: 14px;
      font-weight: bold;
      color: #4A90E2;
    }
    
    .card-confidence {
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
      
      &.high {
        background: rgba(126, 211, 33, 0.2);
        color: #7ED321;
      }
      
      &.medium {
        background: rgba(245, 166, 35, 0.2);
        color: #F5A623;
      }
      
      &.low {
        background: rgba(255, 107, 107, 0.2);
        color: #FF6B6B;
      }
    }
  }
  
  .card-content {
    .analysis-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 8px;
      line-height: 1.4;
    }
    
    .recommendation {
      font-size: 11px;
      color: #7ED321;
      background: rgba(126, 211, 33, 0.1);
      padding: 6px 8px;
      border-radius: 4px;
      border-left: 3px solid #7ED321;
    }
  }
}

// 数字化工具
.digital-tools {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.tool-card {
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
    transform: translateY(-2px);
  }
  
  .tool-icon {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .tool-content {
    .tool-name {
      font-size: 14px;
      font-weight: bold;
      color: #4A90E2;
      margin-bottom: 5px;
    }
    
    .tool-description {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 10px;
      line-height: 1.3;
    }
    
    .tool-stats {
      display: flex;
      flex-direction: column;
      gap: 3px;
      
      .tool-stat {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        
        .stat-label {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .stat-value {
          font-weight: bold;
          
          &.success {
            color: #7ED321;
          }
        }
      }
    }
  }
  
  .tool-status {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: bold;
    
    &.active {
      background: rgba(126, 211, 33, 0.2);
      color: #7ED321;
    }
  }
}

// 技术创新成果
.innovation-achievements {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.achievements-timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: relative;
  
  .marker-dot {
    width: 12px;
    height: 12px;
    background: #7ED321;
    border-radius: 50%;
    border: 2px solid rgba(126, 211, 33, 0.3);
  }
  
  .marker-line {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 30px;
    background: rgba(126, 211, 33, 0.3);
  }
}

.timeline-content {
  flex: 1;
  
  .achievement-date {
    font-size: 12px;
    color: #4A90E2;
    margin-bottom: 5px;
  }
  
  .achievement-title {
    font-size: 14px;
    font-weight: bold;
    color: #7ED321;
    margin-bottom: 5px;
  }
  
  .achievement-description {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .achievement-impact {
    font-size: 11px;
    
    .impact-label {
      color: rgba(255, 255, 255, 0.6);
    }
    
    .impact-value {
      color: #7ED321;
      font-weight: bold;
    }
  }
}
</style>