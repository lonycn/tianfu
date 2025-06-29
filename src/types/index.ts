// 实时数据类型
export interface RealTimeData {
  temperature: number      // 温度 (°C)
  humidity: number         // 湿度 (%)
  soilMoisture: number     // 土壤湿度 (%)
  lightIntensity: number   // 光照强度 (lux)
  ph: number              // pH值
  co2: number             // CO2浓度 (ppm)
  windSpeed: number       // 风速 (m/s)
  rainfall: number        // 降雨量 (mm)
}

// 设备状态类型
export interface DeviceStatus {
  sensors: {
    total: number
    online: number
    offline: number
  }
  irrigation: {
    total: number
    running: number
    stopped: number
  }
  cameras: {
    total: number
    online: number
    offline: number
  }
}

// 种植区域类型
export interface PlantingArea {
  id: number
  name: string
  area: number            // 面积 (亩)
  cropType: string        // 作物类型
  growthStage: string     // 生长阶段
  health: 'excellent' | 'good' | 'fair' | 'poor'  // 健康状态
  yield: number           // 产量预测 (%)
}

// 传感器数据类型
export interface SensorData {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'soil' | 'light' | 'ph' | 'co2'
  value: number
  unit: string
  status: 'online' | 'offline' | 'warning'
  location: {
    x: number
    y: number
  }
  lastUpdate: string
}

// 灌溉系统类型
export interface IrrigationSystem {
  id: string
  name: string
  zone: string
  status: 'running' | 'stopped' | 'scheduled'
  flowRate: number        // 流量 (L/min)
  duration: number        // 持续时间 (min)
  schedule: {
    startTime: string
    endTime: string
    frequency: string
  }
}

// 监控摄像头类型
export interface Camera {
  id: string
  name: string
  location: string
  status: 'online' | 'offline'
  streamUrl: string
  position: {
    x: number
    y: number
    rotation: number
  }
}

// 天气数据类型
export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  pressure: number
  visibility: number
  uvIndex: number
  forecast: {
    date: string
    weather: string
    tempHigh: number
    tempLow: number
    humidity: number
    rainfall: number
  }[]
}

// 产量数据类型
export interface YieldData {
  areaId: number
  cropType: string
  plantingDate: string
  expectedHarvest: string
  currentYield: number
  predictedYield: number
  qualityGrade: 'A' | 'B' | 'C'
  marketPrice: number
}

// 告警信息类型
export interface AlertInfo {
  id: string
  type: 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  source: string
  resolved: boolean
  priority: 'high' | 'medium' | 'low'
}

// 图表数据类型
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
  }[]
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 分页数据类型
export interface PaginationData<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 地图标记类型
export interface MapMarker {
  id: string
  type: 'sensor' | 'irrigation' | 'camera' | 'area'
  position: [number, number]  // [lng, lat]
  title: string
  description?: string
  status?: string
  data?: any
}

// 系统配置类型
export interface SystemConfig {
  refreshInterval: number     // 数据刷新间隔 (秒)
  alertThresholds: {
    temperature: { min: number; max: number }
    humidity: { min: number; max: number }
    soilMoisture: { min: number; max: number }
    ph: { min: number; max: number }
  }
  displaySettings: {
    theme: 'dark' | 'light'
    language: 'zh' | 'en'
    timezone: string
  }
}