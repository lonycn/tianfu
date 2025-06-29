<template>
  <div class="dashboard">
    <!-- 背景动画 -->
    <div class="bg-animation">
      <div 
        v-for="i in 20" 
        :key="i" 
        class="particle" 
        :style="getParticleStyle(i)"
      ></div>
    </div>
    
    <!-- 网格背景 -->
    <div class="grid-bg"></div>
    
    <!-- 头部 -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo">
            <div class="logo-ring"></div>
            <div class="logo-inner">智</div>
          </div>
          <div class="title-group">
            <h1 class="title">智慧湿地监测系统</h1>
            <p class="subtitle">Intelligent Wetland Monitoring System</p>
          </div>
        </div>
        
        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <div 
            v-for="item in menuItems" 
            :key="item.key"
            class="nav-item"
            :class="{ active: activeMenu === item.key }"
            @click="switchMenu(item.key)"
          >
            <component :is="item.icon" class="nav-icon" />
            <span class="nav-text">{{ item.label }}</span>
          </div>
        </nav>
        
        <div class="time-section">
          <div class="current-time">{{ currentTime }}</div>
          <div class="current-date">{{ currentDate }}</div>
          <div class="status-indicator">
            <div class="status-dot"></div>
            <span>系统运行正常</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="dashboard-main">
      <!-- 首页 - 综合监控 -->
      <div v-if="activeMenu === 'home'" class="page-content">
        <div class="grid-layout">
          <DataCard title="环境监测" icon="Monitor" :glow="true">
            <EnvironmentMonitor />
          </DataCard>
          
          <DataCard title="湿地概览" icon="Landscape" size="large" :glow="true">
            <WetlandOverview />
          </DataCard>
          
          <DataCard title="设备状态" icon="Setting" :glow="true">
            <DeviceStatus />
          </DataCard>
          
          <DataCard title="数据概览" icon="DataAnalysis" size="large" :glow="true">
            <DataOverview />
          </DataCard>
          
          <DataCard title="湿地风光" icon="Picture" size="tall" :glow="true">
            <WetlandScenery />
          </DataCard>
        </div>
      </div>
      
      <!-- 环境监测页面 -->
      <div v-else-if="activeMenu === 'environment'" class="page-content">
        <div class="full-width-layout">
          <DataCard title="环境监测详情" icon="Monitor" size="large" :glow="true">
            <EnvironmentMonitor />
          </DataCard>
          <DataCard title="历史数据趋势" icon="TrendCharts" size="large" :glow="true">
            <div class="chart-placeholder">环境数据趋势图表</div>
          </DataCard>
        </div>
      </div>
      
      <!-- 设备管理页面 -->
      <div v-else-if="activeMenu === 'device'" class="page-content">
        <div class="full-width-layout">
          <DataCard title="设备状态监控" icon="Setting" size="large" :glow="true">
            <DeviceStatus />
          </DataCard>
          <DataCard title="设备控制面板" icon="Operation" size="large" :glow="true">
            <div class="chart-placeholder">设备控制界面</div>
          </DataCard>
        </div>
      </div>
      
      <!-- 数据分析页面 -->
      <div v-else-if="activeMenu === 'analysis'" class="page-content">
        <div class="full-width-layout">
          <DataCard title="数据分析" icon="DataAnalysis" size="large" :glow="true">
            <DataOverview />
          </DataCard>
          <DataCard title="智能预测" icon="TrendCharts" size="large" :glow="true">
            <div class="chart-placeholder">AI预测分析</div>
          </DataCard>
        </div>
      </div>
      
      <!-- 系统设置页面 -->
      <div v-else-if="activeMenu === 'settings'" class="page-content">
        <div class="settings-layout">
          <DataCard title="系统配置" icon="Tools" :glow="true">
            <div class="settings-content">
              <div class="setting-item">
                <span class="label">数据刷新间隔</span>
                <span class="value">5秒</span>
              </div>
              <div class="setting-item">
                <span class="label">报警阈值</span>
                <span class="value">自动</span>
              </div>
              <div class="setting-item">
                <span class="label">显示模式</span>
                <span class="value">深色</span>
              </div>
            </div>
          </DataCard>
          
          <DataCard title="用户管理" icon="User" :glow="true">
            <div class="settings-content">
              <div class="setting-item">
                <span class="label">当前用户</span>
                <span class="value">管理员</span>
              </div>
              <div class="setting-item">
                <span class="label">权限级别</span>
                <span class="value">超级管理员</span>
              </div>
              <div class="setting-item">
                <span class="label">登录时间</span>
                <span class="value">{{ currentDate }}</span>
              </div>
            </div>
          </DataCard>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DataCard from '@/components/DataCard.vue'
import EnvironmentMonitor from '@/components/EnvironmentMonitor.vue'
import WetlandOverview from '@/components/WetlandOverview.vue'
import DeviceStatus from '@/components/DeviceStatus.vue'
import DataOverview from '@/components/DataOverview.vue'
import WetlandScenery from '@/components/WetlandScenery.vue'

// 图标组件（这里使用字符串，实际项目中可以导入具体的图标组件）
const Monitor = 'div'
const Landscape = 'div'
const Setting = 'div'
const DataAnalysis = 'div'
const TrendCharts = 'div'
const Operation = 'div'
const Tools = 'div'
const User = 'div'
const Picture = 'div'

const currentTime = ref('')
const currentDate = ref('')
const activeMenu = ref('home')

// 菜单配置
const menuItems = ref([
  { key: 'home', label: '综合监控', icon: 'Monitor' },
  { key: 'environment', label: '环境监测', icon: 'Landscape' },
  { key: 'device', label: '设备管理', icon: 'Setting' },
  { key: 'analysis', label: '数据分析', icon: 'DataAnalysis' },
  { key: 'settings', label: '系统设置', icon: 'Tools' }
])

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const animationDuration = Math.random() * 3 + 2
  const animationDelay = Math.random() * 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

const switchMenu = (menuKey: string) => {
  activeMenu.value = menuKey
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped lang="scss">
// 样式已在全局样式文件中定义
</style>