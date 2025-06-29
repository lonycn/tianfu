import { ref, onMounted, onUnmounted } from 'vue'
import { useMainStore } from '@/stores'
import { generateMockData, getCurrentTime, getCurrentDate } from '@/utils'
import type { RealTimeData } from '@/types'

// 实时数据更新组合式函数
export const useRealTimeData = () => {
  const store = useMainStore()
  let timer: NodeJS.Timeout | null = null

  // 模拟实时数据更新
  const updateData = () => {
    const newData: Partial<RealTimeData> = {
      temperature: generateMockData(20, 35, 1),
      humidity: generateMockData(40, 80, 1),
      soilMoisture: generateMockData(30, 70, 1),
      lightIntensity: generateMockData(800, 1500, 0),
      ph: generateMockData(6.0, 7.5, 1),
      co2: generateMockData(380, 450, 0),
      windSpeed: generateMockData(0, 5, 1),
      rainfall: generateMockData(0, 10, 1)
    }
    store.updateRealTimeData(newData)
  }

  // 开始实时更新
  const startRealTimeUpdate = (interval: number = 5000) => {
    updateData() // 立即更新一次
    timer = setInterval(updateData, interval)
  }

  // 停止实时更新
  const stopRealTimeUpdate = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    startRealTimeUpdate()
  })

  onUnmounted(() => {
    stopRealTimeUpdate()
  })

  return {
    realTimeData: store.realTimeData,
    startRealTimeUpdate,
    stopRealTimeUpdate,
    updateData
  }
}

// 时间显示组合式函数
export const useCurrentTime = () => {
  const currentTime = ref(getCurrentTime())
  const currentDate = ref(getCurrentDate())
  let timer: NodeJS.Timeout | null = null

  const updateTime = () => {
    currentTime.value = getCurrentTime()
    currentDate.value = getCurrentDate()
  }

  const startTimeUpdate = () => {
    timer = setInterval(updateTime, 1000)
  }

  const stopTimeUpdate = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    startTimeUpdate()
  })

  onUnmounted(() => {
    stopTimeUpdate()
  })

  return {
    currentTime,
    currentDate,
    startTimeUpdate,
    stopTimeUpdate
  }
}

// 设备状态监控组合式函数
export const useDeviceMonitor = () => {
  const store = useMainStore()
  let timer: NodeJS.Timeout | null = null

  // 模拟设备状态变化
  const updateDeviceStatus = () => {
    const sensors = store.deviceStatus.sensors
    const irrigation = store.deviceStatus.irrigation
    const cameras = store.deviceStatus.cameras

    // 随机改变一些设备状态
    const newStatus = {
      sensors: {
        ...sensors,
        online: Math.max(sensors.total - 20, sensors.online + generateMockData(-2, 2, 0)),
        offline: sensors.total - sensors.online
      },
      irrigation: {
        ...irrigation,
        running: Math.max(0, Math.min(irrigation.total, irrigation.running + generateMockData(-1, 1, 0))),
        stopped: irrigation.total - irrigation.running
      },
      cameras: {
        ...cameras,
        online: Math.max(cameras.total - 5, cameras.online + generateMockData(-1, 1, 0)),
        offline: cameras.total - cameras.online
      }
    }

    store.updateDeviceStatus(newStatus)
  }

  const startDeviceMonitor = (interval: number = 10000) => {
    timer = setInterval(updateDeviceStatus, interval)
  }

  const stopDeviceMonitor = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    startDeviceMonitor()
  })

  onUnmounted(() => {
    stopDeviceMonitor()
  })

  return {
    deviceStatus: store.deviceStatus,
    startDeviceMonitor,
    stopDeviceMonitor,
    updateDeviceStatus
  }
}