<template>
  <div class="environment-monitor">
    <div class="monitor-grid">
      <DataItem
        label="温度"
        :value="realTimeData.temperature"
        unit="°C"
        type="number"
        :status="getTemperatureStatus(realTimeData.temperature)"
      />
      <DataItem
        label="湿度"
        :value="realTimeData.humidity"
        unit="%"
        type="number"
        :status="getHumidityStatus(realTimeData.humidity)"
      />
      <DataItem
        label="土壤湿度"
        :value="realTimeData.soilMoisture"
        unit="%"
        type="number"
        :status="getSoilMoistureStatus(realTimeData.soilMoisture)"
      />
      <DataItem
        label="光照强度"
        :value="realTimeData.lightIntensity"
        unit="lux"
        type="number"
        :decimals="0"
      />
      <DataItem
        label="pH值"
        :value="realTimeData.ph"
        type="number"
        :status="getPhStatus(realTimeData.ph)"
      />
      <DataItem
        label="CO₂浓度"
        :value="realTimeData.co2"
        unit="ppm"
        type="number"
        :decimals="0"
      />
      <DataItem
        label="风速"
        :value="realTimeData.windSpeed"
        unit="m/s"
        type="number"
      />
      <DataItem
        label="降雨量"
        :value="realTimeData.rainfall"
        unit="mm"
        type="number"
      />
    </div>
    
    <!-- 环境质量指示器 -->
    <div class="quality-indicator">
      <div class="quality-item">
        <div class="quality-label">空气质量</div>
        <div class="quality-value excellent">优</div>
      </div>
      <div class="quality-item">
        <div class="quality-label">土壤质量</div>
        <div class="quality-value good">良</div>
      </div>
      <div class="quality-item">
        <div class="quality-label">水质状况</div>
        <div class="quality-value excellent">优</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRealTimeData } from '@/composables/useRealTime'
import DataItem from '@/components/DataItem.vue'

// 使用实时数据
const { realTimeData } = useRealTimeData()

// 温度状态判断
const getTemperatureStatus = (temp: number) => {
  if (temp < 15 || temp > 35) return 'danger'
  if (temp < 20 || temp > 30) return 'warning'
  return 'success'
}

// 湿度状态判断
const getHumidityStatus = (humidity: number) => {
  if (humidity < 40 || humidity > 80) return 'danger'
  if (humidity < 50 || humidity > 70) return 'warning'
  return 'success'
}

// 土壤湿度状态判断
const getSoilMoistureStatus = (moisture: number) => {
  if (moisture < 30 || moisture > 80) return 'danger'
  if (moisture < 40 || moisture > 70) return 'warning'
  return 'success'
}

// pH值状态判断
const getPhStatus = (ph: number) => {
  if (ph < 6.0 || ph > 8.0) return 'danger'
  if (ph < 6.5 || ph > 7.5) return 'warning'
  return 'success'
}
</script>

<style scoped lang="scss">
.environment-monitor {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.monitor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  flex: 1;
}

.quality-indicator {
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-top: 1px solid $border-secondary;
}

.quality-item {
  text-align: center;
  
  .quality-label {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-bottom: 5px;
  }
  
  .quality-value {
    font-size: $font-size-lg;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 15px;
    
    &.excellent {
      color: $success-color;
      background: rgba(46, 213, 115, 0.2);
    }
    
    &.good {
      color: $secondary-color;
      background: rgba(0, 255, 136, 0.2);
    }
    
    &.fair {
      color: $warning-color;
      background: rgba(255, 215, 0, 0.2);
    }
    
    &.poor {
      color: $danger-color;
      background: rgba(255, 71, 87, 0.2);
    }
  }
}

@media (max-width: $breakpoint-md) {
  .monitor-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .quality-indicator {
    flex-direction: column;
    gap: 10px;
  }
}
</style>