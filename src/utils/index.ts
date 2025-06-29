// 格式化数字，保留指定小数位
export const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals)
}

// 格式化百分比
export const formatPercent = (num: number, decimals: number = 1): string => {
  return `${formatNumber(num, decimals)}%`
}

// 格式化时间
export const formatTime = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 格式化日期
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化日期时间
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date)
  return `${formatDate(d)} ${formatTime(d)}`
}

// 获取当前时间字符串
export const getCurrentTime = (): string => {
  return formatTime(new Date())
}

// 获取当前日期字符串
export const getCurrentDate = (): string => {
  return formatDate(new Date())
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 生成随机ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// 获取状态颜色
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    online: '#2ed573',
    offline: '#ff4757',
    warning: '#ffd700',
    running: '#00d4ff',
    stopped: '#6c7b7f',
    excellent: '#2ed573',
    good: '#00ff88',
    fair: '#ffd700',
    poor: '#ff4757'
  }
  return colorMap[status] || '#6c7b7f'
}

// 获取健康状态文本
export const getHealthText = (health: string): string => {
  const textMap: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return textMap[health] || '未知'
}

// 获取设备状态文本
export const getDeviceStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    online: '在线',
    offline: '离线',
    warning: '警告',
    running: '运行中',
    stopped: '已停止',
    scheduled: '已计划'
  }
  return textMap[status] || '未知'
}

// 计算百分比
export const calculatePercent = (value: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// 生成模拟数据
export const generateMockData = (min: number, max: number, decimals: number = 1): number => {
  const random = Math.random() * (max - min) + min
  return Number(random.toFixed(decimals))
}

// 数组去重
export const uniqueArray = <T>(arr: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(arr)]
  }
  const seen = new Set()
  return arr.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

// 数组分组
export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// 检查是否为移动设备
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// 获取浏览器信息
export const getBrowserInfo = () => {
  const ua = navigator.userAgent
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor)
  const isFirefox = /Firefox/.test(ua)
  const isSafari = /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor)
  const isEdge = /Edg/.test(ua)
  
  return {
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    isMobile: isMobile()
  }
}