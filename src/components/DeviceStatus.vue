<template>
  <div class="device-status">
    <!-- 传感器状态 -->
    <div class="device-group">
      <div class="group-header">
        <h4>传感器设备</h4>
        <StatusIndicator 
          :status="getSensorStatus()" 
          :text="`${deviceStatus.sensors.online}/${deviceStatus.sensors.total}`"
        />
      </div>
      <div class="device-stats">
        <div class="stat-item online">
          <span class="count">{{ deviceStatus.sensors.online }}</span>
          <span class="label">在线</span>
        </div>
        <div class="stat-item offline">
          <span class="count">{{ deviceStatus.sensors.offline }}</span>
          <span class="label">离线</span>
        </div>
      </div>
    </div>

    <!-- 灌溉系统状态 -->
    <div class="device-group">
      <div class="group-header">
        <h4>灌溉系统</h4>
        <StatusIndicator 
          :status="getIrrigationStatus()" 
          :text="`${deviceStatus.irrigation.running}/${deviceStatus.irrigation.total}`"
        />
      </div>
      <div class="device-stats">
        <div class="stat-item running">
          <span class="count">{{ deviceStatus.irrigation.running }}</span>
          <span class="label">运行</span>
        </div>
        <div class="stat-item stopped">
          <span class="count">{{ deviceStatus.irrigation.stopped }}</span>
          <span class="label">停止</span>
        </div>
      </div>
    </div>

    <!-- 监控摄像头状态 -->
    <div class="device-group">
      <div class="group-header">
        <h4>监控摄像头</h4>
        <StatusIndicator 
          :status="getCameraStatus()" 
          :text="`${deviceStatus.cameras.online}/${deviceStatus.cameras.total}`"
        />
      </div>
      <div class="device-stats">
        <div class="stat-item online">
          <span class="count">{{ deviceStatus.cameras.online }}</span>
          <span class="label">在线</span>
        </div>
        <div class="stat-item offline">
          <span class="count">{{ deviceStatus.cameras.offline }}</span>
          <span class="label">离线</span>
        </div>
      </div>
    </div>

    <!-- 系统健康度 -->
    <div class="system-health">
      <div class="health-title">系统健康度</div>
      <div class="health-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: systemHealth + '%' }"
          ></div>
        </div>
        <div class="health-value">{{ systemHealth }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDeviceMonitor } from '@/composables/useRealTime'
import StatusIndicator from '@/components/StatusIndicator.vue'

// 使用设备监控
const { deviceStatus } = useDeviceMonitor()

// 计算传感器状态
const getSensorStatus = () => {
  if (!deviceStatus.value?.sensors) return 'offline'
  const { online, total } = deviceStatus.value.sensors
  const ratio = online / total
  if (ratio >= 0.9) return 'online'
  if (ratio >= 0.7) return 'warning'
  return 'offline'
}

// 计算灌溉系统状态
const getIrrigationStatus = () => {
  if (!deviceStatus.value?.irrigation) return 'stopped'
  const { running, total } = deviceStatus.value.irrigation
  const ratio = running / total
  if (ratio >= 0.3) return 'running'
  return 'stopped'
}

// 计算摄像头状态
const getCameraStatus = () => {
  if (!deviceStatus.value?.cameras) return 'offline'
  const { online, total } = deviceStatus.value.cameras
  const ratio = online / total
  if (ratio >= 0.9) return 'online'
  if (ratio >= 0.7) return 'warning'
  return 'offline'
}

// 计算系统健康度
const systemHealth = computed(() => {
  if (!deviceStatus.value?.sensors || !deviceStatus.value?.irrigation || !deviceStatus.value?.cameras) return 0
  const sensors = deviceStatus.value.sensors
  const irrigation = deviceStatus.value.irrigation
  const cameras = deviceStatus.value.cameras
  
  const sensorHealth = (sensors.online / sensors.total) * 100
  const irrigationHealth = ((irrigation.total - irrigation.stopped) / irrigation.total) * 100
  const cameraHealth = (cameras.online / cameras.total) * 100
  
  return Math.round((sensorHealth + irrigationHealth + cameraHealth) / 3)
})
</script>

<style scoped lang="scss">
.device-status {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.device-group {
  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    h4 {
      font-size: $font-size-base;
      color: $text-primary;
      margin: 0;
    }
  }
  
  .device-stats {
    display: flex;
    gap: 15px;
  }
  
  .stat-item {
    flex: 1;
    text-align: center;
    padding: 10px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    
    .count {
      display: block;
      font-size: $font-size-lg;
      font-weight: bold;
      margin-bottom: 2px;
    }
    
    .label {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
    
    &.online .count {
      color: $success-color;
    }
    
    &.offline .count {
      color: $danger-color;
    }
    
    &.running .count {
      color: $primary-color;
    }
    
    &.stopped .count {
      color: $text-muted;
    }
  }
}

.system-health {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid $border-secondary;
  
  .health-title {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: 10px;
  }
  
  .health-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $success-color, $primary-color);
        border-radius: 4px;
        transition: width $transition-normal ease;
      }
    }
    
    .health-value {
      font-size: $font-size-sm;
      font-weight: 600;
      color: $text-primary;
      min-width: 35px;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .device-stats {
    flex-direction: column;
    gap: 8px;
  }
}
</style>