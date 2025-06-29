import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 主数据存储
export const useMainStore = defineStore('main', () => {
  // 实时数据
  const realTimeData = ref({
    temperature: 25.6,
    humidity: 68.2,
    soilMoisture: 45.8,
    lightIntensity: 1200,
    ph: 6.8,
    co2: 420,
    windSpeed: 2.3,
    rainfall: 0
  })

  // 设备状态
  const deviceStatus = ref({
    sensors: {
      total: 156,
      online: 142,
      offline: 14
    },
    irrigation: {
      total: 24,
      running: 8,
      stopped: 16
    },
    cameras: {
      total: 32,
      online: 30,
      offline: 2
    }
  })

  // 种植区域数据
  const plantingAreas = ref([
    {
      id: 1,
      name: '水稻种植区A',
      area: 120.5,
      cropType: '水稻',
      growthStage: '抽穗期',
      health: 'good',
      yield: 85.2
    },
    {
      id: 2,
      name: '蔬菜种植区B',
      area: 85.3,
      cropType: '蔬菜',
      growthStage: '成熟期',
      health: 'excellent',
      yield: 92.1
    },
    {
      id: 3,
      name: '果树种植区C',
      area: 200.8,
      cropType: '果树',
      growthStage: '开花期',
      health: 'good',
      yield: 78.9
    }
  ])

  // 计算属性
  const totalArea = computed(() => {
    return plantingAreas.value.reduce((sum, area) => sum + area.area, 0)
  })

  const averageYield = computed(() => {
    const total = plantingAreas.value.reduce((sum, area) => sum + area.yield, 0)
    return total / plantingAreas.value.length
  })

  // 更新实时数据
  const updateRealTimeData = (data: Partial<typeof realTimeData.value>) => {
    Object.assign(realTimeData.value, data)
  }

  // 更新设备状态
  const updateDeviceStatus = (data: Partial<typeof deviceStatus.value>) => {
    Object.assign(deviceStatus.value, data)
  }

  return {
    realTimeData,
    deviceStatus,
    plantingAreas,
    totalArea,
    averageYield,
    updateRealTimeData,
    updateDeviceStatus
  }
})