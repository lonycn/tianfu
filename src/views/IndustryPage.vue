<template>
  <div>
    <div class="industry-page">
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
    <UnifiedHeader current-page="industry" />

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：产业链分析 -->
      <section class="left-section">
        <!-- 产业链概览 -->
        <div class="industry-chain">
          <h2 class="section-title">产业链整合概览</h2>
          <div class="chain-visualization">
            <div class="chain-flow">
              <div class="chain-node" v-for="(node, index) in industryChain" :key="node.id">
                <div class="node-content" :class="node.type">
                  <div class="node-icon">{{ node.icon }}</div>
                  <div class="node-title">{{ node.title }}</div>
                  <div class="node-value">{{ node.value }}</div>
                  <div class="node-growth" :class="node.growth > 0 ? 'positive' : 'negative'">
                    {{ node.growth > 0 ? '+' : '' }}{{ node.growth }}%
                  </div>
                </div>
                <div class="chain-arrow" v-if="index < industryChain.length - 1">→</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 合作社发展 -->
        <div class="cooperative-development">
          <h3 class="subsection-title">合作社发展状况</h3>
          <div class="cooperative-stats">
            <div class="stat-overview">
              <div class="overview-item" v-for="item in cooperativeOverview" :key="item.label">
                <div class="item-icon">{{ item.icon }}</div>
                <div class="item-content">
                  <div class="item-value">{{ item.value }}</div>
                  <div class="item-label">{{ item.label }}</div>
                  <div class="item-trend" :class="item.trend">{{ item.trendText }}</div>
                </div>
              </div>
            </div>
            
            <div class="cooperative-chart">
              <h4 class="chart-title">合作社规模分布</h4>
              <div class="chart-container">
                <canvas ref="cooperativeChart" width="300" height="200"></canvas>
              </div>
              <div class="chart-legend">
                <div class="legend-item" v-for="item in cooperativeTypes" :key="item.type">
                  <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                  <span class="legend-label">{{ item.label }}</span>
                  <span class="legend-value">{{ item.count }}家</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右侧：经济效益分析 -->
      <section class="right-section">
        <!-- 经济指标 -->
        <div class="economic-indicators">
          <h2 class="section-title">经济效益指标</h2>
          <div class="indicators-grid">
            <div class="indicator-card" v-for="indicator in economicIndicators" :key="indicator.id">
              <div class="card-header">
                <div class="card-icon">{{ indicator.icon }}</div>
                <div class="card-title">{{ indicator.title }}</div>
                <div class="card-period">{{ indicator.period }}</div>
              </div>
              
              <div class="card-content">
                <div class="main-value">
                  <span class="value">{{ indicator.value }}</span>
                  <span class="unit">{{ indicator.unit }}</span>
                </div>
                <div class="comparison">
                  <span class="comparison-label">同比:</span>
                  <span class="comparison-value" :class="indicator.comparison > 0 ? 'positive' : 'negative'">
                    {{ indicator.comparison > 0 ? '+' : '' }}{{ indicator.comparison }}%
                  </span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${indicator.progress}%`, backgroundColor: indicator.color }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 市场分析 -->
        <div class="market-analysis">
          <h3 class="subsection-title">市场销售分析</h3>
          <div class="market-content">
            <!-- 销售渠道分布 -->
            <div class="sales-channels">
              <h4 class="analysis-subtitle">销售渠道分布</h4>
              <div class="channels-list">
                <div class="channel-item" v-for="channel in salesChannels" :key="channel.id">
                  <div class="channel-info">
                    <div class="channel-icon">{{ channel.icon }}</div>
                    <div class="channel-details">
                      <div class="channel-name">{{ channel.name }}</div>
                      <div class="channel-description">{{ channel.description }}</div>
                    </div>
                  </div>
                  <div class="channel-metrics">
                    <div class="metric">
                      <span class="metric-label">占比:</span>
                      <span class="metric-value">{{ channel.percentage }}%</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">销量:</span>
                      <span class="metric-value">{{ channel.volume }}吨</span>
                    </div>
                  </div>
                  <div class="channel-bar">
                    <div class="bar-fill" :style="{ width: `${channel.percentage}%`, backgroundColor: channel.color }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 价格趋势 -->
            <div class="price-trends">
              <h4 class="analysis-subtitle">主要产品价格趋势</h4>
              <div class="price-chart-container">
                <canvas ref="priceChart" width="400" height="180"></canvas>
              </div>
              <div class="price-summary">
                <div class="summary-item" v-for="product in priceData" :key="product.name">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="current-price">¥{{ product.currentPrice }}/{{ product.unit }}</div>
                  <div class="price-change" :class="product.change > 0 ? 'positive' : 'negative'">
                    {{ product.change > 0 ? '+' : '' }}{{ product.change }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 发展规划 -->
        <div class="development-planning">
          <h3 class="subsection-title">未来发展规划</h3>
          <div class="planning-content">
            <!-- 发展目标 -->
            <div class="development-goals">
              <div class="goal-item" v-for="goal in developmentGoals" :key="goal.id">
                <div class="goal-header">
                  <div class="goal-icon">{{ goal.icon }}</div>
                  <div class="goal-title">{{ goal.title }}</div>
                  <div class="goal-timeline">{{ goal.timeline }}</div>
                </div>
                <div class="goal-content">
                  <div class="goal-description">{{ goal.description }}</div>
                  <div class="goal-targets">
                    <div class="target-item" v-for="target in goal.targets" :key="target.metric">
                      <span class="target-metric">{{ target.metric }}:</span>
                      <span class="target-value">{{ target.value }}</span>
                    </div>
                  </div>
                </div>
                <div class="goal-progress">
                  <div class="progress-label">完成进度: {{ goal.progress }}%</div>
                  <div class="progress-track">
                    <div class="progress-bar" :style="{ width: `${goal.progress}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UnifiedHeader from '@/components/UnifiedHeader.vue'

const router = useRouter()
const cooperativeChart = ref<HTMLCanvasElement>()
const priceChart = ref<HTMLCanvasElement>()

// 产业链数据
const industryChain = ref([
  {
    id: 1,
    title: '种植生产',
    icon: '🌾',
    value: '3,247亩',
    growth: 12,
    type: 'production'
  },
  {
    id: 2,
    title: '初加工',
    icon: '🏭',
    value: '15家',
    growth: 8,
    type: 'processing'
  },
  {
    id: 3,
    title: '深加工',
    icon: '⚙️',
    value: '8家',
    growth: 25,
    type: 'manufacturing'
  },
  {
    id: 4,
    title: '品牌营销',
    icon: '🏪',
    value: '23个',
    growth: 18,
    type: 'marketing'
  },
  {
    id: 5,
    title: '终端销售',
    icon: '🛒',
    value: '156个',
    growth: 15,
    type: 'retail'
  }
])

// 合作社概览
const cooperativeOverview = ref([
  {
    icon: '🏢',
    value: '47',
    label: '合作社总数',
    trend: 'up',
    trendText: '↗ +3家'
  },
  {
    icon: '👥',
    value: '2,847',
    label: '社员总数',
    trend: 'up',
    trendText: '↗ +156人'
  },
  {
    icon: '💰',
    value: '3.2亿',
    label: '年产值',
    trend: 'up',
    trendText: '↗ +18%'
  },
  {
    icon: '📈',
    value: '15.6万',
    label: '人均收入',
    trend: 'up',
    trendText: '↗ +12%'
  }
])

// 合作社类型分布
const cooperativeTypes = ref([
  { type: 'large', label: '大型合作社', count: 12, color: '#7ED321' },
  { type: 'medium', label: '中型合作社', count: 18, color: '#4A90E2' },
  { type: 'small', label: '小型合作社', count: 17, color: '#F5A623' }
])

/* 经济指标 */
const economicIndicators = ref([
  {
    id: 1,
    title: '总产值',
    icon: '💰',
    value: '5.8',
    unit: '亿元',
    period: '2024年',
    comparison: 22,
    progress: 85,
    color: '#7ED321'
  },
  {
    id: 2,
    title: '农民收入',
    icon: '👨‍🌾',
    value: '18.5',
    unit: '万元',
    period: '人均/年',
    comparison: 15,
    progress: 78,
    color: '#4A90E2'
  },
  {
    id: 3,
    title: '出口创汇',
    icon: '🌍',
    value: '1,247',
    unit: '万美元',
    period: '2024年',
    comparison: 35,
    progress: 92,
    color: '#F5A623'
  },
  {
    id: 4,
    title: '税收贡献',
    icon: '🏛️',
    value: '3,456',
    unit: '万元',
    period: '2024年',
    comparison: 28,
    progress: 88,
    color: '#BD10E0'
  }
])

// 销售渠道
const salesChannels = ref([
  {
    id: 1,
    name: '电商平台',
    icon: '🛒',
    description: '线上销售渠道',
    percentage: 35,
    volume: 1247,
    color: '#7ED321'
  },
  {
    id: 2,
    name: '批发市场',
    icon: '🏪',
    description: '传统批发渠道',
    percentage: 28,
    volume: 998,
    color: '#4A90E2'
  },
  {
    id: 3,
    name: '超市连锁',
    icon: '🏬',
    description: '连锁超市合作',
    percentage: 22,
    volume: 784,
    color: '#F5A623'
  },
  {
    id: 4,
    name: '直销配送',
    icon: '🚚',
    description: '直接配送到户',
    percentage: 15,
    volume: 535,
    color: '#BD10E0'
  }
])

// 价格数据
const priceData = ref([
  {
    name: '优质大米',
    currentPrice: 8.5,
    unit: 'kg',
    change: 12,
    data: [7.2, 7.5, 7.8, 8.1, 8.3, 8.5]
  },
  {
    name: '有机蔬菜',
    currentPrice: 15.2,
    unit: 'kg',
    change: 8,
    data: [13.8, 14.2, 14.5, 14.8, 15.0, 15.2]
  },
  {
    name: '生态水果',
    currentPrice: 22.8,
    unit: 'kg',
    change: 15,
    data: [19.5, 20.2, 20.8, 21.5, 22.1, 22.8]
  }
])

// 发展目标
const developmentGoals = ref([
  {
    id: 1,
    title: '产业规模扩大',
    icon: '📈',
    timeline: '2025年目标',
    description: '扩大种植规模，提升产业集中度，形成规模效应',
    targets: [
      { metric: '种植面积', value: '5000亩' },
      { metric: '年产值', value: '8亿元' },
      { metric: '合作社数量', value: '60家' }
    ],
    progress: 68
  },
  {
    id: 2,
    title: '品牌价值提升',
    icon: '🏆',
    timeline: '2026年目标',
    description: '打造知名农产品品牌，提升市场竞争力和附加值',
    targets: [
      { metric: '品牌价值', value: '5亿元' },
      { metric: '市场占有率', value: '25%' },
      { metric: '品牌知名度', value: '80%' }
    ],
    progress: 45
  },
  {
    id: 3,
    title: '科技创新驱动',
    icon: '🔬',
    timeline: '2027年目标',
    description: '加强科技创新投入，推动农业现代化和智能化发展',
    targets: [
      { metric: '研发投入', value: '2000万元' },
      { metric: '专利申请', value: '50项' },
      { metric: '技术覆盖率', value: '95%' }
    ],
    progress: 32
  }
])



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

const drawCooperativeChart = () => {
  if (!cooperativeChart.value) return
  
  const ctx = cooperativeChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 300, 200)
  
  const centerX = 150
  const centerY = 100
  const radius = 70
  
  let currentAngle = -Math.PI / 2
  const total = cooperativeTypes.value.reduce((sum, type) => sum + type.count, 0)
  
  cooperativeTypes.value.forEach(type => {
    const sliceAngle = (type.count / total) * 2 * Math.PI
    
    // 绘制扇形
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = type.color
    ctx.fill()
    
    // 绘制边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.stroke()
    
    currentAngle += sliceAngle
  })
}

const drawPriceChart = () => {
  if (!priceChart.value) return
  
  const ctx = priceChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 400, 180)
  
  const colors = ['#7ED321', '#4A90E2', '#F5A623']
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  
  // 绘制网格
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = 30 + (i * 25)
    ctx.beginPath()
    ctx.moveTo(50, y)
    ctx.lineTo(370, y)
    ctx.stroke()
  }
  
  // 绘制价格线
  priceData.value.forEach((product, productIndex) => {
    ctx.beginPath()
    ctx.strokeStyle = colors[productIndex]
    ctx.lineWidth = 2
    
    product.data.forEach((price, index) => {
      const x = 50 + (index * 55)
      const y = 150 - ((price - 7) / 16) * 120
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
    
    // 绘制数据点
    product.data.forEach((price, index) => {
      const x = 50 + (index * 55)
      const y = 150 - ((price - 7) / 16) * 120
      
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = colors[productIndex]
      ctx.fill()
    })
  })
  
  // 绘制月份标签
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  months.forEach((month, index) => {
    const x = 50 + (index * 55)
    ctx.fillText(month, x, 170)
  })
}

onMounted(() => {
  setTimeout(() => {
    drawCooperativeChart()
    drawPriceChart()
  }, 100)
})

onUnmounted(() => {
  // 页面清理逻辑
})
</script>

<style scoped lang="scss">
.industry-page {
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

/* 头部 */
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

.analysis-subtitle {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #4A90E2;
}

.chart-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4A90E2;
}

/* 产业链概览 */
.industry-chain {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.chain-visualization {
  .chain-flow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  
  .chain-node {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .node-content {
      background: rgba(12, 20, 38, 0.6);
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      min-width: 100px;
      transition: all 0.3s ease;
      
      &.production {
        border: 1px solid rgba(126, 211, 33, 0.3);
        
        &:hover {
          border-color: #7ED321;
          box-shadow: 0 0 15px rgba(126, 211, 33, 0.3);
        }
      }
      
      &.processing {
        border: 1px solid rgba(74, 144, 226, 0.3);
        
        &:hover {
          border-color: #4A90E2;
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
        }
      }
      
      &.manufacturing {
        border: 1px solid rgba(245, 166, 35, 0.3);
        
        &:hover {
          border-color: #F5A623;
          box-shadow: 0 0 15px rgba(245, 166, 35, 0.3);
        }
      }
      
      &.marketing {
        border: 1px solid rgba(189, 16, 224, 0.3);
        
        &:hover {
          border-color: #BD10E0;
          box-shadow: 0 0 15px rgba(189, 16, 224, 0.3);
        }
      }
      
      &.retail {
        border: 1px solid rgba(80, 227, 194, 0.3);
        
        &:hover {
          border-color: #50E3C2;
          box-shadow: 0 0 15px rgba(80, 227, 194, 0.3);
        }
      }
      
      .node-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
      
      .node-title {
        font-size: 12px;
        color: #4A90E2;
        margin-bottom: 5px;
      }
      
      .node-value {
        font-size: 16px;
        font-weight: bold;
        color: #7ED321;
        margin-bottom: 3px;
      }
      
      .node-growth {
        font-size: 10px;
        
        &.positive {
          color: #7ED321;
        }
        
        &.negative {
          color: #FF6B6B;
        }
      }
    }
    
    .chain-arrow {
      font-size: 20px;
      color: #7ED321;
      font-weight: bold;
    }
  }
}

// 合作社发展
.cooperative-development {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
}

.cooperative-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
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
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2px;
    }
    
    .item-trend {
      font-size: 10px;
      
      &.up {
        color: #7ED321;
      }
      
      &.down {
        color: #FF6B6B;
      }
    }
  }
}

.cooperative-chart {
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
    flex-direction: column;
    gap: 8px;
    
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
        flex: 1;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .legend-value {
        color: #7ED321;
        font-weight: bold;
      }
    }
  }
}

/* 经济指标 */
.economic-indicators {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.indicators-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.indicator-card {
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
  gap: 8px;
  margin-bottom: 12px;
  
  .card-icon {
    font-size: 16px;
  }
  
  .card-title {
    flex: 1;
    font-size: 14px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .card-period {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.card-content {
  .main-value {
    margin-bottom: 8px;
    
    .value {
      font-size: 24px;
      font-weight: bold;
      color: #7ED321;
    }
    
    .unit {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-left: 3px;
    }
  }
  
  .comparison {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 12px;
    
    .comparison-label {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .comparison-value {
      font-weight: bold;
      
      &.positive {
        color: #7ED321;
      }
      
      &.negative {
        color: #FF6B6B;
      }
    }
  }
  
  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }
}

// 市场分析
.market-analysis {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.market-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sales-channels {
  .channels-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .channel-item {
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 12px;
    
    .channel-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
      
      .channel-icon {
        font-size: 16px;
      }
      
      .channel-details {
        flex: 1;
        
        .channel-name {
          font-size: 14px;
          font-weight: bold;
          color: #4A90E2;
          margin-bottom: 2px;
        }
        
        .channel-description {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
    
    .channel-metrics {
      display: flex;
      gap: 15px;
      margin-bottom: 8px;
      
      .metric {
        font-size: 11px;
        
        .metric-label {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .metric-value {
          color: #7ED321;
          font-weight: bold;
        }
      }
    }
    
    .channel-bar {
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
      
      .bar-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.3s ease;
      }
    }
  }
}

.price-trends {
  .price-chart-container {
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
  }
  
  .price-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    
    .summary-item {
      text-align: center;
      padding: 8px;
      background: rgba(12, 20, 38, 0.4);
      border-radius: 6px;
      
      .product-name {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 3px;
      }
      
      .current-price {
        font-size: 14px;
        font-weight: bold;
        color: #4A90E2;
        margin-bottom: 3px;
      }
      
      .price-change {
        font-size: 11px;
        
        &.positive {
          color: #7ED321;
        }
        
        &.negative {
          color: #FF6B6B;
        }
      }
    }
  }
}

/* 发展规划 */
.development-planning {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.development-goals {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-item {
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

.goal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  
  .goal-icon {
    font-size: 18px;
  }
  
  .goal-title {
    flex: 1;
    font-size: 16px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .goal-timeline {
    font-size: 12px;
    color: #7ED321;
    background: rgba(126, 211, 33, 0.1);
    padding: 3px 8px;
    border-radius: 4px;
  }
}

.goal-content {
  margin-bottom: 15px;
  
  .goal-description {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 10px;
    line-height: 1.4;
  }
  
  .goal-targets {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .target-item {
      background: rgba(126, 211, 33, 0.1);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 11px;
      
      .target-metric {
        color: rgba(255, 255, 255, 0.7);
      }
      
      .target-value {
        color: #7ED321;
        font-weight: bold;
      }
    }
  }
}

.goal-progress {
  .progress-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 5px;
  }
  
  .progress-track {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #7ED321, #4A90E2);
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  }
}
</style>