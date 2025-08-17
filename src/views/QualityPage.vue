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
      <!-- 顶部区域：基地概览和质量检测统计 -->
      <section class="top-section">
        <!-- 绿色认证基地概览 -->
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
        
        <!-- 质量检测统计 -->
        <div class="quality-stats">
          <h2 class="section-title">质量检测统计</h2>
          <div class="stats-content">
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
                <canvas ref="gaugeCanvas" width="120" height="120"></canvas>
                <div class="gauge-value">
                  <span class="percentage">100%</span>
                  <span class="label">合格率</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 中间区域：认证标识追踪和抽检趋势 -->
      <section class="middle-section">
        <!-- 认证标识追踪 -->
        <div class="certification-tracking">
          <h2 class="section-title">认证标识追踪</h2>
          <div class="tracking-map">
            <div class="map-container">
              <div 
                v-for="point in trackingPoints" 
                :key="point.id"
                class="tracking-point"
                :style="{ left: point.x + '%', top: point.y + '%' }"
              >
                <div class="point-marker" :style="{ backgroundColor: point.color }"></div>
                <div class="point-label">{{ point.name }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 抽检趋势图表 -->
        <div class="inspection-trends">
          <h3 class="subsection-title">月度抽检趋势</h3>
          <div class="chart-container">
            <canvas ref="trendChart" width="350" height="160"></canvas>
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
      </section>

      <!-- 底部区域：质量追溯平台 -->
      <section class="bottom-section">
        <!-- 左侧：追溯码统计和流程图 -->
        <div class="left-traceability">
          <h3 class="subsection-title">品质可追溯平台</h3>
          
          <!-- 追溯码统计 -->
          <div class="traceability-stats">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon">📱</div>
                <div class="stat-content">
                  <div class="stat-value">1,247</div>
                  <div class="stat-label">入网监管主体</div>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">🏷️</div>
                <div class="stat-content">
                  <div class="stat-value">15,632</div>
                  <div class="stat-label">生成追溯码</div>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">🔍</div>
                <div class="stat-content">
                  <div class="stat-value">12,458</div>
                  <div class="stat-label">扫码查询次数</div>
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                  <div class="stat-value">98.7%</div>
                  <div class="stat-label">追溯覆盖率</div>
                </div>
              </div>
            </div>
            
            <!-- 今日数据 -->
            <div class="today-stats">
              <div class="today-title">今日数据</div>
              <div class="today-items">
                <div class="today-item">
                  <span class="today-label">新增追溯码</span>
                  <span class="today-value">+127</span>
                </div>
                <div class="today-item">
                  <span class="today-label">查询次数</span>
                  <span class="today-value">+334</span>
                </div>
                <div class="today-item">
                  <span class="today-label">活跃用户</span>
                  <span class="today-value">+89</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 追溯流程示意图 -->
          <div class="traceability-flow">
            <div class="flow-title">追溯流程示意图</div>
            <div class="flow-diagram">
              <div class="flow-step" v-for="(step, index) in traceabilitySteps" :key="index">
                <div class="step-container">
                  <div class="step-icon" :class="step.status">{{ step.icon }}</div>
                  <div class="step-content">
                    <div class="step-title">{{ step.title }}</div>
                    <div class="step-desc">{{ step.description }}</div>
                    <div class="step-count">{{ step.count }}</div>
                  </div>
                </div>
                <div class="step-connector" v-if="index < traceabilitySteps.length - 1">
                  <div class="connector-line"></div>
                  <div class="connector-arrow">→</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：追溯码查询热力图 -->
        <div class="right-traceability">
          <h3 class="subsection-title">追溯码查询热力图</h3>
          <div class="heatmap-container">
            <canvas ref="heatmapCanvas" width="280" height="120"></canvas>
          </div>
          <div class="heatmap-legend">
            <div class="legend-item">
              <div class="legend-color low"></div>
              <span>低查询</span>
            </div>
            <div class="legend-item">
              <div class="legend-color medium"></div>
              <span>中查询</span>
            </div>
            <div class="legend-item">
              <div class="legend-color high"></div>
              <span>高查询</span>
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
const heatmapCanvas = ref<HTMLCanvasElement>()

const currentTime = ref('')

// 认证标识数据
const trackingPoints = ref([
  { id: 1, x: 15, y: 25, color: '#7ED321', name: '基地A' },
  { id: 2, x: 35, y: 45, color: '#4A90E2', name: '基地B' },
  { id: 3, x: 55, y: 65, color: '#F5A623', name: '基地C' },
  { id: 4, x: 75, y: 35, color: '#7ED321', name: '基地D' },
  { id: 5, x: 25, y: 75, color: '#4A90E2', name: '基地E' },
  { id: 6, x: 65, y: 25, color: '#F5A623', name: '基地F' },
  { id: 7, x: 85, y: 55, color: '#F5A623', name: '基地G' }
])

// 追溯流程步骤
const traceabilitySteps = ref([
  {
    icon: '🌱',
    title: '种植源头',
    description: '种子来源记录',
    count: '1,247个基地',
    status: 'active'
  },
  {
    icon: '🚜',
    title: '生产过程',
    description: '农事操作记录',
    count: '15,632条记录',
    status: 'active'
  },
  {
    icon: '🔬',
    title: '质量检测',
    description: '检测报告上传',
    count: '544份报告',
    status: 'active'
  },
  {
    icon: '📦',
    title: '包装加工',
    description: '加工环节记录',
    count: '12,458个批次',
    status: 'active'
  },
  {
    icon: '🚚',
    title: '流通销售',
    description: '物流信息追踪',
    count: '98.7%覆盖率',
    status: 'active'
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

const drawGauge = () => {
  if (!gaugeCanvas.value) return
  
  const ctx = gaugeCanvas.value.getContext('2d')
  if (!ctx) return
  
  const centerX = 60
  const centerY = 60
  const radius = 50
  const percentage = 100
  
  // 清空画布
  ctx.clearRect(0, 0, 120, 120)
  
  // 绘制背景圆弧
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(74, 144, 226, 0.2)'
  ctx.lineWidth = 6
  ctx.stroke()
  
  // 绘制进度圆弧
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * percentage / 100))
  ctx.strokeStyle = '#7ED321'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.stroke()
}

const drawTrendChart = () => {
  if (!trendChart.value) return
  
  const ctx = trendChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 350, 160)
  
  // 模拟数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  const townData = [45, 52, 48, 61, 55, 67]
  const companyData = [38, 45, 42, 58, 52, 63]
  
  const barWidth = 18
  const spacing = 30
  const startX = 30
  const maxValue = Math.max(...townData, ...companyData)
  
  // 绘制柱状图
  months.forEach((month, index) => {
    const x = startX + index * (barWidth * 2 + spacing)
    
    // 镇级抽检
    const townHeight = (townData[index] / maxValue) * 110
    ctx.fillStyle = '#7ED321'
    ctx.fillRect(x, 130 - townHeight, barWidth, townHeight)
    
    // 企业自检
    const companyHeight = (companyData[index] / maxValue) * 110
    ctx.fillStyle = '#4A90E2'
    ctx.fillRect(x + barWidth + 2, 130 - companyHeight, barWidth, companyHeight)
    
    // 月份标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(month, x + barWidth, 150)
  })
}

// 绘制追溯码查询热力图
const drawHeatmap = () => {
  if (!heatmapCanvas.value) return
  
  const ctx = heatmapCanvas.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 280, 120)
  
  // 模拟7天24小时的查询数据
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const hours = Array.from({length: 24}, (_, i) => i)
  
  const cellWidth = 280 / 24
  const cellHeight = 120 / 7
  
  days.forEach((day, dayIndex) => {
    hours.forEach((hour, hourIndex) => {
      // 模拟查询强度 (0-1)
      const intensity = Math.sin((dayIndex * 24 + hour) * 0.1) * 0.5 + 0.5 + Math.random() * 0.3
      
      // 根据强度设置颜色
      let color
      if (intensity < 0.3) {
        color = `rgba(74, 144, 226, ${intensity + 0.2})`
      } else if (intensity < 0.7) {
        color = `rgba(126, 211, 33, ${intensity})`
      } else {
        color = `rgba(255, 165, 0, ${intensity})`
      }
      
      ctx.fillStyle = color
      ctx.fillRect(hourIndex * cellWidth, dayIndex * cellHeight, cellWidth - 1, cellHeight - 1)
    })
  })
  
  // 绘制时间标签
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '9px sans-serif'
  ctx.textAlign = 'center'
  
  // 小时标签
  for (let i = 0; i < 24; i += 6) {
    ctx.fillText(`${i}:00`, i * cellWidth + cellWidth/2, 115)
  }
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  setTimeout(() => {
    drawGauge()
    drawTrendChart()
    drawHeatmap()
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

// 主要布局
.page-main {
  position: relative;
  z-index: 10;
  padding: 20px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 顶部区域
.top-section {
  display: flex;
  gap: 20px;
  height: 280px;
  
  .certification-overview {
    flex: 1;
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(126, 211, 33, 0.3);
    border-radius: 10px;
    padding: 20px;
    backdrop-filter: blur(10px);
    
    .cert-stats {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      
      .stat-card {
        flex: 1;
        background: rgba(12, 20, 38, 0.6);
        border-radius: 8px;
        padding: 15px;
        text-align: center;
        border: 1px solid rgba(126, 211, 33, 0.2);
        
        .stat-icon {
          font-size: 30px;
          margin-bottom: 10px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #7ED321;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
  
  .quality-stats {
    flex: 1;
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(74, 144, 226, 0.3);
    border-radius: 10px;
    padding: 20px;
    backdrop-filter: blur(10px);
    
    .stats-content {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      
      .stats-grid {
        flex: 2;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        
        .quality-card {
          background: rgba(12, 20, 38, 0.6);
          border-radius: 8px;
          padding: 10px;
          border: 1px solid rgba(74, 144, 226, 0.2);
          
          .card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            
            .card-icon {
              font-size: 18px;
            }
            
            .card-title {
              font-size: 12px;
              color: #4A90E2;
            }
          }
          
          .card-content {
            .main-metric {
              margin-bottom: 8px;
              
              .value {
                font-size: 20px;
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
              gap: 4px;
              
              .sub-metric {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                
                .label {
                  color: rgba(255, 255, 255, 0.7);
                }
                
                .value {
                  color: #4A90E2;
                  
                  &.success {
                    color: #7ED321;
                  }
                }
              }
            }
          }
        }
      }
      
      .compliance-gauge {
        flex: 1;
        text-align: center;
        
        .gauge-title {
          font-size: 12px;
          color: #4A90E2;
          margin-bottom: 10px;
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
              font-size: 18px;
              font-weight: bold;
              color: #7ED321;
              display: block;
            }
            
            .label {
              font-size: 10px;
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
    }
  }
}

// 中间区域
.middle-section {
  display: flex;
  gap: 20px;
  height: 260px;
  
  .certification-tracking {
    flex: 1;
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(126, 211, 33, 0.3);
    border-radius: 10px;
    padding: 20px;
    backdrop-filter: blur(10px);
    
    .tracking-map {
      margin-top: 20px;
      
      .map-container {
        width: 100%;
        height: 180px;
        background: rgba(12, 20, 38, 0.4);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        
        .tracking-point {
          position: absolute;
          
          .point-marker {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 auto;
            animation: pulse 2s infinite;
          }
          
          .point-label {
            font-size: 8px;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
            margin-top: 2px;
          }
        }
      }
    }
  }
  
  .inspection-trends {
    flex: 1;
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(74, 144, 226, 0.3);
    border-radius: 10px;
    padding: 20px;
    backdrop-filter: blur(10px);
    
    .chart-container {
      margin-top: 20px;
      background: rgba(12, 20, 38, 0.4);
      border-radius: 8px;
      padding: 10px;
      height: 180px;
      display: flex;
      justify-content: center;
      align-items: center;
      
      canvas {
        max-width: 100%;
        max-height: 100%;
      }
    }
    
    .chart-legend {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 10px;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.7);
        
        .legend-color {
          width: 10px;
          height: 10px;
          border-radius: 2px;
        }
      }
    }
  }
}

// 底部区域
.bottom-section {
  display: flex;
  gap: 20px;
  flex: 1;
  
  .left-traceability {
    flex: 2;
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(74, 144, 226, 0.3);
    border-radius: 10px;
    padding: 15px;
    backdrop-filter: blur(10px);
    overflow: hidden;
    
    .traceability-stats {
      margin-bottom: 20px;
      
      .stats-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 10px;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px;
          background: rgba(12, 20, 38, 0.6);
          border-radius: 6px;
          border: 1px solid rgba(74, 144, 226, 0.2);
          transition: all 0.3s ease;
          
          &:hover {
            border-color: #7ED321;
            box-shadow: 0 0 8px rgba(126, 211, 33, 0.3);
          }
          
          .stat-icon {
            font-size: 14px;
            filter: drop-shadow(0 1px 2px rgba(126, 211, 33, 0.3));
          }
          
          .stat-content {
            .stat-value {
              font-size: 12px;
              font-weight: bold;
              color: #4A90E2;
              margin-bottom: 2px;
            }
            
            .stat-label {
              font-size: 9px;
              color: rgba(255, 255, 255, 0.7);
            }
          }
        }
      }
      
      .today-stats {
        background: rgba(12, 20, 38, 0.4);
        border-radius: 6px;
        padding: 8px;
        border: 1px solid rgba(126, 211, 33, 0.3);
        
        .today-title {
          font-size: 11px;
          font-weight: bold;
          color: #7ED321;
          margin-bottom: 6px;
          text-align: center;
        }
        
        .today-items {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          
          .today-item {
            text-align: center;
            
            .today-label {
              display: block;
              font-size: 9px;
              color: rgba(255, 255, 255, 0.6);
              margin-bottom: 2px;
            }
            
            .today-value {
              font-size: 11px;
              font-weight: bold;
              color: #7ED321;
            }
          }
        }
      }
    }
    
    .traceability-flow {
      .flow-title {
        font-size: 12px;
        font-weight: bold;
        color: #4A90E2;
        margin-bottom: 15px;
        text-align: center;
      }
      
      .flow-diagram {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        
        .flow-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
          position: relative;
          
          .step-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            
            .step-icon {
              font-size: 20px;
              margin-bottom: 8px;
              padding: 8px;
              background: rgba(126, 211, 33, 0.2);
              border-radius: 50%;
              border: 1px solid #7ED321;
              transition: all 0.3s ease;
              
              &.active {
                background: rgba(126, 211, 33, 0.3);
                box-shadow: 0 0 10px rgba(126, 211, 33, 0.5);
              }
            }
            
            .step-content {
              .step-title {
                font-size: 10px;
                font-weight: bold;
                color: #4A90E2;
                margin-bottom: 4px;
              }
              
              .step-desc {
                font-size: 9px;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 4px;
              }
              
              .step-count {
                font-size: 8px;
                color: #7ED321;
                font-weight: bold;
              }
            }
          }
          
          .step-connector {
            position: absolute;
            width: calc(100% - 60px);
            height: 1px;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: -1;
            
            .connector-line {
              width: 100%;
              height: 1px;
              background: linear-gradient(90deg, #7ED321, rgba(126, 211, 33, 0.3));
              position: relative;
              
              &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 0;
                background: #7ED321;
                animation: flowAnimation 2s infinite;
              }
            }
            
            .connector-arrow {
              position: absolute;
              right: -6px;
              top: -4px;
              font-size: 10px;
              color: #7ED321;
              animation: pulse 2s infinite;
            }
          }
        }
      }
    }
  }
  
  .right-traceability {
    flex: 1;
    background: rgba(26, 35, 50, 0.8);
    border: 1px solid rgba(74, 144, 226, 0.3);
    border-radius: 10px;
    padding: 15px;
    backdrop-filter: blur(10px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .heatmap-container {
      background: rgba(12, 20, 38, 0.4);
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      border: 1px solid rgba(74, 144, 226, 0.2);
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      
      canvas {
        width: 100%;
        height: auto;
        max-width: 280px;
        max-height: 120px;
      }
    }
    
    .heatmap-legend {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: auto;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: rgba(255, 255, 255, 0.7);
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          
          &.low {
            background: rgba(74, 144, 226, 0.6);
          }
          
          &.medium {
            background: rgba(126, 211, 33, 0.6);
          }
          
          &.high {
            background: rgba(255, 165, 0, 0.6);
          }
        }
      }
    }
  }
}

// 通用样式
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #7ED321;
  border-left: 4px solid #7ED321;
  padding-left: 12px;
}

.subsection-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4A90E2;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes flowAnimation {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>