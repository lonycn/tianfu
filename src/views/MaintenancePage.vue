<template>
  <dv-full-screen-container>
    <div class="maintenance-page">
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
      <UnifiedHeader current-page="maintenance" />

      <!-- 主内容 -->
      <main class="page-main">
        <!-- 左侧：系统状态 -->
        <section class="left-section">
          <!-- 系统状态概览 -->
          <div class="system-status">
            <h2 class="section-title">系统运行状态</h2>
            <div class="status-overview">
              <div class="status-card" v-for="status in systemStatus" :key="status.name">
                <div class="status-header">
                  <div class="status-icon" :class="status.state">{{ status.icon }}</div>
                  <div class="status-info">
                    <h3 class="status-name">{{ status.name }}</h3>
                    <p class="status-description">{{ status.description }}</p>
                  </div>
                  <div class="status-indicator" :class="status.state">
                    {{ status.stateText }}
                  </div>
                </div>
                
                <div class="status-metrics">
                  <div class="metric-item">
                    <div class="metric-label">负载</div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="status.load > 80 ? 'critical' : status.load > 60 ? 'warning' : 'normal'"
                        :style="{ width: `${status.load}%` }"
                      ></div>
                    </div>
                    <div class="metric-value">{{ status.load }}%</div>
                  </div>
                  <div class="metric-item">
                    <div class="metric-label">内存</div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="status.memory > 80 ? 'critical' : status.memory > 60 ? 'warning' : 'normal'"
                        :style="{ width: `${status.memory}%` }"
                      ></div>
                    </div>
                    <div class="metric-value">{{ status.memory }}%</div>
                  </div>
                  <div class="metric-item">
                    <div class="metric-label">存储</div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="status.storage > 80 ? 'critical' : status.storage > 60 ? 'warning' : 'normal'"
                        :style="{ width: `${status.storage}%` }"
                      ></div>
                    </div>
                    <div class="metric-value">{{ status.storage }}%</div>
                  </div>
                </div>
                
                <div class="status-uptime">
                  <span class="uptime-label">运行时间:</span>
                  <span class="uptime-value">{{ status.uptime }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 告警日志 -->
          <div class="alert-logs">
            <h3 class="subsection-title">系统告警日志</h3>
            <div class="logs-container">
              <div class="log-item" v-for="log in alertLogs" :key="log.id" :class="log.level">
                <div class="log-time">{{ log.time }}</div>
                <div class="log-level" :class="log.level">{{ log.levelText }}</div>
                <div class="log-message">{{ log.message }}</div>
                <div class="log-source">{{ log.source }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 右侧：维护任务 -->
        <section class="right-section">
          <!-- 维护任务 -->
          <div class="maintenance-tasks">
            <h2 class="section-title">维护任务</h2>
            <div class="tasks-list">
              <div class="task-item" v-for="task in maintenanceTasks" :key="task.id">
                <div class="task-header">
                  <div class="task-icon" :class="task.priority">{{ task.icon }}</div>
                  <div class="task-info">
                    <h3 class="task-title">{{ task.title }}</h3>
                    <p class="task-details">
                      <span class="task-id">#{{ task.id }}</span>
                      <span class="task-assignee">{{ task.assignee }}</span>
                      <span class="task-due">{{ task.dueDate }}</span>
                    </p>
                  </div>
                  <div class="task-status" :class="task.status">{{ task.statusText }}</div>
                </div>
                
                <div class="task-description">{{ task.description }}</div>
                
                <div class="task-progress">
                  <div class="progress-label">进度: {{ task.progress }}%</div>
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :class="task.status"
                      :style="{ width: `${task.progress}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 系统资源监控 -->
          <div class="system-resources">
            <h3 class="subsection-title">系统资源监控</h3>
            <div class="resources-grid">
              <div class="resource-card" v-for="resource in systemResources" :key="resource.name">
                <div class="resource-header">
                  <div class="resource-icon">{{ resource.icon }}</div>
                  <div class="resource-name">{{ resource.name }}</div>
                  <div class="resource-value" :class="resource.status">{{ resource.value }}</div>
                </div>
                
                <div class="resource-chart">
                  <div class="chart-placeholder">
                    <!-- 这里可以放置实际的图表组件 -->
                    <div class="chart-line" :style="{ height: `${resource.chartHeight}px` }"></div>
                  </div>
                </div>
                
                <div class="resource-stats">
                  <div class="stat-item">
                    <span class="stat-label">峰值:</span>
                    <span class="stat-value">{{ resource.peak }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">平均:</span>
                    <span class="stat-value">{{ resource.average }}</span>
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

// 系统状态数据
const systemStatus = ref([
  {
    name: '主控服务器',
    description: '核心数据处理与应用服务',
    icon: '🖥️',
    state: 'normal',
    stateText: '正常',
    load: 45,
    memory: 62,
    storage: 58,
    uptime: '32天 14小时 27分钟'
  },
  {
    name: '数据采集节点',
    description: '传感器数据采集与预处理',
    icon: '📡',
    state: 'warning',
    stateText: '注意',
    load: 78,
    memory: 83,
    storage: 45,
    uptime: '15天 6小时 12分钟'
  },
  {
    name: '备份存储系统',
    description: '数据备份与灾备恢复',
    icon: '💾',
    state: 'normal',
    stateText: '正常',
    load: 25,
    memory: 40,
    storage: 72,
    uptime: '45天 8小时 53分钟'
  }
])

// 告警日志数据
const alertLogs = ref([
  {
    id: 'ALT-2024-1205',
    time: '2024-12-05 14:23:45',
    level: 'warning',
    levelText: '警告',
    message: '数据采集节点内存使用率超过80%',
    source: '系统监控'
  },
  {
    id: 'ALT-2024-1204',
    time: '2024-12-04 08:12:33',
    level: 'error',
    levelText: '错误',
    message: '传感器节点#SN-45连接中断',
    source: '设备管理'
  },
  {
    id: 'ALT-2024-1203',
    time: '2024-12-03 22:45:12',
    level: 'info',
    levelText: '信息',
    message: '系统自动备份完成',
    source: '备份系统'
  },
  {
    id: 'ALT-2024-1202',
    time: '2024-12-02 16:37:28',
    level: 'warning',
    levelText: '警告',
    message: '数据库查询性能下降',
    source: '性能监控'
  }
])

// 维护任务数据
const maintenanceTasks = ref([
  {
    id: 'MT-2024-089',
    title: '传感器网络升级',
    description: '升级所有环境监测传感器固件至v2.5.3版本，提升数据采集精度和传输稳定性',
    icon: '🔄',
    assignee: '张工程师',
    dueDate: '2024-12-15',
    status: 'in-progress',
    statusText: '进行中',
    progress: 65,
    priority: 'high'
  },
  {
    id: 'MT-2024-090',
    title: '数据库优化',
    description: '优化时序数据库索引结构，提升查询效率，解决高峰期查询延迟问题',
    icon: '📊',
    assignee: '李数据',
    dueDate: '2024-12-12',
    status: 'pending',
    statusText: '待处理',
    progress: 0,
    priority: 'medium'
  },
  {
    id: 'MT-2024-088',
    title: '备份系统扩容',
    description: '扩展备份存储系统容量至8TB，配置增量备份策略，优化备份效率',
    icon: '💾',
    assignee: '王运维',
    dueDate: '2024-12-08',
    status: 'completed',
    statusText: '已完成',
    progress: 100,
    priority: 'normal'
  }
])

// 系统资源监控数据
const systemResources = ref([
  {
    name: 'CPU使用率',
    icon: '⚙️',
    value: '45%',
    status: 'normal',
    peak: '78%',
    average: '42%',
    chartHeight: 35
  },
  {
    name: '内存使用',
    icon: '🧠',
    value: '62%',
    status: 'warning',
    peak: '85%',
    average: '58%',
    chartHeight: 55
  },
  {
    name: '网络流量',
    icon: '🌐',
    value: '28MB/s',
    status: 'normal',
    peak: '45MB/s',
    average: '22MB/s',
    chartHeight: 25
  },
  {
    name: '存储空间',
    icon: '💽',
    value: '72%',
    status: 'warning',
    peak: '75%',
    average: '65%',
    chartHeight: 65
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
  // 页面初始化逻辑
})

onUnmounted(() => {
  // 页面清理逻辑
})
</script>

<style lang="scss" scoped>
.maintenance-page {
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
  padding: 20px;
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

// 系统状态样式
.system-status {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.status-overview {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-card {
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

.status-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.status-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  
  &.normal {
    background: rgba(126, 211, 33, 0.2);
  }
  
  &.warning {
    background: rgba(255, 193, 7, 0.2);
  }
  
  &.critical {
    background: rgba(255, 59, 48, 0.2);
  }
}

.status-info {
  flex: 1;
}

.status-name {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: white;
}

.status-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.status-indicator {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  
  &.normal {
    background: rgba(126, 211, 33, 0.2);
    color: #7ED321;
  }
  
  &.warning {
    background: rgba(255, 193, 7, 0.2);
    color: #FFC107;
  }
  
  &.critical {
    background: rgba(255, 59, 48, 0.2);
    color: #FF3B30;
  }
}

.status-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metric-label {
  width: 40px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  
  &.normal {
    background: linear-gradient(90deg, #7ED321, #B8E986);
  }
  
  &.warning {
    background: linear-gradient(90deg, #FFC107, #FFE082);
  }
  
  &.critical {
    background: linear-gradient(90deg, #FF3B30, #FF8A80);
  }
}

.metric-value {
  width: 40px;
  font-size: 12px;
  font-weight: bold;
  text-align: right;
}

.status-uptime {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  
  .uptime-value {
    font-weight: bold;
    color: #4A90E2;
  }
}

// 告警日志样式
.alert-logs {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.logs-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 144, 226, 0.5);
    border-radius: 3px;
  }
}

.log-item {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 10px;
  padding: 10px;
  border-radius: 6px;
  align-items: center;
  
  &.info {
    background: rgba(74, 144, 226, 0.1);
    border-left: 3px solid #4A90E2;
  }
  
  &.warning {
    background: rgba(255, 193, 7, 0.1);
    border-left: 3px solid #FFC107;
  }
  
  &.error {
    background: rgba(255, 59, 48, 0.1);
    border-left: 3px solid #FF3B30;
  }
}

.log-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.log-level {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  
  &.info {
    background: rgba(74, 144, 226, 0.2);
    color: #4A90E2;
  }
  
  &.warning {
    background: rgba(255, 193, 7, 0.2);
    color: #FFC107;
  }
  
  &.error {
    background: rgba(255, 59, 48, 0.2);
    color: #FF3B30;
  }
}

.log-message {
  font-size: 12px;
  color: white;
}

.log-source {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

// 维护任务样式
.maintenance-tasks {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
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

.task-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.task-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  
  &.high {
    background: rgba(255, 59, 48, 0.2);
  }
  
  &.medium {
    background: rgba(255, 193, 7, 0.2);
  }
  
  &.normal {
    background: rgba(74, 144, 226, 0.2);
  }
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: white;
}

.task-details {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  display: flex;
  gap: 10px;
}

.task-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  
  &.completed {
    background: rgba(126, 211, 33, 0.2);
    color: #7ED321;
  }
  
  &.in-progress {
    background: rgba(74, 144, 226, 0.2);
    color: #4A90E2;
  }
  
  &.pending {
    background: rgba(255, 193, 7, 0.2);
    color: #FFC107;
  }
}

.task-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  line-height: 1.5;
}

.task-progress {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.progress-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: space-between;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  
  &.completed {
    background: linear-gradient(90deg, #7ED321, #B8E986);
  }
  
  &.in-progress {
    background: linear-gradient(90deg, #4A90E2, #5AC8FA);
  }
  
  &.pending {
    background: linear-gradient(90deg, #FFC107, #FFE082);
  }
}

// 系统资源监控样式
.system-resources {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  
  @media (max-width: 1400px) {
    grid-template-columns: 1fr;
  }
}

.resource-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(74, 144, 226, 0.2);
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.resource-icon {
  font-size: 16px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 144, 226, 0.2);
  border-radius: 6px;
}

.resource-name {
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
}

.resource-value {
  font-size: 14px;
  font-weight: bold;
  
  &.normal {
    color: #7ED321;
  }
  
  &.warning {
    color: #FFC107;
  }
  
  &.critical {
    color: #FF3B30;
  }
}

.resource-chart {
  margin-bottom: 10px;
}

.chart-placeholder {
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  
  .chart-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(180deg, rgba(74, 144, 226, 0.8) 0%, rgba(74, 144, 226, 0.2) 100%);
    border-radius: 2px 2px 0 0;
  }
}

.resource-stats {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  font-size: 12px;
  
  .stat-label {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .stat-value {
    color: #4A90E2;
    font-weight: bold;
  }
}
</style>