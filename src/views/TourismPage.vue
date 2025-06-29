<template>
  <dv-full-screen-container>
    <div class="tourism-page">
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
    <UnifiedHeader />

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：旅游资源展示 -->
      <section class="left-section">
        <!-- 景点概览 -->
        <div class="attractions-overview">
          <h2 class="section-title">旅游景点概览</h2>
          <div class="attractions-grid">
            <div class="attraction-card" v-for="attraction in attractions" :key="attraction.id" @click="selectAttraction(attraction.id)">
              <div class="card-image">
                <div class="image-placeholder" :style="{ backgroundColor: attraction.color }">
                  <span class="image-icon">{{ attraction.icon }}</span>
                </div>
                <div class="card-badge" :class="attraction.type">{{ attraction.typeLabel }}</div>
              </div>
              
              <div class="card-content">
                <h3 class="attraction-name">{{ attraction.name }}</h3>
                <p class="attraction-description">{{ attraction.description }}</p>
                
                <div class="attraction-stats">
                  <div class="stat-item">
                    <span class="stat-icon">👥</span>
                    <span class="stat-value">{{ attraction.visitors }}</span>
                    <span class="stat-label">年访客量</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">{{ attraction.rating }}</span>
                    <span class="stat-label">评分</span>
                  </div>
                </div>
                
                <div class="attraction-features">
                  <span class="feature-tag" v-for="feature in attraction.features" :key="feature">
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 旅游路线 -->
        <div class="tourism-routes">
          <h3 class="subsection-title">精品旅游路线</h3>
          <div class="routes-container">
            <div class="route-tabs">
              <div 
                class="route-tab" 
                v-for="route in tourismRoutes" 
                :key="route.id"
                :class="{ active: selectedRoute === route.id }"
                @click="selectRoute(route.id)"
              >
                <span class="tab-icon">{{ route.icon }}</span>
                <span class="tab-name">{{ route.name }}</span>
                <span class="tab-duration">{{ route.duration }}</span>
              </div>
            </div>
            
            <div class="route-details" v-if="currentRoute">
              <div class="route-header">
                <h4 class="route-title">{{ currentRoute.name }}</h4>
                <div class="route-info">
                  <span class="info-item">
                    <span class="info-icon">🕒</span>
                    <span>{{ currentRoute.duration }}</span>
                  </span>
                  <span class="info-item">
                    <span class="info-icon">💰</span>
                    <span>{{ currentRoute.price }}</span>
                  </span>
                  <span class="info-item">
                    <span class="info-icon">🚌</span>
                    <span>{{ currentRoute.transport }}</span>
                  </span>
                </div>
              </div>
              
              <div class="route-stops">
                <div class="stop-item" v-for="(stop, index) in currentRoute.stops" :key="index">
                  <div class="stop-number">{{ index + 1 }}</div>
                  <div class="stop-content">
                    <div class="stop-name">{{ stop.name }}</div>
                    <div class="stop-time">{{ stop.time }}</div>
                    <div class="stop-description">{{ stop.description }}</div>
                  </div>
                  <div class="stop-connector" v-if="index < currentRoute.stops.length - 1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右侧：文化传承与数据分析 -->
      <section class="right-section">
        <!-- 文化传承 -->
        <div class="cultural-heritage">
          <h2 class="section-title">文化传承保护</h2>
          <div class="heritage-content">
            <!-- 非遗项目 -->
            <div class="heritage-projects">
              <h4 class="heritage-subtitle">非物质文化遗产</h4>
              <div class="projects-grid">
                <div class="project-card" v-for="project in heritageProjects" :key="project.id">
                  <div class="project-header">
                    <div class="project-icon">{{ project.icon }}</div>
                    <div class="project-info">
                      <div class="project-name">{{ project.name }}</div>
                      <div class="project-level">{{ project.level }}</div>
                    </div>
                    <div class="project-status" :class="project.status">{{ project.statusText }}</div>
                  </div>
                  
                  <div class="project-content">
                    <div class="project-description">{{ project.description }}</div>
                    <div class="project-metrics">
                      <div class="metric">
                        <span class="metric-label">传承人:</span>
                        <span class="metric-value">{{ project.inheritors }}人</span>
                      </div>
                      <div class="metric">
                        <span class="metric-label">保护投入:</span>
                        <span class="metric-value">{{ project.investment }}万元</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 文化活动 -->
            <div class="cultural-activities">
              <h4 class="heritage-subtitle">文化活动与节庆</h4>
              <div class="activities-timeline">
                <div class="activity-item" v-for="activity in culturalActivities" :key="activity.id">
                  <div class="activity-date">
                    <div class="date-month">{{ activity.month }}</div>
                    <div class="date-day">{{ activity.day }}</div>
                  </div>
                  <div class="activity-content">
                    <div class="activity-name">{{ activity.name }}</div>
                    <div class="activity-description">{{ activity.description }}</div>
                    <div class="activity-stats">
                      <span class="stat">参与人数: {{ activity.participants }}人</span>
                      <span class="stat">经济效益: {{ activity.revenue }}万元</span>
                    </div>
                  </div>
                  <div class="activity-status" :class="activity.status">{{ activity.statusText }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 旅游数据分析 -->
        <div class="tourism-analytics">
          <h3 class="subsection-title">旅游数据分析</h3>
          <div class="analytics-content">
            <!-- 游客统计 -->
            <div class="visitor-statistics">
              <h4 class="analytics-subtitle">游客流量统计</h4>
              <div class="statistics-overview">
                <div class="stat-card" v-for="stat in visitorStats" :key="stat.id">
                  <div class="stat-icon">{{ stat.icon }}</div>
                  <div class="stat-content">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-trend" :class="stat.trend">{{ stat.trendText }}</div>
                  </div>
                </div>
              </div>
              
              <div class="visitor-chart">
                <h5 class="chart-title">月度游客流量趋势</h5>
                <div class="chart-container">
                  <canvas ref="visitorChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            
            <!-- 收入分析 -->
            <div class="revenue-analysis">
              <h4 class="analytics-subtitle">旅游收入分析</h4>
              <div class="revenue-breakdown">
                <div class="breakdown-chart">
                  <canvas ref="revenueChart" width="250" height="200"></canvas>
                </div>
                <div class="breakdown-details">
                  <div class="detail-item" v-for="item in revenueBreakdown" :key="item.category">
                    <div class="detail-color" :style="{ backgroundColor: item.color }"></div>
                    <div class="detail-content">
                      <div class="detail-category">{{ item.category }}</div>
                      <div class="detail-amount">{{ item.amount }}万元</div>
                      <div class="detail-percentage">{{ item.percentage }}%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="revenue-summary">
                <div class="summary-item">
                  <span class="summary-label">总收入:</span>
                  <span class="summary-value">{{ totalRevenue }}万元</span>
                  <span class="summary-growth positive">+{{ revenueGrowth }}%</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">人均消费:</span>
                  <span class="summary-value">{{ avgSpending }}元</span>
                  <span class="summary-growth positive">+{{ spendingGrowth }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 发展规划 -->
        <div class="development-planning">
          <h3 class="subsection-title">发展规划与展望</h3>
          <div class="planning-content">
            <div class="planning-goals">
              <div class="goal-item" v-for="goal in developmentGoals" :key="goal.id">
                <div class="goal-header">
                  <div class="goal-icon">{{ goal.icon }}</div>
                  <div class="goal-title">{{ goal.title }}</div>
                  <div class="goal-timeline">{{ goal.timeline }}</div>
                </div>
                <div class="goal-description">{{ goal.description }}</div>
                <div class="goal-targets">
                  <div class="target" v-for="target in goal.targets" :key="target.metric">
                    <span class="target-metric">{{ target.metric }}:</span>
                    <span class="target-value">{{ target.value }}</span>
                  </div>
                </div>
                <div class="goal-progress">
                  <div class="progress-label">进度: {{ goal.progress }}%</div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${goal.progress}%` }"></div>
                  </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import UnifiedHeader from '@/components/UnifiedHeader.vue'

const router = useRouter()
const visitorChart = ref<HTMLCanvasElement>()
const revenueChart = ref<HTMLCanvasElement>()
const selectedRoute = ref(1)

// 旅游景点数据
const attractions = ref([
  {
    id: 1,
    name: '湿地生态园',
    description: '原生态湿地景观，观鸟赏花的绝佳去处',
    icon: '🦆',
    color: '#7ED321',
    type: 'nature',
    typeLabel: '自然景观',
    visitors: '12.5万',
    rating: '4.8',
    features: ['观鸟', '摄影', '科普']
  },
  {
    id: 2,
    name: '农耕文化园',
    description: '体验传统农耕文化，感受田园生活',
    icon: '🌾',
    color: '#F5A623',
    type: 'culture',
    typeLabel: '文化体验',
    visitors: '8.3万',
    rating: '4.6',
    features: ['农耕体验', '民俗表演', '手工制作']
  },
  {
    id: 3,
    name: '生态采摘园',
    description: '四季果蔬采摘，绿色有机农产品',
    icon: '🍎',
    color: '#4A90E2',
    type: 'recreation',
    typeLabel: '休闲娱乐',
    visitors: '15.7万',
    rating: '4.7',
    features: ['采摘', '品尝', '购买']
  },
  {
    id: 4,
    name: '民宿度假村',
    description: '田园风光民宿，享受宁静乡村时光',
    icon: '🏡',
    color: '#BD10E0',
    type: 'accommodation',
    typeLabel: '住宿服务',
    visitors: '6.2万',
    rating: '4.9',
    features: ['住宿', '餐饮', '会议']
  }
])

// 旅游路线数据
const tourismRoutes = ref([
  {
    id: 1,
    name: '生态观光一日游',
    icon: '🌿',
    duration: '1天',
    price: '168元/人',
    transport: '旅游巴士',
    stops: [
      { name: '湿地生态园', time: '09:00-11:00', description: '观鸟赏花，生态科普' },
      { name: '农耕文化园', time: '11:30-14:00', description: '农耕体验，传统午餐' },
      { name: '生态采摘园', time: '14:30-16:30', description: '果蔬采摘，品尝购买' },
      { name: '返程', time: '17:00', description: '满载而归，结束愉快旅程' }
    ]
  },
  {
    id: 2,
    name: '文化深度二日游',
    icon: '🎭',
    duration: '2天1夜',
    price: '398元/人',
    transport: '专车接送',
    stops: [
      { name: '农耕文化园', time: '第一天 09:00-12:00', description: '深度体验农耕文化' },
      { name: '民俗表演', time: '第一天 14:00-16:00', description: '观看传统民俗表演' },
      { name: '民宿入住', time: '第一天 18:00', description: '入住特色民宿，品尝农家菜' },
      { name: '湿地晨观', time: '第二天 06:00-08:00', description: '湿地晨景，鸟类观察' },
      { name: '手工体验', time: '第二天 09:00-11:00', description: '传统手工艺制作' },
      { name: '采摘购物', time: '第二天 14:00-16:00', description: '采摘购买特产' }
    ]
  },
  {
    id: 3,
    name: '亲子研学三日游',
    icon: '👨‍👩‍👧‍👦',
    duration: '3天2夜',
    price: '588元/人',
    transport: '研学专车',
    stops: [
      { name: '生态科普', time: '第一天', description: '湿地生态系统学习' },
      { name: '农业实践', time: '第二天', description: '农作物种植体验' },
      { name: '文化传承', time: '第三天', description: '传统文化学习制作' }
    ]
  }
])

// 非遗项目数据
const heritageProjects = ref([
  {
    id: 1,
    name: '传统酿酒工艺',
    icon: '🍶',
    level: '省级非遗',
    status: 'protected',
    statusText: '保护中',
    description: '传承千年的传统酿酒技艺，采用古法工艺',
    inheritors: 8,
    investment: 120
  },
  {
    id: 2,
    name: '竹编手工艺',
    icon: '🎋',
    level: '市级非遗',
    status: 'developing',
    statusText: '发展中',
    description: '精美的竹编工艺品，实用与艺术并重',
    inheritors: 15,
    investment: 80
  },
  {
    id: 3,
    name: '民间剪纸',
    icon: '✂️',
    level: '县级非遗',
    status: 'reviving',
    statusText: '复兴中',
    description: '传统剪纸艺术，表达美好寓意',
    inheritors: 12,
    investment: 50
  }
])

// 文化活动数据
const culturalActivities = ref([
  {
    id: 1,
    name: '春耕节',
    month: '3月',
    day: '15',
    description: '庆祝春耕开始，祈求丰收',
    participants: 2500,
    revenue: 85,
    status: 'completed',
    statusText: '已举办'
  },
  {
    id: 2,
    name: '丰收节',
    month: '9月',
    day: '23',
    description: '庆祝丰收成果，展示农产品',
    participants: 3200,
    revenue: 120,
    status: 'completed',
    statusText: '已举办'
  },
  {
    id: 3,
    name: '民俗文化节',
    month: '12月',
    day: '8',
    description: '展示传统民俗文化，非遗表演',
    participants: 1800,
    revenue: 65,
    status: 'planned',
    statusText: '计划中'
  }
])

// 游客统计数据
const visitorStats = ref([
  {
    id: 1,
    icon: '👥',
    value: '42.7万',
    label: '年接待游客',
    trend: 'up',
    trendText: '↗ +18%'
  },
  {
    id: 2,
    icon: '🏨',
    value: '85%',
    label: '住宿入住率',
    trend: 'up',
    trendText: '↗ +12%'
  },
  {
    id: 3,
    icon: '⭐',
    value: '4.7',
    label: '游客满意度',
    trend: 'up',
    trendText: '↗ +0.3'
  },
  {
    id: 4,
    icon: '🔄',
    value: '35%',
    label: '回头客比例',
    trend: 'up',
    trendText: '↗ +8%'
  }
])

// 收入构成数据
const revenueBreakdown = ref([
  { category: '门票收入', amount: 1250, percentage: 35, color: '#7ED321' },
  { category: '住宿收入', amount: 1080, percentage: 30, color: '#4A90E2' },
  { category: '餐饮收入', amount: 720, percentage: 20, color: '#F5A623' },
  { category: '购物收入', amount: 540, percentage: 15, color: '#BD10E0' }
])

const totalRevenue = computed(() => {
  return revenueBreakdown.value.reduce((sum, item) => sum + item.amount, 0)
})

const revenueGrowth = ref(22)
const avgSpending = ref(845)
const spendingGrowth = ref(15)

// 发展目标数据
const developmentGoals = ref([
  {
    id: 1,
    title: '旅游品牌提升',
    icon: '🏆',
    timeline: '2025年',
    description: '打造知名乡村旅游品牌，提升知名度和影响力',
    targets: [
      { metric: '年接待游客', value: '60万人次' },
      { metric: '旅游收入', value: '5000万元' },
      { metric: '品牌知名度', value: '80%' }
    ],
    progress: 65
  },
  {
    id: 2,
    title: '文化传承发展',
    icon: '🎭',
    timeline: '2026年',
    description: '加强文化遗产保护，推动文化产业发展',
    targets: [
      { metric: '非遗项目', value: '10个' },
      { metric: '文化传承人', value: '50人' },
      { metric: '文化产值', value: '800万元' }
    ],
    progress: 45
  },
  {
    id: 3,
    title: '基础设施完善',
    icon: '🏗️',
    timeline: '2027年',
    description: '完善旅游基础设施，提升服务质量',
    targets: [
      { metric: '民宿床位', value: '500张' },
      { metric: '停车位', value: '300个' },
      { metric: '服务设施', value: '20处' }
    ],
    progress: 30
  }
])

const currentRoute = computed(() => {
  return tourismRoutes.value.find(route => route.id === selectedRoute.value)
})



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

const selectAttraction = (id: number) => {
  console.log('选择景点:', id)
}

const selectRoute = (id: number) => {
  selectedRoute.value = id
}

const drawVisitorChart = () => {
  if (!visitorChart.value) return
  
  const ctx = visitorChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 400, 200)
  
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const data = [2.8, 3.2, 4.5, 3.8, 4.2, 5.1, 6.8, 7.2, 5.9, 4.6, 3.9, 3.5]
  
  // 绘制网格
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 6; i++) {
    const y = 30 + (i * 25)
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(360, y)
    ctx.stroke()
  }
  
  // 绘制折线
  ctx.beginPath()
  ctx.strokeStyle = '#7ED321'
  ctx.lineWidth = 2
  
  data.forEach((value, index) => {
    const x = 40 + (index * 27)
    const y = 180 - (value / 8) * 150
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
  
  // 绘制数据点
  data.forEach((value, index) => {
    const x = 40 + (index * 27)
    const y = 180 - (value / 8) * 150
    
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fillStyle = '#7ED321'
    ctx.fill()
  })
  
  // 绘制月份标签
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  months.forEach((month, index) => {
    const x = 40 + (index * 27)
    ctx.fillText(month, x, 195)
  })
}

const drawRevenueChart = () => {
  if (!revenueChart.value) return
  
  const ctx = revenueChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 250, 200)
  
  const centerX = 125
  const centerY = 100
  const radius = 70
  
  let currentAngle = -Math.PI / 2
  const total = revenueBreakdown.value.reduce((sum, item) => sum + item.amount, 0)
  
  revenueBreakdown.value.forEach(item => {
    const sliceAngle = (item.amount / total) * 2 * Math.PI
    
    // 绘制扇形
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = item.color
    ctx.fill()
    
    // 绘制边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 2
    ctx.stroke()
    
    currentAngle += sliceAngle
  })
}

onMounted(() => {
  setTimeout(() => {
    drawVisitorChart()
    drawRevenueChart()
  }, 100)
})

onUnmounted(() => {
  // 页面清理逻辑
})
</script>

<style scoped lang="scss">
.tourism-page {
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
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow-y: auto;
}

.right-section {
  flex: 1;
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

.heritage-subtitle,
.analytics-subtitle {
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

/* 景点概览 */
.attractions-overview {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.attractions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.attraction-card {
  background: rgba(12, 20, 38, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
    transform: translateY(-2px);
  }
}

.card-image {
  position: relative;
  height: 80px;
  
  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .image-icon {
      font-size: 32px;
    }
  }
  
  .card-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    
    &.nature {
      background: rgba(126, 211, 33, 0.2);
      color: #7ED321;
      border: 1px solid rgba(126, 211, 33, 0.5);
    }
    
    &.culture {
      background: rgba(245, 166, 35, 0.2);
      color: #F5A623;
      border: 1px solid rgba(245, 166, 35, 0.5);
    }
    
    &.recreation {
      background: rgba(74, 144, 226, 0.2);
      color: #4A90E2;
      border: 1px solid rgba(74, 144, 226, 0.5);
    }
    
    &.accommodation {
      background: rgba(189, 16, 224, 0.2);
      color: #BD10E0;
      border: 1px solid rgba(189, 16, 224, 0.5);
    }
  }
}

.card-content {
  padding: 15px;
  
  .attraction-name {
    font-size: 16px;
    font-weight: bold;
    color: #4A90E2;
    margin-bottom: 8px;
  }
  
  .attraction-description {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .attraction-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      
      .stat-icon {
        font-size: 12px;
      }
      
      .stat-value {
        color: #7ED321;
        font-weight: bold;
      }
      
      .stat-label {
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  
  .attraction-features {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    
    .feature-tag {
      padding: 2px 6px;
      background: rgba(126, 211, 33, 0.1);
      border: 1px solid rgba(126, 211, 33, 0.3);
      border-radius: 3px;
      font-size: 10px;
      color: #7ED321;
    }
  }
}

// 旅游路线
.tourism-routes {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
}

.routes-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.route-tabs {
  display: flex;
  gap: 10px;
}

.route-tab {
  flex: 1;
  padding: 10px;
  background: rgba(12, 20, 38, 0.4);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &.active {
    border-color: #4A90E2;
    background: rgba(74, 144, 226, 0.1);
  }
  
  &:hover {
    border-color: #4A90E2;
  }
  
  .tab-icon {
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  .tab-name {
    display: block;
    font-size: 12px;
    font-weight: bold;
    color: #4A90E2;
    margin-bottom: 3px;
  }
  
  .tab-duration {
    display: block;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.route-details {
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  padding: 15px;
}

.route-header {
  margin-bottom: 15px;
  
  .route-title {
    font-size: 16px;
    font-weight: bold;
    color: #4A90E2;
    margin-bottom: 8px;
  }
  
  .route-info {
    display: flex;
    gap: 15px;
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      
      .info-icon {
        font-size: 12px;
      }
    }
  }
}

.route-stops {
  position: relative;
  
  .stop-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 15px;
    position: relative;
    
    .stop-number {
      width: 24px;
      height: 24px;
      background: #4A90E2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      color: white;
      flex-shrink: 0;
    }
    
    .stop-content {
      flex: 1;
      
      .stop-name {
        font-size: 14px;
        font-weight: bold;
        color: #7ED321;
        margin-bottom: 3px;
      }
      
      .stop-time {
        font-size: 11px;
        color: #4A90E2;
        margin-bottom: 5px;
      }
      
      .stop-description {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.3;
      }
    }
    
    .stop-connector {
      position: absolute;
      left: 11px;
      top: 24px;
      width: 2px;
      height: 20px;
      background: rgba(74, 144, 226, 0.3);
    }
  }
}

/* 文化传承 */
.cultural-heritage {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.heritage-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.heritage-projects {
  .projects-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .project-card {
    background: rgba(12, 20, 38, 0.4);
    border: 1px solid rgba(74, 144, 226, 0.2);
    border-radius: 8px;
    padding: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #4A90E2;
    }
  }
  
  .project-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    
    .project-icon {
      font-size: 16px;
    }
    
    .project-info {
      flex: 1;
      
      .project-name {
        font-size: 14px;
        font-weight: bold;
        color: #4A90E2;
        margin-bottom: 2px;
      }
      
      .project-level {
        font-size: 10px;
        color: #7ED321;
      }
    }
    
    .project-status {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      
      &.protected {
        background: rgba(126, 211, 33, 0.2);
        color: #7ED321;
      }
      
      &.developing {
        background: rgba(74, 144, 226, 0.2);
        color: #4A90E2;
      }
      
      &.reviving {
        background: rgba(245, 166, 35, 0.2);
        color: #F5A623;
      }
    }
  }
  
  .project-content {
    .project-description {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 8px;
      line-height: 1.3;
    }
    
    .project-metrics {
      display: flex;
      gap: 15px;
      
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
  }
}

.cultural-activities {
  .activities-timeline {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 12px;
    
    .activity-date {
      text-align: center;
      min-width: 40px;
      
      .date-month {
        font-size: 10px;
        color: #4A90E2;
      }
      
      .date-day {
        font-size: 16px;
        font-weight: bold;
        color: #7ED321;
      }
    }
    
    .activity-content {
      flex: 1;
      
      .activity-name {
        font-size: 14px;
        font-weight: bold;
        color: #4A90E2;
        margin-bottom: 3px;
      }
      
      .activity-description {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 5px;
      }
      
      .activity-stats {
        display: flex;
        gap: 10px;
        
        .stat {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
    
    .activity-status {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      
      &.completed {
        background: rgba(126, 211, 33, 0.2);
        color: #7ED321;
      }
      
      &.planned {
        background: rgba(74, 144, 226, 0.2);
        color: #4A90E2;
      }
    }
  }
}

/* 旅游数据分析 */
.tourism-analytics {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.visitor-statistics {
  .statistics-overview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: rgba(12, 20, 38, 0.4);
    border-radius: 6px;
    
    .stat-icon {
      font-size: 16px;
    }
    
    .stat-content {
      .stat-value {
        font-size: 16px;
        font-weight: bold;
        color: #4A90E2;
      }
      
      .stat-label {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 2px;
      }
      
      .stat-trend {
        font-size: 9px;
        
        &.up {
          color: #7ED321;
        }
        
        &.down {
          color: #FF6B6B;
        }
      }
    }
  }
  
  .visitor-chart {
    .chart-container {
      background: rgba(12, 20, 38, 0.4);
      border-radius: 8px;
      padding: 15px;
      display: flex;
      justify-content: center;
    }
  }
}

.revenue-analysis {
  .revenue-breakdown {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    
    .breakdown-chart {
      background: rgba(12, 20, 38, 0.4);
      border-radius: 8px;
      padding: 15px;
      display: flex;
      justify-content: center;
    }
    
    .breakdown-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .detail-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        
        .detail-content {
          flex: 1;
          
          .detail-category {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
          }
          
          .detail-amount {
            font-size: 14px;
            font-weight: bold;
            color: #7ED321;
          }
          
          .detail-percentage {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }
  }
  
  .revenue-summary {
    display: flex;
    justify-content: space-between;
    
    .summary-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      
      .summary-label {
        color: rgba(255, 255, 255, 0.7);
      }
      
      .summary-value {
        color: #4A90E2;
        font-weight: bold;
      }
      
      .summary-growth {
        font-size: 10px;
        
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

.planning-goals {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.goal-item {
  background: rgba(12, 20, 38, 0.4);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
  }
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  
  .goal-icon {
    font-size: 16px;
  }
  
  .goal-title {
    flex: 1;
    font-size: 14px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .goal-timeline {
    font-size: 10px;
    color: #7ED321;
    background: rgba(126, 211, 33, 0.1);
    padding: 3px 6px;
    border-radius: 3px;
  }
}

.goal-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  line-height: 1.3;
}

.goal-targets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  
  .target {
    background: rgba(126, 211, 33, 0.1);
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    
    .target-metric {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .target-value {
      color: #7ED321;
      font-weight: bold;
    }
  }
}

.goal-progress {
  .progress-label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 5px;
  }
  
  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #7ED321, #4A90E2);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }
}
</style>