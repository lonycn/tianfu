<template>
  <div class="policy-page">
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
    
    <!-- 头部 -->
    <header class="page-header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <span>←</span>
          <span>返回首页</span>
        </div>
        <h1 class="page-title">政策支持与管理板块</h1>
        <div class="time-display">{{ currentTime }}</div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：政策支持体系 -->
      <section class="left-section">
        <!-- 政策概览 -->
        <div class="policy-overview">
          <h2 class="section-title">政策支持体系</h2>
          <div class="policy-categories">
            <div class="category-tabs">
              <div 
                class="category-tab" 
                v-for="category in policyCategories" 
                :key="category.id"
                :class="{ active: selectedCategory === category.id }"
                @click="selectCategory(category.id)"
              >
                <span class="tab-icon">{{ category.icon }}</span>
                <span class="tab-name">{{ category.name }}</span>
                <span class="tab-count">{{ category.count }}项</span>
              </div>
            </div>
            
            <div class="category-content" v-if="currentCategory">
              <div class="policy-list">
                <div class="policy-item" v-for="policy in currentCategory.policies" :key="policy.id">
                  <div class="policy-header">
                    <div class="policy-title">{{ policy.title }}</div>
                    <div class="policy-status" :class="policy.status">{{ policy.statusText }}</div>
                  </div>
                  
                  <div class="policy-content">
                    <div class="policy-description">{{ policy.description }}</div>
                    <div class="policy-details">
                      <div class="detail-item">
                        <span class="detail-label">发布时间:</span>
                        <span class="detail-value">{{ policy.publishDate }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">执行期限:</span>
                        <span class="detail-value">{{ policy.duration }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">资金投入:</span>
                        <span class="detail-value">{{ policy.funding }}</span>
                      </div>
                    </div>
                    
                    <div class="policy-benefits">
                      <h5 class="benefits-title">主要扶持内容:</h5>
                      <div class="benefits-list">
                        <div class="benefit-item" v-for="benefit in policy.benefits" :key="benefit">
                          <span class="benefit-icon">✓</span>
                          <span class="benefit-text">{{ benefit }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 资金投入统计 -->
        <div class="funding-statistics">
          <h3 class="subsection-title">资金投入统计</h3>
          <div class="funding-content">
            <div class="funding-overview">
              <div class="overview-card" v-for="item in fundingOverview" :key="item.id">
                <div class="card-icon">{{ item.icon }}</div>
                <div class="card-content">
                  <div class="card-value">{{ item.value }}</div>
                  <div class="card-label">{{ item.label }}</div>
                  <div class="card-trend" :class="item.trend">{{ item.trendText }}</div>
                </div>
              </div>
            </div>
            
            <div class="funding-chart">
              <h4 class="chart-title">年度资金投入分布</h4>
              <div class="chart-container">
                <canvas ref="fundingChart" width="400" height="200"></canvas>
              </div>
              <div class="chart-legend">
                <div class="legend-item" v-for="item in fundingDistribution" :key="item.category">
                  <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                  <span class="legend-label">{{ item.category }}</span>
                  <span class="legend-value">{{ item.amount }}万元</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右侧：管理体系与效果评估 -->
      <section class="right-section">
        <!-- 管理体系 -->
        <div class="management-system">
          <h2 class="section-title">管理体系架构</h2>
          <div class="system-structure">
            <!-- 组织架构 -->
            <div class="organization-chart">
              <h4 class="structure-title">组织架构</h4>
              <div class="org-levels">
                <div class="org-level" v-for="level in organizationLevels" :key="level.id">
                  <div class="level-header">
                    <div class="level-icon">{{ level.icon }}</div>
                    <div class="level-name">{{ level.name }}</div>
                    <div class="level-count">{{ level.count }}个</div>
                  </div>
                  
                  <div class="level-departments">
                    <div class="department-item" v-for="dept in level.departments" :key="dept.name">
                      <div class="dept-name">{{ dept.name }}</div>
                      <div class="dept-role">{{ dept.role }}</div>
                      <div class="dept-staff">{{ dept.staff }}人</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 管理制度 -->
            <div class="management-rules">
              <h4 class="structure-title">管理制度</h4>
              <div class="rules-grid">
                <div class="rule-category" v-for="category in managementRules" :key="category.id">
                  <div class="category-header">
                    <div class="category-icon">{{ category.icon }}</div>
                    <div class="category-name">{{ category.name }}</div>
                  </div>
                  
                  <div class="category-rules">
                    <div class="rule-item" v-for="rule in category.rules" :key="rule.name">
                      <div class="rule-name">{{ rule.name }}</div>
                      <div class="rule-status" :class="rule.status">{{ rule.statusText }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 效果评估 -->
        <div class="effectiveness-assessment">
          <h3 class="subsection-title">政策效果评估</h3>
          <div class="assessment-content">
            <!-- 关键指标 -->
            <div class="key-indicators">
              <h4 class="assessment-subtitle">关键绩效指标</h4>
              <div class="indicators-grid">
                <div class="indicator-card" v-for="indicator in keyIndicators" :key="indicator.id">
                  <div class="indicator-header">
                    <div class="indicator-icon">{{ indicator.icon }}</div>
                    <div class="indicator-name">{{ indicator.name }}</div>
                  </div>
                  
                  <div class="indicator-metrics">
                    <div class="metric-current">
                      <span class="metric-value">{{ indicator.current }}</span>
                      <span class="metric-unit">{{ indicator.unit }}</span>
                    </div>
                    <div class="metric-target">
                      <span class="metric-label">目标:</span>
                      <span class="metric-value">{{ indicator.target }}{{ indicator.unit }}</span>
                    </div>
                    <div class="metric-progress">
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: `${indicator.progress}%`, backgroundColor: indicator.color }"></div>
                      </div>
                      <span class="progress-text">{{ indicator.progress }}%</span>
                    </div>
                  </div>
                  
                  <div class="indicator-trend" :class="indicator.trend">
                    {{ indicator.trendText }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 满意度调查 -->
            <div class="satisfaction-survey">
              <h4 class="assessment-subtitle">满意度调查结果</h4>
              <div class="survey-results">
                <div class="survey-overview">
                  <div class="overall-score">
                    <div class="score-value">{{ overallSatisfaction.score }}</div>
                    <div class="score-label">综合满意度</div>
                    <div class="score-trend" :class="overallSatisfaction.trend">
                      {{ overallSatisfaction.trendText }}
                    </div>
                  </div>
                  
                  <div class="survey-stats">
                    <div class="stat-item" v-for="stat in surveyStats" :key="stat.label">
                      <div class="stat-label">{{ stat.label }}</div>
                      <div class="stat-value">{{ stat.value }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="satisfaction-breakdown">
                  <div class="breakdown-item" v-for="item in satisfactionBreakdown" :key="item.category">
                    <div class="breakdown-header">
                      <span class="breakdown-category">{{ item.category }}</span>
                      <span class="breakdown-score">{{ item.score }}分</span>
                    </div>
                    <div class="breakdown-bar">
                      <div class="bar-fill" :style="{ width: `${(item.score / 5) * 100}%`, backgroundColor: item.color }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 改进建议 -->
        <div class="improvement-suggestions">
          <h3 class="subsection-title">改进建议与规划</h3>
          <div class="suggestions-content">
            <div class="suggestion-categories">
              <div class="suggestion-category" v-for="category in improvementSuggestions" :key="category.id">
                <div class="category-header">
                  <div class="category-icon">{{ category.icon }}</div>
                  <div class="category-title">{{ category.title }}</div>
                  <div class="category-priority" :class="category.priority">{{ category.priorityText }}</div>
                </div>
                
                <div class="category-suggestions">
                  <div class="suggestion-item" v-for="suggestion in category.suggestions" :key="suggestion.id">
                    <div class="suggestion-content">
                      <div class="suggestion-title">{{ suggestion.title }}</div>
                      <div class="suggestion-description">{{ suggestion.description }}</div>
                    </div>
                    
                    <div class="suggestion-timeline">
                      <span class="timeline-label">预期完成:</span>
                      <span class="timeline-value">{{ suggestion.timeline }}</span>
                    </div>
                    
                    <div class="suggestion-status" :class="suggestion.status">{{ suggestion.statusText }}</div>
                  </div>
                </div>
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

const router = useRouter()
const fundingChart = ref<HTMLCanvasElement>()

const currentTime = ref('')
const selectedCategory = ref(1)

// 政策分类数据
const policyCategories = ref([
  {
    id: 1,
    name: '财政扶持',
    icon: '💰',
    count: 8,
    policies: [
      {
        id: 1,
        title: '农业产业发展专项资金',
        description: '支持农业产业化发展，提升农产品质量和市场竞争力',
        status: 'active',
        statusText: '执行中',
        publishDate: '2024年1月',
        duration: '3年',
        funding: '2000万元',
        benefits: [
          '种植基地建设补贴50%',
          '农机设备购置补贴30%',
          '品牌建设资金支持',
          '技术培训费用全额补贴'
        ]
      },
      {
        id: 2,
        title: '绿色农业发展奖励',
        description: '鼓励发展绿色有机农业，推动可持续发展',
        status: 'active',
        statusText: '执行中',
        publishDate: '2024年3月',
        duration: '5年',
        funding: '1500万元',
        benefits: [
          '有机认证费用补贴100%',
          '绿色种植技术推广',
          '环保设施建设支持',
          '生态保护奖励机制'
        ]
      }
    ]
  },
  {
    id: 2,
    name: '技术支持',
    icon: '🔬',
    count: 6,
    policies: [
      {
        id: 3,
        title: '农业科技创新计划',
        description: '推动农业科技创新，提升农业现代化水平',
        status: 'active',
        statusText: '执行中',
        publishDate: '2024年2月',
        duration: '4年',
        funding: '1200万元',
        benefits: [
          '科研项目资金支持',
          '技术专家指导服务',
          '创新成果转化补贴',
          '科技人才引进奖励'
        ]
      }
    ]
  },
  {
    id: 3,
    name: '市场拓展',
    icon: '🏪',
    count: 5,
    policies: [
      {
        id: 4,
        title: '农产品市场开拓支持',
        description: '支持农产品市场开拓，拓宽销售渠道',
        status: 'planning',
        statusText: '规划中',
        publishDate: '2024年6月',
        duration: '3年',
        funding: '800万元',
        benefits: [
          '电商平台入驻补贴',
          '展会参展费用支持',
          '品牌推广资金补助',
          '物流配送体系建设'
        ]
      }
    ]
  },
  {
    id: 4,
    name: '人才培养',
    icon: '👨‍🎓',
    count: 4,
    policies: [
      {
        id: 5,
        title: '新型农民培育工程',
        description: '培养新型职业农民，提升农业从业人员素质',
        status: 'active',
        statusText: '执行中',
        publishDate: '2024年1月',
        duration: '长期',
        funding: '600万元',
        benefits: [
          '免费技能培训',
          '学历教育补贴',
          '创业指导服务',
          '就业推荐保障'
        ]
      }
    ]
  }
])

// 资金投入概览
const fundingOverview = ref([
  {
    id: 1,
    icon: '💰',
    value: '5,120',
    label: '总投入资金(万元)',
    trend: 'up',
    trendText: '↗ +25%'
  },
  {
    id: 2,
    icon: '📊',
    value: '23',
    label: '扶持政策数量',
    trend: 'up',
    trendText: '↗ +4项'
  },
  {
    id: 3,
    icon: '🏢',
    value: '156',
    label: '受益企业/合作社',
    trend: 'up',
    trendText: '↗ +18家'
  },
  {
    id: 4,
    icon: '👥',
    value: '2,847',
    label: '受益农户数量',
    trend: 'up',
    trendText: '↗ +312户'
  }
])

// 资金分布数据
const fundingDistribution = ref([
  { category: '产业发展', amount: 2000, color: '#7ED321' },
  { category: '技术创新', amount: 1200, color: '#4A90E2' },
  { category: '绿色发展', amount: 1500, color: '#F5A623' },
  { category: '人才培养', amount: 420, color: '#BD10E0' }
])

// 组织架构数据
const organizationLevels = ref([
  {
    id: 1,
    name: '管委会',
    icon: '🏛️',
    count: 1,
    departments: [
      { name: '综合管理部', role: '统筹协调', staff: 8 },
      { name: '产业发展部', role: '产业规划', staff: 12 },
      { name: '科技创新部', role: '技术支持', staff: 10 }
    ]
  },
  {
    id: 2,
    name: '执行机构',
    icon: '🏢',
    count: 5,
    departments: [
      { name: '农业服务中心', role: '技术服务', staff: 15 },
      { name: '市场营销中心', role: '市场开拓', staff: 8 },
      { name: '质量监督站', role: '质量监管', staff: 6 }
    ]
  },
  {
    id: 3,
    name: '基层组织',
    icon: '🏘️',
    count: 12,
    departments: [
      { name: '村委会', role: '基层管理', staff: 36 },
      { name: '合作社', role: '生产组织', staff: 89 },
      { name: '农户代表', role: '利益代表', staff: 24 }
    ]
  }
])

// 管理制度数据
const managementRules = ref([
  {
    id: 1,
    name: '财务管理',
    icon: '💼',
    rules: [
      { name: '资金使用管理办法', status: 'implemented', statusText: '已实施' },
      { name: '财务审计制度', status: 'implemented', statusText: '已实施' },
      { name: '预算管理规定', status: 'implemented', statusText: '已实施' }
    ]
  },
  {
    id: 2,
    name: '质量监管',
    icon: '🔍',
    rules: [
      { name: '产品质量标准', status: 'implemented', statusText: '已实施' },
      { name: '检测认证制度', status: 'implemented', statusText: '已实施' },
      { name: '追溯体系管理', status: 'updating', statusText: '更新中' }
    ]
  },
  {
    id: 3,
    name: '人员管理',
    icon: '👥',
    rules: [
      { name: '岗位职责制度', status: 'implemented', statusText: '已实施' },
      { name: '绩效考核办法', status: 'implemented', statusText: '已实施' },
      { name: '培训管理规定', status: 'draft', statusText: '草案中' }
    ]
  }
])

// 关键指标数据
const keyIndicators = ref([
  {
    id: 1,
    name: '农民收入增长',
    icon: '💰',
    current: 18.5,
    target: 20,
    unit: '万元',
    progress: 92,
    color: '#7ED321',
    trend: 'up',
    trendText: '↗ 同比增长15%'
  },
  {
    id: 2,
    name: '产业规模扩大',
    icon: '📈',
    current: 3247,
    target: 4000,
    unit: '亩',
    progress: 81,
    color: '#4A90E2',
    trend: 'up',
    trendText: '↗ 同比增长12%'
  },
  {
    id: 3,
    name: '技术覆盖率',
    icon: '🔬',
    current: 85,
    target: 95,
    unit: '%',
    progress: 89,
    color: '#F5A623',
    trend: 'up',
    trendText: '↗ 同比增长8%'
  },
  {
    id: 4,
    name: '环保达标率',
    icon: '🌱',
    current: 96,
    target: 98,
    unit: '%',
    progress: 98,
    color: '#50E3C2',
    trend: 'up',
    trendText: '↗ 同比增长3%'
  }
])

// 满意度数据
const overallSatisfaction = ref({
  score: 4.6,
  trend: 'up',
  trendText: '↗ +0.3分'
})

const surveyStats = ref([
  { label: '参与调查', value: '1,247人' },
  { label: '有效问卷', value: '1,198份' },
  { label: '回收率', value: '96%' }
])

const satisfactionBreakdown = ref([
  { category: '政策透明度', score: 4.7, color: '#7ED321' },
  { category: '服务效率', score: 4.5, color: '#4A90E2' },
  { category: '资金使用', score: 4.6, color: '#F5A623' },
  { category: '技术支持', score: 4.8, color: '#BD10E0' },
  { category: '市场帮扶', score: 4.4, color: '#50E3C2' }
])

// 改进建议数据
const improvementSuggestions = ref([
  {
    id: 1,
    title: '政策优化',
    icon: '📋',
    priority: 'high',
    priorityText: '高优先级',
    suggestions: [
      {
        id: 1,
        title: '简化申报流程',
        description: '优化政策申报程序，减少审批环节，提高办事效率',
        timeline: '2024年Q2',
        status: 'planning',
        statusText: '规划中'
      },
      {
        id: 2,
        title: '政策宣传加强',
        description: '加大政策宣传力度，确保农户及时了解最新政策',
        timeline: '2024年Q1',
        status: 'implementing',
        statusText: '实施中'
      }
    ]
  },
  {
    id: 2,
    title: '服务提升',
    icon: '🛠️',
    priority: 'medium',
    priorityText: '中优先级',
    suggestions: [
      {
        id: 3,
        title: '技术服务升级',
        description: '建立专家服务团队，提供更专业的技术指导',
        timeline: '2024年Q3',
        status: 'planning',
        statusText: '规划中'
      },
      {
        id: 4,
        title: '数字化管理',
        description: '推进管理数字化，提升服务便民程度',
        timeline: '2024年Q4',
        status: 'researching',
        statusText: '调研中'
      }
    ]
  },
  {
    id: 3,
    title: '监督完善',
    icon: '👁️',
    priority: 'medium',
    priorityText: '中优先级',
    suggestions: [
      {
        id: 5,
        title: '监督机制健全',
        description: '建立多层次监督体系，确保政策执行到位',
        timeline: '2024年Q2',
        status: 'planning',
        statusText: '规划中'
      }
    ]
  }
])

const currentCategory = computed(() => {
  return policyCategories.value.find(cat => cat.id === selectedCategory.value)
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

const goBack = () => {
  router.push('/')
}

const selectCategory = (id: number) => {
  selectedCategory.value = id
}

const drawFundingChart = () => {
  if (!fundingChart.value) return
  
  const ctx = fundingChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 400, 200)
  
  const categories = fundingDistribution.value.map(item => item.category)
  const data = fundingDistribution.value.map(item => item.amount)
  const colors = fundingDistribution.value.map(item => item.color)
  
  const maxValue = Math.max(...data)
  const barWidth = 60
  const barSpacing = 20
  const chartHeight = 150
  const startX = 50
  
  // 绘制网格线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = 30 + (i * 30)
    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(350, y)
    ctx.stroke()
  }
  
  // 绘制柱状图
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight
    const x = startX + (index * (barWidth + barSpacing))
    const y = 180 - barHeight
    
    // 绘制柱子
    ctx.fillStyle = colors[index]
    ctx.fillRect(x, y, barWidth, barHeight)
    
    // 绘制数值
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${value}万`, x + barWidth / 2, y - 5)
    
    // 绘制分类标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '10px Arial'
    ctx.fillText(categories[index], x + barWidth / 2, 195)
  })
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  setTimeout(() => {
    drawFundingChart()
  }, 100)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped lang="scss">
.policy-page {
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
   
   overflow-y: auto;
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

.structure-title,
.assessment-subtitle {
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

.benefits-title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #4A90E2;
}

// 政策概览
.policy-overview {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.policy-categories {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.category-tab {
  padding: 12px;
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
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  .tab-name {
    display: block;
    font-size: 14px;
    font-weight: bold;
    color: #4A90E2;
    margin-bottom: 3px;
  }
  
  .tab-count {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
  }
}

.category-content {
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  padding: 15px;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.policy-item {
  background: rgba(26, 35, 50, 0.6);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
  }
}

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  .policy-title {
    font-size: 16px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .policy-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    
    &.active {
      background: rgba(126, 211, 33, 0.2);
      color: #7ED321;
    }
    
    &.planning {
      background: rgba(245, 166, 35, 0.2);
      color: #F5A623;
    }
  }
}

.policy-content {
  .policy-description {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .policy-details {
    display: flex;
    gap: 20px;
    margin-bottom: 12px;
    
    .detail-item {
      font-size: 12px;
      
      .detail-label {
        color: rgba(255, 255, 255, 0.6);
      }
      
      .detail-value {
        color: #7ED321;
        font-weight: bold;
      }
    }
  }
  
  .policy-benefits {
    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      
      .benefit-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        
        .benefit-icon {
          color: #7ED321;
          font-weight: bold;
        }
        
        .benefit-text {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}

// 资金投入统计
.funding-statistics {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
}

.funding-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.funding-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  
  .card-icon {
    font-size: 18px;
  }
  
  .card-content {
    .card-value {
      font-size: 16px;
      font-weight: bold;
      color: #4A90E2;
    }
    
    .card-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2px;
    }
    
    .card-trend {
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

.funding-chart {
  .chart-container {
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 5px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
  }
  
  .chart-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
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

// 管理体系
.management-system {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.system-structure {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.organization-chart {
  .org-levels {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .org-level {
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 12px;
    
    .level-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      
      .level-icon {
        font-size: 16px;
      }
      
      .level-name {
        flex: 1;
        font-size: 14px;
        font-weight: bold;
        color: #4A90E2;
      }
      
      .level-count {
        font-size: 11px;
        color: #7ED321;
        background: rgba(126, 211, 33, 0.1);
        padding: 3px 6px;
        border-radius: 3px;
      }
    }
    
    .level-departments {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      
      .department-item {
        background: rgba(26, 35, 50, 0.6);
        border-radius: 6px;
        padding: 8px;
        text-align: center;
        
        .dept-name {
          font-size: 12px;
          font-weight: bold;
          color: #4A90E2;
          margin-bottom: 3px;
        }
        
        .dept-role {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 3px;
        }
        
        .dept-staff {
          font-size: 10px;
          color: #7ED321;
        }
      }
    }
  }
}

.management-rules {
  .rules-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .rule-category {
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 12px;
    
    .category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      
      .category-icon {
        font-size: 14px;
      }
      
      .category-name {
        font-size: 13px;
        font-weight: bold;
        color: #4A90E2;
      }
    }
    
    .category-rules {
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      .rule-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .rule-name {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .rule-status {
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: bold;
          
          &.implemented {
            background: rgba(126, 211, 33, 0.2);
            color: #7ED321;
          }
          
          &.updating {
            background: rgba(245, 166, 35, 0.2);
            color: #F5A623;
          }
          
          &.draft {
            background: rgba(74, 144, 226, 0.2);
            color: #4A90E2;
          }
        }
      }
    }
  }
}

// 效果评估
.effectiveness-assessment {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.assessment-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.key-indicators {
  .indicators-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .indicator-card {
    background: rgba(12, 20, 38, 0.4);
    border: 1px solid rgba(74, 144, 226, 0.2);
    border-radius: 8px;
    padding: 12px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #4A90E2;
    }
  }
  
  .indicator-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    
    .indicator-icon {
      font-size: 14px;
    }
    
    .indicator-name {
      font-size: 13px;
      font-weight: bold;
      color: #4A90E2;
    }
  }
  
  .indicator-metrics {
    margin-bottom: 8px;
    
    .metric-current {
      margin-bottom: 5px;
      
      .metric-value {
        font-size: 18px;
        font-weight: bold;
        color: #7ED321;
      }
      
      .metric-unit {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        margin-left: 2px;
      }
    }
    
    .metric-target {
      font-size: 11px;
      margin-bottom: 8px;
      
      .metric-label {
        color: rgba(255, 255, 255, 0.6);
      }
      
      .metric-value {
        color: #4A90E2;
        font-weight: bold;
      }
    }
    
    .metric-progress {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .progress-bar {
        flex: 1;
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
      
      .progress-text {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
  
  .indicator-trend {
    font-size: 10px;
    
    &.up {
      color: #7ED321;
    }
    
    &.down {
      color: #FF6B6B;
    }
  }
}

.satisfaction-survey {
  .survey-results {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .survey-overview {
    display: flex;
    gap: 20px;
    
    .overall-score {
      text-align: center;
      
      .score-value {
        font-size: 32px;
        font-weight: bold;
        color: #7ED321;
      }
      
      .score-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 5px;
      }
      
      .score-trend {
        font-size: 11px;
        
        &.up {
          color: #7ED321;
        }
      }
    }
    
    .survey-stats {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .stat-item {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        
        .stat-label {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .stat-value {
          color: #4A90E2;
          font-weight: bold;
        }
      }
    }
  }
  
  .satisfaction-breakdown {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .breakdown-item {
      .breakdown-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        
        .breakdown-category {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .breakdown-score {
          font-size: 12px;
          color: #7ED321;
          font-weight: bold;
        }
      }
      
      .breakdown-bar {
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
}

// 改进建议
.improvement-suggestions {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.suggestion-categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestion-category {
  background: rgba(12, 20, 38, 0.4);
  border-radius: 8px;
  padding: 15px;
  
  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    
    .category-icon {
      font-size: 16px;
    }
    
    .category-title {
      flex: 1;
      font-size: 14px;
      font-weight: bold;
      color: #4A90E2;
    }
    
    .category-priority {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      
      &.high {
        background: rgba(255, 107, 107, 0.2);
        color: #FF6B6B;
      }
      
      &.medium {
        background: rgba(245, 166, 35, 0.2);
        color: #F5A623;
      }
      
      &.low {
        background: rgba(126, 211, 33, 0.2);
        color: #7ED321;
      }
    }
  }
  
  .category-suggestions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(26, 35, 50, 0.6);
      border-radius: 6px;
      padding: 10px;
      
      .suggestion-content {
        flex: 1;
        
        .suggestion-title {
          font-size: 13px;
          font-weight: bold;
          color: #4A90E2;
          margin-bottom: 3px;
        }
        
        .suggestion-description {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.3;
        }
      }
      
      .suggestion-timeline {
        font-size: 10px;
        text-align: center;
        
        .timeline-label {
          color: rgba(255, 255, 255, 0.6);
          display: block;
          margin-bottom: 2px;
        }
        
        .timeline-value {
          color: #7ED321;
          font-weight: bold;
        }
      }
      
      .suggestion-status {
        padding: 3px 6px;
        border-radius: 3px;
        font-size: 9px;
        font-weight: bold;
        
        &.planning {
          background: rgba(74, 144, 226, 0.2);
          color: #4A90E2;
        }
        
        &.implementing {
          background: rgba(245, 166, 35, 0.2);
          color: #F5A623;
        }
        
        &.researching {
          background: rgba(189, 16, 224, 0.2);
          color: #BD10E0;
        }
      }
    }
  }
}
</style>