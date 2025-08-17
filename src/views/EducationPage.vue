<template>
  <div>
    <div class="education-page">
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
      <UnifiedHeader current-page="education" />

      <!-- 主内容 -->
      <main class="page-main">
        <!-- 左侧：教育研学概览 -->
        <section class="left-section">
          <!-- 研学项目 -->
          <div class="study-programs">
            <h2 class="section-title">教育研学项目</h2>
            <div class="programs-grid">
              <div class="program-card" v-for="program in studyPrograms" :key="program.id">
                <div class="card-header">
                  <div class="program-icon">{{ program.icon }}</div>
                  <div class="program-info">
                    <h3 class="program-title">{{ program.title }}</h3>
                    <p class="program-category">{{ program.category }}</p>
                  </div>
                  <div class="program-status" :class="program.status">{{ program.statusText }}</div>
                </div>
                
                <div class="program-details">
                  <div class="detail-item">
                    <span class="detail-label">参与人数:</span>
                    <span class="detail-value">{{ program.participants }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">课程时长:</span>
                    <span class="detail-value">{{ program.duration }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">满意度:</span>
                    <span class="detail-value satisfaction">{{ program.satisfaction }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 教育统计 -->
          <div class="education-stats">
            <h3 class="subsection-title">教育成果统计</h3>
            <div class="stats-overview">
              <div class="stat-card" v-for="stat in educationStats" :key="stat.label">
                <div class="stat-icon">{{ stat.icon }}</div>
                <div class="stat-content">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                  <div class="stat-trend" :class="stat.trend">{{ stat.trendText }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧：课程安排与资源 -->
        <section class="right-section">
          <!-- 课程安排 -->
          <div class="course-schedule">
            <h2 class="section-title">课程安排</h2>
            <div class="schedule-calendar">
              <div class="calendar-header">
                <div class="month-nav">
                  <button class="nav-btn prev">‹</button>
                  <span class="current-month">{{ currentMonth }}</span>
                  <button class="nav-btn next">›</button>
                </div>
              </div>
              <div class="calendar-grid">
                <div class="day-header" v-for="day in weekDays" :key="day">{{ day }}</div>
                <div 
                  class="calendar-day" 
                  v-for="date in calendarDates" 
                  :key="date.date"
                  :class="{ 
                    'has-course': date.hasCourse, 
                    'today': date.isToday,
                    'other-month': !date.isCurrentMonth
                  }"
                >
                  <span class="date-number">{{ date.day }}</span>
                  <div class="course-info" v-if="date.hasCourse">
                    <div class="course-icon">{{ date.courseIcon }}</div>
                    <div class="course-title">{{ date.courseTitle }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 教学资源 -->
          <div class="teaching-resources">
            <h3 class="subsection-title">教学资源库</h3>
            <div class="resources-list">
              <div class="resource-item" v-for="resource in teachingResources" :key="resource.id">
                <div class="resource-icon">{{ resource.icon }}</div>
                <div class="resource-info">
                  <div class="resource-name">{{ resource.name }}</div>
                  <div class="resource-type">{{ resource.type }}</div>
                </div>
                <div class="resource-stats">
                  <span class="usage-count">{{ resource.usage }}次使用</span>
                  <span class="rating">⭐ {{ resource.rating }}</span>
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

// 研学项目数据
const studyPrograms = ref([
  {
    id: 1,
    title: '湿地生态探索',
    category: '自然科学',
    icon: '🌿',
    participants: 156,
    duration: '2小时',
    satisfaction: 95,
    status: 'active',
    statusText: '进行中'
  },
  {
    id: 2,
    title: '智慧农业体验',
    category: '科技教育',
    icon: '🚜',
    participants: 89,
    duration: '3小时',
    satisfaction: 92,
    status: 'scheduled',
    statusText: '已安排'
  },
  {
    id: 3,
    title: '环保实践课堂',
    category: '环境教育',
    icon: '♻️',
    participants: 234,
    duration: '1.5小时',
    satisfaction: 98,
    status: 'completed',
    statusText: '已完成'
  }
])

// 教育统计数据
const educationStats = ref([
  {
    icon: '👨‍🎓',
    value: '2,847',
    label: '累计学员',
    trend: 'up',
    trendText: '↗ +15%'
  },
  {
    icon: '📚',
    value: '47',
    label: '课程数量',
    trend: 'up',
    trendText: '↗ +3门'
  },
  {
    icon: '🏆',
    value: '96.5%',
    label: '满意度',
    trend: 'stable',
    trendText: '→ 稳定'
  },
  {
    icon: '🎯',
    value: '89%',
    label: '完成率',
    trend: 'up',
    trendText: '↗ +2%'
  }
])

// 当前月份和日历数据
const currentMonth = ref('')
const calendarDates = ref([])

// 星期标题
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 课程数据
const courseData = {
  湿地生态探索: { title: '湿地生态探索', type: 'nature', icon: '🌿' },
  智慧农业体验: { title: '智慧农业体验', type: 'tech', icon: '🚜' },
  环保实践课堂: { title: '环保实践课堂', type: 'environmental', icon: '♻️' },
  鸟类观察学习: { title: '鸟类观察学习', type: 'nature', icon: '🦅' },
  水质监测实验: { title: '水质监测实验', type: 'science', icon: '🔬' },
  植物标本制作: { title: '植物标本制作', type: 'craft', icon: '🌱' },
  生态摄影教学: { title: '生态摄影教学', type: 'art', icon: '📸' },
  农业科技参观: { title: '农业科技参观', type: 'tech', icon: '🏭' },
  户外生存技能: { title: '户外生存技能', type: 'survival', icon: '🏕️' },
  科学实验课堂: { title: '科学实验课堂', type: 'science', icon: '⚗️' }
}

// 生成当前月份的日历
const generateCalendar = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  // 更新当前月份显示
  currentMonth.value = `${year}年${month + 1}月`
  
  // 获取当前月份的第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const today = now.getDate()
  
  // 获取第一天是星期几
  const firstDayWeek = firstDay.getDay()
  
  // 清空日历数据
  const dates = []
  
  // 添加上个月的日期（用于填充）
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i)
    dates.push({
      date: prevDate.toISOString().split('T')[0],
      day: prevDate.getDate(),
      hasCourse: false,
      isToday: false,
      isCurrentMonth: false,
      courseTitle: ''
    })
  }
  
  // 添加当前月份的日期
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const hasCourse = Math.random() > 0.6 // 40%的概率有课程
    const courseNames = Object.keys(courseData)
    const randomCourse = courseNames[Math.floor(Math.random() * courseNames.length)]
    
    dates.push({
      date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      day: day,
      hasCourse: hasCourse,
      isToday: day === today,
      isCurrentMonth: true,
      courseTitle: hasCourse ? courseData[randomCourse].title : '',
      courseIcon: hasCourse ? courseData[randomCourse].icon : ''
    })
  }
  
  // 添加下个月的日期（用于填充到42个格子）
  const remainingDays = 42 - dates.length
  for (let day = 1; day <= remainingDays; day++) {
    const nextDate = new Date(year, month + 1, day)
    dates.push({
      date: nextDate.toISOString().split('T')[0],
      day: day,
      hasCourse: false,
      isToday: false,
      isCurrentMonth: false,
      courseTitle: ''
    })
  }
  
  calendarDates.value = dates
}

// 教学资源数据
const teachingResources = ref([
  {
    id: 1,
    name: '湿地生态系统课件',
    type: 'PPT课件',
    icon: '📊',
    usage: 156,
    rating: 4.8
  },
  {
    id: 2,
    name: '智慧农业VR体验',
    type: 'VR资源',
    icon: '🥽',
    usage: 89,
    rating: 4.9
  },
  {
    id: 3,
    name: '环保实验指导书',
    type: '实验手册',
    icon: '📖',
    usage: 234,
    rating: 4.7
  },
  {
    id: 4,
    name: '生态监测设备演示',
    type: '视频教程',
    icon: '🎥',
    usage: 178,
    rating: 4.6
  }
])

// 粒子动画样式
const getParticleStyle = (index: number) => {
  const delay = Math.random() * 20
  const duration = 15 + Math.random() * 10
  const size = 2 + Math.random() * 4
  
  return {
    left: Math.random() * 100 + '%',
    animationDelay: delay + 's',
    animationDuration: duration + 's',
    width: size + 'px',
    height: size + 'px'
  }
}

onMounted(() => {
  // 生成当前月份日历
  generateCalendar()
})

onUnmounted(() => {
  // 页面清理逻辑
})
</script>

<style lang="scss" scoped>
.education-page {
  height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  position: relative;
  overflow: hidden;
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
  background: rgba(74, 144, 226, 0.6);
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
    transform: translateY(-100px) rotate(360deg);
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
    linear-gradient(rgba(74, 144, 226, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74, 144, 226, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 1;
}

.page-main {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 10px;
  flex: 1;
  overflow: hidden;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }
}

.left-section, .right-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow-y: auto;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #4A90E2, #7ED321);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(45deg, #4A90E2, #7ED321);
    border-radius: 2px;
  }
}

.subsection-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #4A90E2;
}

// 研学项目样式
.study-programs {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.programs-grid {
  display: grid;
  gap: 15px;
}

.program-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: #4A90E2;
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.program-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 144, 226, 0.2);
  border-radius: 8px;
}

.program-info {
  flex: 1;
}

.program-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: white;
}

.program-category {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.program-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  
  &.active {
    background: rgba(126, 211, 33, 0.2);
    color: #7ED321;
  }
  
  &.scheduled {
    background: rgba(255, 193, 7, 0.2);
    color: #FFC107;
  }
  
  &.completed {
    background: rgba(74, 144, 226, 0.2);
    color: #4A90E2;
  }
}

.program-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.detail-value {
  font-size: 14px;
  font-weight: bold;
  color: white;
  
  &.satisfaction {
    color: #7ED321;
  }
}

// 教育统计样式
.education-stats {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
}

.stat-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 144, 226, 0.2);
  border-radius: 8px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #4A90E2;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.stat-trend {
  font-size: 11px;
  font-weight: bold;
  
  &.up {
    color: #7ED321;
  }
  
  &.stable {
    color: #FFC107;
  }
}

// 课程安排样式
.course-schedule {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 15px;
  backdrop-filter: blur(10px);
  height: 450px;
  overflow: hidden;
}

.schedule-calendar {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px;
  height: calc(100% - 35px);
  overflow: hidden;
}

.calendar-header {
  margin-bottom: 10px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.nav-btn {
  background: rgba(74, 144, 226, 0.2);
  border: 1px solid rgba(74, 144, 226, 0.3);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(74, 144, 226, 0.4);
  }
}

.current-month {
  font-size: 16px;
  font-weight: bold;
  color: #4A90E2;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-header {
  text-align: center;
  font-size: 11px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  padding: 5px 2px;
}

.calendar-day {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2px;
  height: 50px;
  
  &:hover {
    background: rgba(74, 144, 226, 0.2);
  }
  
  &.today {
    background: rgba(74, 144, 226, 0.3);
    border: 1px solid #4A90E2;
  }
  
  &.has-course {
    background: rgba(126, 211, 33, 0.2);
    border: 1px solid rgba(126, 211, 33, 0.4);
  }
  
  &.other-month {
    opacity: 0.3;
    
    .date-number {
      color: rgba(255, 255, 255, 0.4);
    }
  }
}

.date-number {
  font-size: 10px;
  color: white;
  font-weight: bold;
  margin-bottom: 1px;
}

.course-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  width: 100%;
  
  .course-icon {
    font-size: 12px;
    margin-bottom: 1px;
  }
  
  .course-title {
    font-size: 7px;
    color: #7ED321;
    font-weight: bold;
    text-align: center;
    line-height: 1.1;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

// 教学资源样式
.teaching-resources {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  flex: 1;
  overflow-y: auto;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-item {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(5px);
  }
}

.resource-icon {
  font-size: 20px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 144, 226, 0.2);
  border-radius: 6px;
}

.resource-info {
  flex: 1;
}

.resource-name {
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-bottom: 3px;
}

.resource-type {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.resource-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.usage-count {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.rating {
  font-size: 11px;
  color: #FFC107;
}
</style>