<template>
  <div class="wetland-scenery">
    <!-- 场景切换按钮 -->
    <div class="scene-controls">
      <button 
        v-for="scene in scenes" 
        :key="scene.id"
        class="scene-btn"
        :class="{ active: currentScene === scene.id }"
        @click="switchScene(scene.id)"
      >
        {{ scene.name }}
      </button>
    </div>
    
    <!-- 场景展示区域 -->
    <div class="scene-display">
      <div class="scene-image" :style="{ backgroundImage: `url(${currentSceneData.image})` }">
        <!-- 实时数据覆盖层 -->
        <div class="data-overlay">
          <div class="overlay-item" v-for="item in currentSceneData.dataPoints" :key="item.id" 
               :style="{ left: item.x + '%', top: item.y + '%' }">
            <div class="data-point" :class="item.type">
              <div class="point-icon">{{ item.icon }}</div>
              <div class="point-tooltip">
                <div class="tooltip-title">{{ item.label }}</div>
                <div class="tooltip-value">{{ item.value }}{{ item.unit }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 场景描述 -->
        <div class="scene-description">
          <h4>{{ currentSceneData.title }}</h4>
          <p>{{ currentSceneData.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- 实时监控数据 -->
    <div class="monitoring-panel">
      <div class="panel-title">实时监控</div>
      <div class="monitoring-grid">
        <div class="monitor-item" v-for="monitor in monitoringData" :key="monitor.id">
          <div class="monitor-icon" :style="{ color: monitor.color }">{{ monitor.icon }}</div>
          <div class="monitor-content">
            <div class="monitor-label">{{ monitor.label }}</div>
            <div class="monitor-value">{{ monitor.value }}{{ monitor.unit }}</div>
            <div class="monitor-status" :class="monitor.status">{{ getStatusText(monitor.status) }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 天气信息 -->
    <div class="weather-info">
      <div class="weather-current">
        <div class="weather-icon">☀️</div>
        <div class="weather-temp">{{ weather.temperature }}°C</div>
        <div class="weather-desc">{{ weather.description }}</div>
      </div>
      <div class="weather-details">
        <div class="weather-item">
          <span class="label">湿度:</span>
          <span class="value">{{ weather.humidity }}%</span>
        </div>
        <div class="weather-item">
          <span class="label">风速:</span>
          <span class="value">{{ weather.windSpeed }}m/s</span>
        </div>
        <div class="weather-item">
          <span class="label">气压:</span>
          <span class="value">{{ weather.pressure }}hPa</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRealTimeData } from '@/composables/useRealTime'
import { generateMockData, getDeviceStatusText } from '@/utils'

const { realTimeData } = useRealTimeData()

// 当前场景
const currentScene = ref(1)

// 场景数据
const scenes = ref([
  { id: 1, name: '全景视图' },
  { id: 2, name: '种植区域' },
  { id: 3, name: '水域生态' },
  { id: 4, name: '设施设备' }
])

// 场景详细数据
const sceneData = computed(() => ({
  1: {
    title: '天福湿地公园全景',
    description: '占地面积约500亩的现代化智慧湿地公园，集生态保护、科研教育、观光旅游于一体',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InNreSIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4N0NFRUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNBREQ4RTYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0idXJsKCNza3kpIi8+PHJlY3QgeT0iMTUwIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzJENUEyRCIvPjxlbGxpcHNlIGN4PSIzMDAiIGN5PSIyMDAiIHJ4PSI4MCIgcnk9IjQwIiBmaWxsPSIjNEY5NENEIi8+PHJlY3QgeD0iNTAiIHk9IjEyMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzM0NjgzNCIvPjxyZWN0IHg9IjI1MCIgeT0iMTAwIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IiNGRkE1MDAiLz48dGV4dCB4PSIyMDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5aSp56aP5rmv5Zyw5YWs5Zut5YWo5pmv</dGV4dD48L3N2Zz4=',
    dataPoints: [
      { id: 1, x: 25, y: 40, type: 'temperature', icon: '🌡️', label: '温度监测', value: realTimeData.value?.temperature || 0, unit: '°C' },
      { id: 2, x: 75, y: 60, type: 'humidity', icon: '💧', label: '湿度监测', value: realTimeData.value?.humidity || 0, unit: '%' },
      { id: 3, x: 60, y: 80, type: 'soil', icon: '🌱', label: '土壤监测', value: realTimeData.value?.soilMoisture || 0, unit: '%' }
    ]
  },
  2: {
    title: '智慧种植区域',
    description: '采用物联网技术的现代化种植区，实现精准农业管理',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJENUEyRCIvPjxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0Njg0NDYiIHN0cm9rZT0iIzAwRkY1NiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMjIwIiB5PSI1MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0Njg0NDYiIHN0cm9rZT0iIzAwRkY1NiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMjAiIHk9IjE4MCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0Njg0NDYiIHN0cm9rZT0iIzAwRkY1NiIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI1IiBmaWxsPSIjMDBENEZGIi8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iMTAwIiByPSI1IiBmaWxsPSIjMDBENEZGIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMjMwIiByPSI1IiBmaWxsPSIjMDBENEZGIi8+PC9zdmc+',
    dataPoints: [
      { id: 1, x: 25, y: 35, type: 'crop', icon: '🌾', label: '水稻区', value: '85.2', unit: '%产量' },
      { id: 2, x: 75, y: 35, type: 'crop', icon: '🥬', label: '蔬菜区', value: '92.1', unit: '%产量' },
      { id: 3, x: 50, y: 75, type: 'crop', icon: '🍎', label: '果树区', value: '78.9', unit: '%产量' }
    ]
  },
  3: {
    title: '湿地水域生态',
    description: '天然湿地水域，维护生态平衡，提供优质水源',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9IndhdGVyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0RjlEQ0QiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyMDZBOEEiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCN3YXRlcikiLz48ZWxsaXBzZSBjeD0iMTAwIiBjeT0iMTAwIiByeD0iNDAiIHJ5PSIyMCIgZmlsbD0iIzAwRkY4OCIgb3BhY2l0eT0iMC4zIi8+PGVsbGlwc2UgY3g9IjMwMCIgY3k9IjIwMCIgcng9IjYwIiByeT0iMzAiIGZpbGw9IiMwMEZGODgiIG9wYWNpdHk9IjAuMyIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iMyIgZmlsbD0iIzAwRDRGRiIvPjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMyIgZmlsbD0iIzAwRDRGRiIvPjxjaXJjbGUgY3g9IjI1MCIgY3k9IjIwMCIgcj0iMyIgZmlsbD0iIzAwRDRGRiIvPjwvc3ZnPg==',
    dataPoints: [
      { id: 1, x: 50, y: 50, type: 'water', icon: '🌊', label: '水质监测', value: '7.2', unit: 'pH' },
      { id: 2, x: 25, y: 35, type: 'ecology', icon: '🐟', label: '生态指数', value: '优', unit: '' },
      { id: 3, x: 75, y: 65, type: 'oxygen', icon: '💨', label: '溶氧量', value: '8.5', unit: 'mg/L' }
    ]
  },
  4: {
    title: '智能设施设备',
    description: '现代化的监控和管理设备，确保系统高效运行',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFBMjMzMiIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkY2QjM1IiBzdHJva2U9IiNGRkE1MDAiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHg9IjI3MCIgeT0iNTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI0ZGNkIzNSIgc3Ryb2tlPSIjRkZBNTAwIiBzdHJva2Utd2lkdGg9IjIiLz48cmVjdCB4PSIxNjAiIHk9IjE4MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkY2QjM1IiBzdHJva2U9IiNGRkE1MDAiIHN0cm9rZS13aWR0aD0iMiIvPjxjaXJjbGUgY3g9IjkwIiBjeT0iODAiIHI9IjUiIGZpbGw9IiMwMEQ0RkYiLz48Y2lyY2xlIGN4PSIzMTAiIGN5PSI4MCIgcj0iNSIgZmlsbD0iIzAwRDRGRiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIxMCIgcj0iNSIgZmlsbD0iIzAwRDRGRiIvPjwvc3ZnPg==',
    dataPoints: [
      { id: 1, x: 22, y: 35, type: 'device', icon: '📹', label: '监控摄像', value: '30', unit: '台在线' },
      { id: 2, x: 78, y: 35, type: 'device', icon: '💧', label: '灌溉系统', value: '8', unit: '台运行' },
      { id: 3, x: 50, y: 75, type: 'device', icon: '🔧', label: '控制中心', value: '正常', unit: '' }
    ]
  }
}))

// 当前场景数据
const currentSceneData = computed(() => sceneData.value[currentScene.value])

// 监控数据
const monitoringData = computed(() => [
  { id: 1, icon: '🌡️', label: '温度', value: realTimeData.value?.temperature || 0, unit: '°C', status: 'normal', color: '#00d4ff' },
  { id: 2, icon: '💧', label: '湿度', value: realTimeData.value?.humidity || 0, unit: '%', status: 'normal', color: '#00ff88' },
  { id: 3, icon: '🌱', label: '土壤', value: realTimeData.value?.soilMoisture || 0, unit: '%', status: 'good', color: '#ffd700' },
  { id: 4, icon: '💨', label: '风速', value: realTimeData.value?.windSpeed || 0, unit: 'm/s', status: 'normal', color: '#ff6b35' }
])

// 天气信息
const weather = ref({
  temperature: 25,
  description: '晴朗',
  humidity: 65,
  windSpeed: 2.3,
  pressure: 1013
})

// 切换场景
const switchScene = (sceneId: number) => {
  currentScene.value = sceneId
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    normal: '正常',
    good: '良好',
    warning: '警告',
    error: '异常'
  }
  return statusMap[status] || '未知'
}

// 更新监控数据
const updateMonitoringData = () => {
  monitoringData.value.forEach(item => {
    switch (item.id) {
      case 1:
        item.value = realTimeData.value.temperature
        break
      case 2:
        item.value = realTimeData.value.humidity
        break
      case 3:
        item.value = realTimeData.value.soilMoisture
        break
      case 4:
        item.value = realTimeData.value.windSpeed
        break
    }
  })
}

// 定时更新数据
onMounted(() => {
  setInterval(() => {
    updateMonitoringData()
    // 更新天气数据
    weather.value.temperature = generateMockData(20, 30, 0)
    weather.value.humidity = generateMockData(50, 80, 0)
    weather.value.windSpeed = generateMockData(1, 5, 1)
  }, 10000)
})
</script>

<style scoped lang="scss">
.wetland-scenery {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.scene-controls {
  display: flex;
  gap: 8px;
  
  .scene-btn {
    flex: 1;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid $border-secondary;
    border-radius: 6px;
    color: $text-secondary;
    font-size: $font-size-xs;
    cursor: pointer;
    transition: all $transition-normal ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      color: $text-primary;
    }
    
    &.active {
      background: rgba(0, 212, 255, 0.2);
      border-color: $primary-color;
      color: $primary-color;
    }
  }
}

.scene-display {
  flex: 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  
  .scene-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    
    .data-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      
      .overlay-item {
        position: absolute;
        
        .data-point {
          position: relative;
          cursor: pointer;
          
          .point-icon {
            width: 24px;
            height: 24px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid $primary-color;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            animation: pulse 2s infinite;
          }
          
          .point-tooltip {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(26, 35, 50, 0.95);
            border: 1px solid $border-primary;
            border-radius: 4px;
            padding: 6px 8px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all $transition-normal ease;
            z-index: 10;
            
            .tooltip-title {
              font-size: $font-size-xs;
              color: $text-secondary;
              margin-bottom: 2px;
            }
            
            .tooltip-value {
              font-size: $font-size-sm;
              color: $text-primary;
              font-weight: 600;
            }
          }
          
          &:hover .point-tooltip {
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
    
    .scene-description {
      position: absolute;
      bottom: 15px;
      left: 15px;
      right: 15px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 6px;
      padding: 10px;
      
      h4 {
        margin: 0 0 5px 0;
        font-size: $font-size-sm;
        color: $text-primary;
      }
      
      p {
        margin: 0;
        font-size: $font-size-xs;
        color: $text-secondary;
        line-height: 1.4;
      }
    }
  }
}

.monitoring-panel {
  .panel-title {
    font-size: $font-size-sm;
    color: $text-primary;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .monitoring-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .monitor-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    
    .monitor-icon {
      font-size: 16px;
    }
    
    .monitor-content {
      flex: 1;
      
      .monitor-label {
        font-size: $font-size-xs;
        color: $text-secondary;
        line-height: 1;
      }
      
      .monitor-value {
        font-size: $font-size-sm;
        color: $text-primary;
        font-weight: 600;
        line-height: 1;
        margin: 2px 0;
      }
      
      .monitor-status {
        font-size: $font-size-xs;
        line-height: 1;
        
        &.normal {
          color: $success-color;
        }
        
        &.good {
          color: $secondary-color;
        }
        
        &.warning {
          color: $warning-color;
        }
        
        &.error {
          color: $danger-color;
        }
      }
    }
  }
}

.weather-info {
  display: flex;
  gap: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  
  .weather-current {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .weather-icon {
      font-size: 20px;
    }
    
    .weather-temp {
      font-size: $font-size-lg;
      font-weight: bold;
      color: $text-primary;
    }
    
    .weather-desc {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
  }
  
  .weather-details {
    flex: 1;
    display: flex;
    justify-content: space-around;
    
    .weather-item {
      text-align: center;
      
      .label {
        display: block;
        font-size: $font-size-xs;
        color: $text-secondary;
        margin-bottom: 2px;
      }
      
      .value {
        font-size: $font-size-sm;
        color: $text-primary;
        font-weight: 500;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@media (max-width: $breakpoint-md) {
  .monitoring-grid {
    grid-template-columns: 1fr;
  }
  
  .weather-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .weather-details {
    justify-content: space-between;
  }
}
</style>