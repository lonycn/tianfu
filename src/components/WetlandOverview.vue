<template>
  <div class="wetland-overview">
    <!-- 地图容器 -->
    <div class="map-container" ref="mapContainer">
      <div class="map-placeholder">
        <div class="map-bg">
          <!-- 模拟湿地区域 -->
          <div class="wetland-area area-1" @click="selectArea(1)" :class="{ active: selectedArea === 1 }">
            <div class="area-label">水稻种植区A</div>
            <div class="area-sensors">
              <div class="sensor-dot" v-for="i in 8" :key="i"></div>
            </div>
          </div>
          
          <div class="wetland-area area-2" @click="selectArea(2)" :class="{ active: selectedArea === 2 }">
            <div class="area-label">蔬菜种植区B</div>
            <div class="area-sensors">
              <div class="sensor-dot" v-for="i in 6" :key="i"></div>
            </div>
          </div>
          
          <div class="wetland-area area-3" @click="selectArea(3)" :class="{ active: selectedArea === 3 }">
            <div class="area-label">果树种植区C</div>
            <div class="area-sensors">
              <div class="sensor-dot" v-for="i in 10" :key="i"></div>
            </div>
          </div>
          
          <!-- 水域 -->
          <div class="water-area">
            <div class="water-label">湿地水域</div>
          </div>
          
          <!-- 建筑物 -->
          <div class="building control-center">
            <div class="building-label">控制中心</div>
          </div>
          
          <div class="building weather-station">
            <div class="building-label">气象站</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 区域信息面板 -->
    <div class="area-info-panel" v-if="selectedAreaInfo">
      <div class="panel-header">
        <h4>{{ selectedAreaInfo.name }}</h4>
        <button class="close-btn" @click="selectedArea = null">×</button>
      </div>
      <div class="panel-content">
        <div class="info-row">
          <span class="label">面积:</span>
          <span class="value">{{ selectedAreaInfo.area }} 亩</span>
        </div>
        <div class="info-row">
          <span class="label">作物类型:</span>
          <span class="value">{{ selectedAreaInfo.cropType }}</span>
        </div>
        <div class="info-row">
          <span class="label">生长阶段:</span>
          <span class="value">{{ selectedAreaInfo.growthStage }}</span>
        </div>
        <div class="info-row">
          <span class="label">健康状态:</span>
          <span class="value" :class="selectedAreaInfo.health">{{ getHealthText(selectedAreaInfo.health) }}</span>
        </div>
        <div class="info-row">
          <span class="label">产量预测:</span>
          <span class="value">{{ selectedAreaInfo.yield }}%</span>
        </div>
      </div>
    </div>
    
    <!-- 图例 -->
    <div class="map-legend">
      <div class="legend-item">
        <div class="legend-color sensor"></div>
        <span>传感器</span>
      </div>
      <div class="legend-item">
        <div class="legend-color planting"></div>
        <span>种植区</span>
      </div>
      <div class="legend-item">
        <div class="legend-color water"></div>
        <span>水域</span>
      </div>
      <div class="legend-item">
        <div class="legend-color building"></div>
        <span>建筑</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from '@/stores'
import { getHealthText } from '@/utils'

const store = useMainStore()
const selectedArea = ref<number | null>(null)

// 选中区域信息
const selectedAreaInfo = computed(() => {
  if (!selectedArea.value) return null
  return store.plantingAreas.find(area => area.id === selectedArea.value)
})

// 选择区域
const selectArea = (areaId: number) => {
  selectedArea.value = selectedArea.value === areaId ? null : areaId
}
</script>

<style scoped lang="scss">
.wetland-overview {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a4b3a 0%, #2d5a4a 50%, #1a4b3a 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 30% 40%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(0, 212, 255, 0.1) 0%, transparent 50%);
  }
}

.wetland-area {
  position: absolute;
  border: 2px solid rgba(0, 255, 136, 0.6);
  border-radius: 8px;
  background: rgba(0, 255, 136, 0.1);
  cursor: pointer;
  transition: all $transition-normal ease;
  
  &:hover {
    border-color: rgba(0, 255, 136, 0.8);
    background: rgba(0, 255, 136, 0.2);
    transform: scale(1.02);
  }
  
  &.active {
    border-color: $primary-color;
    background: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
  }
  
  .area-label {
    position: absolute;
    top: 5px;
    left: 5px;
    font-size: $font-size-xs;
    color: $text-primary;
    background: rgba(0, 0, 0, 0.6);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }
  
  .area-sensors {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    align-items: center;
  }
  
  .sensor-dot {
    width: 6px;
    height: 6px;
    background: $primary-color;
    border-radius: 50%;
    box-shadow: 0 0 6px $primary-color;
    animation: pulse 2s infinite;
  }
}

.area-1 {
  top: 15%;
  left: 10%;
  width: 35%;
  height: 30%;
}

.area-2 {
  top: 15%;
  right: 15%;
  width: 25%;
  height: 25%;
}

.area-3 {
  bottom: 20%;
  left: 15%;
  width: 40%;
  height: 35%;
}

.water-area {
  position: absolute;
  top: 50%;
  right: 10%;
  width: 30%;
  height: 40%;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 150, 255, 0.2));
  border: 2px solid rgba(0, 212, 255, 0.6);
  border-radius: 50%;
  
  .water-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: $font-size-xs;
    color: $primary-color;
    text-align: center;
  }
}

.building {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(255, 107, 53, 0.8);
  border: 2px solid $accent-color;
  border-radius: 4px;
  
  .building-label {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: $font-size-xs;
    color: $text-primary;
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.6);
    padding: 2px 4px;
    border-radius: 2px;
  }
}

.control-center {
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.weather-station {
  bottom: 10%;
  right: 20%;
}

.area-info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
  background: rgba(26, 35, 50, 0.95);
  border: 1px solid $border-primary;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  z-index: 10;
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid $border-secondary;
    
    h4 {
      margin: 0;
      font-size: $font-size-sm;
      color: $text-primary;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: $text-secondary;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        color: $text-primary;
      }
    }
  }
  
  .panel-content {
    padding: 15px;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .label {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
    
    .value {
      font-size: $font-size-xs;
      color: $text-primary;
      font-weight: 500;
      
      &.excellent {
        color: $success-color;
      }
      
      &.good {
        color: $secondary-color;
      }
      
      &.fair {
        color: $warning-color;
      }
      
      &.poor {
        color: $danger-color;
      }
    }
  }
}

.map-legend {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-top: 1px solid $border-secondary;
  margin-top: 10px;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: $font-size-xs;
    color: $text-secondary;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    
    &.sensor {
      background: $primary-color;
      border-radius: 50%;
    }
    
    &.planting {
      background: rgba(0, 255, 136, 0.6);
    }
    
    &.water {
      background: rgba(0, 212, 255, 0.6);
    }
    
    &.building {
      background: $accent-color;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

@media (max-width: $breakpoint-md) {
  .area-info-panel {
    position: static;
    width: 100%;
    margin-top: 10px;
  }
  
  .map-legend {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>