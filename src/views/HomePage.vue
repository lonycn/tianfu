<template>
  <dv-full-screen-container>
    <div class="homepage">
      <!-- 高德地图背景 -->
      <div ref="mapContainer" class="map-container"></div>
      
      <!-- 遮罩层 -->
      <div class="map-overlay"></div>
    
    <!-- 页面头部 -->
    <UnifiedHeader />

    <!-- 主内容 -->
    <main class="homepage-main">
      <!-- 左侧悬浮区域 -->
      <section class="left-floating-section">
        <!-- 项目概况 -->
        <dv-border-box-8 class="floating-card project-overview" :color="['#4fd2dd', '#235fa7']">
          <h3 class="section-title">项目概况</h3>
          <div class="project-content">
            <div class="project-title">
              <h4>天福国家湿地公园智慧管理平台</h4>
            </div>
            <div class="project-description">
              <p>天福国家湿地公园位于江苏省昆山市，总面积779.54公顷，是集生态保护、农业种植、科普研学于一体的国家级湿地公园。</p>
              <p>平台通过<strong>AI+物联网技术</strong>，构建种植、监测、分析、展示为一体的智慧农业示范区。</p>
            </div>
            <div class="project-features">
              <div class="feature-item">
                <span class="feature-icon">🌐</span>
                <span class="feature-text">物联网感知</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🤖</span>
                <span class="feature-text">AI智能分析</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span class="feature-text">数据可视化</span>
              </div>
            </div>
          </div>
        </dv-border-box-8>
        
        <dv-border-box-8 class="floating-card wetland-overview" :color="['#4fd2dd', '#235fa7']">
          <h3 class="section-title">湿地概览</h3>
          <div class="overview-content">
            <div ref="wetlandChart" class="wetland-chart"></div>
          </div>
        </dv-border-box-8>
        
        <!-- 功能区划图 -->
        <dv-border-box-8 class="floating-card zone-map" :color="['#4fd2dd', '#235fa7']">
          <h3 class="section-title">功能区划图</h3>
          <div ref="zoneChart" class="zone-chart"></div>
        </dv-border-box-8>
      </section>

      <!-- 右侧悬浮区域 -->
      <section class="right-floating-section">
        <dv-border-box-8 class="floating-card data-overview" :color="['#4fd2dd', '#235fa7']">
          <h3 class="section-title">数据总览</h3>
          
          <!-- 核心指标 -->
          <div class="key-metrics">
            <div class="metric-card">
              <div class="metric-icon">📊</div>
              <div class="metric-content">
                <div class="metric-value">{{ deviceStats.online }}</div>
                <div class="metric-label">设备在线</div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">🌡️</div>
              <div class="metric-content">
                <div class="metric-value">{{ environmentData.temperature }}°C</div>
                <div class="metric-label">当前温度</div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">💧</div>
              <div class="metric-content">
                <div class="metric-value">{{ environmentData.humidity }}%</div>
                <div class="metric-label">空气湿度</div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-icon">🦅</div>
              <div class="metric-content">
                <div class="metric-value">235</div>
                <div class="metric-label">鸟类种类</div>
              </div>
            </div>
          </div>
          
          <!-- 系统状态 -->
          <div class="system-status">
            <h3 class="status-title">系统运行状态</h3>
            <div class="status-grid">
              <div class="status-item">
                <div class="status-indicator online"></div>
                <span>物联网网关</span>
                <span class="status-text">正常</span>
              </div>
              <div class="status-item">
                <div class="status-indicator online"></div>
                <span>数据采集</span>
                <span class="status-text">正常</span>
              </div>
              <div class="status-item">
                <div class="status-indicator online"></div>
                <span>AI分析</span>
                <span class="status-text">正常</span>
              </div>
              <div class="status-item">
                <div class="status-indicator warning"></div>
                <span>预警系统</span>
                <span class="status-text">待机</span>
              </div>
            </div>
          </div>
          
        </dv-border-box-8>
        
        <!-- 实时环境数据图表 -->
        <dv-border-box-8 class="floating-card environment-chart" :color="['#4fd2dd', '#235fa7']">
          <h3 class="section-title">24小时环境趋势</h3>
          <div class="chart-container">
            <div ref="environmentChart" class="environment-chart"></div>
          </div>
        </dv-border-box-8>
      </section>
    </main>

    <!-- 底部：地图导航标记点 -->
    <footer class="homepage-footer">
      <div class="quick-nav">
        <div class="nav-item" @click="focusMapLocation('seedling-factory')">
          <div class="nav-icon">🏭</div>
          <span>育秧工厂</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('rice-field')">
          <div class="nav-icon">🌾</div>
          <span>水稻田</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('orchard')">
          <div class="nav-icon">🍎</div>
          <span>果园</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('greenhouse')">
          <div class="nav-icon">🏠</div>
          <span>大棚</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('bird-monitoring')">
          <div class="nav-icon">🦅</div>
          <span>鸟类监测点</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('water-quality')">
          <div class="nav-icon">💧</div>
          <span>河道水质点</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('cold-storage')">
          <div class="nav-icon">❄️</div>
          <span>冷库</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('farm-machinery')">
          <div class="nav-icon">🚜</div>
          <span>农机</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('wetland-education')">
          <div class="nav-icon">🎓</div>
          <span>湿地宣教区</span>
        </div>
        <div class="nav-item" @click="focusMapLocation('bird-watching')">
          <div class="nav-icon">🔭</div>
          <span>观鸟区</span>
        </div>
      </div>
    </footer>
     </div>
   </dv-full-screen-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onActivated, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import UnifiedHeader from '@/components/UnifiedHeader.vue'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()
const currentDate = ref('')

// 地图相关
const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<any>(null)
const AMap = ref<any>(null)
const chartCanvas = ref<HTMLCanvasElement | null>(null)

// ECharts相关
const zoneChart = ref<HTMLDivElement | null>(null)
const wetlandChart = ref<HTMLDivElement | null>(null)
const environmentChart = ref<HTMLDivElement | null>(null)
let zoneChartInstance: echarts.ECharts | null = null
let wetlandChartInstance: echarts.ECharts | null = null
let environmentChartInstance: echarts.ECharts | null = null

// 初始化高德地图
const initMap = async () => {
  try {
    const amap = await AMapLoader.load({
      key: 'b7997390caeb35723dd42e55c1c3da51', // 需要替换为实际的高德地图API Key
      version: '2.0',
      plugins: ['AMap.Scale']
    })
    
    AMap.value = amap
    
    // 创建地图实例 - 天福国家湿地公园位置
    map.value = new amap.Map(mapContainer.value, {
      viewMode: '2D',
      zoom: 15,
      center: [120.9853, 31.2891], // 天福湿地公园大概位置（江苏昆山）
      mapStyle: 'amap://styles/blue', // 使用蓝色主题
      showLabel: true, // 显示地图标注
      showRoad: true, // 显示道路
      showBuilding: true, // 显示建筑
      features: ['bg', 'road', 'building', 'point'] // 显示背景、道路、建筑、兴趣点
    })
    
    // 添加比例尺控件
    map.value.addControl(new amap.Scale())
    
    // 添加工具栏控件到左下角
    map.value.addControl(new amap.ToolBar({
      position: {
        bottom: '20px',
        left: '20px'
      }
    }))
    
  } catch (error) {
    console.error('地图加载失败:', error)
  }
}

// 模拟数据
const deviceStats = ref({
  online: 24,
  total: 26,
  offline: 2
})

const environmentData = ref({
  temperature: 22.5,
  humidity: 68,
  airQuality: '优',
  windSpeed: 2.3
})

const getParticleStyle = (index: number) => {
  const size = Math.random() * 3 + 1
  const left = Math.random() * 100
  const animationDuration = Math.random() * 4 + 3
  const animationDelay = Math.random() * 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

// 地图标记点位置定义
const mapLocations = {
  'seedling-factory': { lng: 120.9298, lat: 31.3889, name: '育秧工厂' },
  'rice-field': { lng: 120.9320, lat: 31.3870, name: '水稻田' },
  'orchard': { lng: 120.9280, lat: 31.3900, name: '果园' },
  'greenhouse': { lng: 120.9310, lat: 31.3880, name: '大棚' },
  'bird-monitoring': { lng: 120.9290, lat: 31.3910, name: '鸟类监测点' },
  'water-quality': { lng: 120.9330, lat: 31.3860, name: '河道水质点' },
  'cold-storage': { lng: 120.9270, lat: 31.3890, name: '冷库' },
  'farm-machinery': { lng: 120.9300, lat: 31.3875, name: '农机' },
  'wetland-education': { lng: 120.9285, lat: 31.3895, name: '湿地宣教区' },
  'bird-watching': { lng: 120.9315, lat: 31.3885, name: '观鸟区' }
}

// 地图标记点聚焦功能
const focusMapLocation = (locationKey: keyof typeof mapLocations) => {
  if (!map.value || !AMap.value) {
    console.warn('地图未初始化')
    return
  }
  
  const location = mapLocations[locationKey]
  if (!location) {
    console.warn('未找到指定位置:', locationKey)
    return
  }
  
  if (!map.value || !AMap.value) {
    console.warn('地图未初始化')
    return
  }
  
  // 设置地图中心点和缩放级别
  map.value.setZoomAndCenter(16, [location.lng, location.lat])
  
  // 清除之前的标记点
  map.value.clearMap()
  
  // 添加标记点
  const marker = new AMap.value.Marker({
    position: [location.lng, location.lat],
    title: location.name,
    icon: new AMap.value.Icon({
      size: new AMap.value.Size(32, 32),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
    })
  })
  
  // 添加新标记点
  map.value.add(marker)
  
  // 添加信息窗体
  const infoWindow = new AMap.value.InfoWindow({
    content: `<div style="padding: 10px;"><h4>${location.name}</h4><p>经度: ${location.lng}</p><p>纬度: ${location.lat}</p></div>`,
    offset: new AMap.value.Pixel(0, -30)
  })
  
  // 点击标记点显示信息窗体
  marker.on('click', () => {
    infoWindow.open(map.value, marker.getPosition())
  })
  
  // 自动显示信息窗体
  setTimeout(() => {
    infoWindow.open(map.value, marker.getPosition())
  }, 500)
}

const drawChart = () => {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return
  
  // 清空画布
  ctx.clearRect(0, 0, 300, 150)
  
  // 绘制简单的温度趋势线
  ctx.strokeStyle = '#4A90E2'
  ctx.lineWidth = 2
  ctx.beginPath()
  
  const data = [20, 21, 22, 23, 22.5, 22, 21.5, 22.5] // 模拟24小时数据
  const stepX = 300 / (data.length - 1)
  
  data.forEach((temp, index) => {
    const x = index * stepX
    const y = 150 - ((temp - 18) / 8) * 150 // 归一化到画布高度
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.stroke()
}

// 初始化功能区划图 - 简化版本
const initZoneChart = () => {
  nextTick(() => {
    if (!zoneChart.value) return
    
    // 销毁已存在的实例
    if (zoneChartInstance) {
      zoneChartInstance.dispose()
      zoneChartInstance = null
    }
    
    try {
      // 创建ECharts实例
      zoneChartInstance = echarts.init(zoneChart.value)
      
      // 简化的图表配置
      const option = {
        backgroundColor: 'transparent',
        title: {
          text: '功能区划分布',
          left: 'center',
          top: 10,
          textStyle: {
            color: '#ffffff',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}公顷 ({d}%)'
        },
        legend: {
          bottom: 5,
          textStyle: {
            color: '#ffffff',
            fontSize: 10
          }
        },
        series: [{
          name: '功能区域',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: [
            { value: 312.5, name: '湿地核心区', itemStyle: { color: '#4A90E2' } },
            { value: 234.3, name: '农业种植区', itemStyle: { color: '#7ED321' } },
            { value: 156.2, name: '科普教育区', itemStyle: { color: '#F5A623' } },
            { value: 76.5, name: '管理服务区', itemStyle: { color: '#BD10E0' } }
          ],
          label: {
            show: false
          }
        }]
      }
      
      zoneChartInstance.setOption(option)
      
      // 窗口大小变化时重新调整
      const resizeHandler = () => {
        if (zoneChartInstance) {
          zoneChartInstance.resize()
        }
      }
      window.addEventListener('resize', resizeHandler)
      
    } catch (error) {
      console.error('功能区图表初始化失败:', error)
    }
  })
}

// 初始化湿地概览图表
const initWetlandChart = () => {
  if (!wetlandChart.value) {
    console.warn('湿地图表容器未找到')
    return
  }
  
  // 检查容器尺寸
  const rect = wetlandChart.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    console.warn('湿地图表容器尺寸为0，延迟重试')
    setTimeout(() => initWetlandChart(), 200)
    return
  }
  
  // 销毁已存在的实例
  if (wetlandChartInstance) {
    wetlandChartInstance.dispose()
  }
  
  // 创建新的ECharts实例
  wetlandChartInstance = echarts.init(wetlandChart.value)
  
  // 湿地数据
  const wetlandData = [
    { name: '总面积', value: 1200, unit: '公顷' },
    { name: '水域面积', value: 800, unit: '公顷' },
    { name: '植被覆盖率', value: 85, unit: '%' },
    { name: '鸟类种数', value: 156, unit: '种' }
  ]
  
  // 图表配置
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '湿地生态指标',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4A90E2',
      textStyle: {
        color: '#ffffff'
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '25%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: wetlandData.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: '#4A90E2'
        }
      },
      axisLabel: {
        color: '#ffffff',
        fontSize: 10,
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#4A90E2'
        }
      },
      axisLabel: {
        color: '#ffffff',
        fontSize: 10
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(74, 144, 226, 0.3)'
        }
      }
    },
    series: [
      {
        name: '湿地指标',
        type: 'bar',
        data: wetlandData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: ['#4A90E2', '#7ED321', '#F5A623', '#BD10E0'][index]
          }
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          color: '#ffffff',
          fontSize: 10,
          formatter: (params: any) => {
            const data = wetlandData[params.dataIndex]
            return `${params.value}${data.unit}`
          }
        }
      }
    ]
  }
  
  // 设置图表配置
  wetlandChartInstance.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    if (wetlandChartInstance) {
      wetlandChartInstance.resize()
    }
  })
}

// 初始化环境趋势图表
const initEnvironmentChart = () => {
  if (!environmentChart.value) {
    console.warn('环境图表容器未找到')
    return
  }
  
  // 检查容器尺寸
  const rect = environmentChart.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) {
    console.warn('环境图表容器尺寸为0，延迟重试')
    setTimeout(() => initEnvironmentChart(), 200)
    return
  }
  
  // 销毁已存在的实例
  if (environmentChartInstance) {
    environmentChartInstance.dispose()
  }
  
  // 创建新的ECharts实例
  environmentChartInstance = echarts.init(environmentChart.value)
  
  // 24小时数据
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const temperatureData = [18, 17, 16, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 31, 29, 27, 25, 23, 21, 20, 19, 18, 17, 16]
  const lightData = [0, 0, 0, 0, 0, 10, 30, 50, 70, 85, 95, 100, 100, 95, 85, 70, 50, 30, 10, 5, 0, 0, 0, 0]
  const precipitationData = [0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 8, 12, 15, 10, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0]
  
  // 图表配置
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '24小时环境监测',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4A90E2',
      textStyle: {
        color: '#ffffff'
      }
    },
    legend: {
      data: ['气温(°C)', '光照强度(%)', '降水量(mm)'],
      top: 35,
      textStyle: {
        color: '#ffffff',
        fontSize: 10
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '25%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: {
        lineStyle: {
          color: '#4A90E2'
        }
      },
      axisLabel: {
        color: '#ffffff',
        fontSize: 9,
        interval: 3
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '气温/光照',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#4A90E2'
          }
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: 9
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(74, 144, 226, 0.3)'
          }
        }
      },
      {
        type: 'value',
        name: '降水量',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#7ED321'
          }
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: 9
        }
      }
    ],
    series: [
      {
        name: '气温(°C)',
        type: 'line',
        data: temperatureData,
        smooth: true,
        lineStyle: {
          color: '#F5A623',
          width: 2
        },
        itemStyle: {
          color: '#F5A623'
        },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: '光照强度(%)',
        type: 'line',
        data: lightData,
        smooth: true,
        lineStyle: {
          color: '#4A90E2',
          width: 2
        },
        itemStyle: {
          color: '#4A90E2'
        },
        symbol: 'circle',
        symbolSize: 4
      },
      {
        name: '降水量(mm)',
        type: 'line',
        yAxisIndex: 1,
        data: precipitationData,
        smooth: true,
        lineStyle: {
          color: '#7ED321',
          width: 2
        },
        itemStyle: {
          color: '#7ED321'
        },
        symbol: 'circle',
        symbolSize: 4
      }
    ]
  }
  
  // 设置图表配置
  environmentChartInstance.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    if (environmentChartInstance) {
      environmentChartInstance.resize()
    }
  })
}

onMounted(async () => {
  // 页面初始化逻辑
  await nextTick()
  initMap()
  drawChart()
  
  // 延迟初始化图表，确保容器已渲染
  setTimeout(() => {
    initWetlandChart()
    initEnvironmentChart()
    initZoneChart()
  }, 500)
})

// 当从其他页面返回首页时重新初始化
onActivated(async () => {
  await nextTick()
  if (!map.value && mapContainer.value) {
    initMap()
  }
  if (!zoneChartInstance && zoneChart.value) {
    initZoneChart()
  }
  if (!wetlandChartInstance && wetlandChart.value) {
    initWetlandChart()
  }
  if (!environmentChartInstance && environmentChart.value) {
    initEnvironmentChart()
  }
})

// 监听路由变化，确保在首页时地图正常显示
watch(() => route.path, async (newPath) => {
  if (newPath === '/' && mapContainer.value && !map.value) {
    await nextTick()
    setTimeout(() => {
      initMap()
    }, 200)
  }
})

// 窗口大小变化时重新调整图表尺寸
const handleResize = () => {
  if (zoneChartInstance) {
    zoneChartInstance.resize()
  }
  if (wetlandChartInstance) {
    wetlandChartInstance.resize()
  }
  if (environmentChartInstance) {
    environmentChartInstance.resize()
  }
}

// 添加窗口大小变化监听
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
  
  // 页面清理逻辑
  if (map.value) {
    map.value.destroy()
    map.value = null
  }
  if (zoneChartInstance) {
    zoneChartInstance.dispose()
    zoneChartInstance = null
  }
  if (wetlandChartInstance) {
    wetlandChartInstance.dispose()
    wetlandChartInstance = null
  }
  if (environmentChartInstance) {
    environmentChartInstance.dispose()
    environmentChartInstance = null
  }
})
</script>

<style scoped lang="scss">
.homepage {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, #0c1426 0%, #1a2332 50%, #0c1426 100%);
  color: #ffffff;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 地图容器 */
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 地图遮罩层 */
.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 20, 40, 0.3);
  z-index: 2;
  pointer-events: none;
}



// 头部样式现在由UnifiedHeader组件处理

// 主内容
.homepage-main {
  position: relative;
  z-index: 10;
  display: flex;
  padding: 20px;
  gap: 20px;
  flex: 1;
  overflow: hidden;
  pointer-events: none;
}

.homepage-main > * {
  pointer-events: auto;
}

.left-floating-section {
  position: absolute;
  left: 20px;
  top: 10px;
  width: 500px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  z-index: 15;
  align-items: stretch;
  padding-bottom: 20px;
}

.right-floating-section {
  position: absolute;
  right: 20px;
  top: 10px;
  width: 480px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  z-index: 15;
  align-items: stretch;
  padding-bottom: 20px;
}

/* 悬浮卡片样式 */
.floating-card {
    background: rgba(15, 25, 45, 0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(64, 158, 255, 0.3);
    border-radius: 16px;
    padding: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    height: fit-content;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    
    &:hover {
      transform: translateY(-4px);
      background: rgba(15, 25, 45, 0.85);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
      border-color: rgba(64, 158, 255, 0.5);
    }
  }

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #4A90E2;
  border-left: 4px solid #4A90E2;
  padding-left: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
  flex-shrink: 0;
}

// 湿地概况
.wetland-overview {
  background: rgba(15, 25, 45, 0.75);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(15, 25, 45, 0.85);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    border-color: rgba(64, 158, 255, 0.5);
  }
}

/* 超宽屏适配 */
  @media (min-width: 2560px) {
    .left-floating-section {
      width: 720px;
    }
    
    .right-floating-section {
      width: 600px;
    }
    
    .floating-card {
      padding: 28px;
    }
    
    .section-title {
      font-size: 20px;
    }
  }
  
  /* 中等宽屏适配 */
  @media (max-width: 1920px) {
    .left-floating-section {
      width: 500px;
    }
    
    .right-floating-section {
      width: 450px;
    }
  }
  
  /* 小屏幕适配 */
  @media (max-width: 1366px) {
    .left-floating-section {
      width: 450px;
    }
    
    .right-floating-section {
      width: 350px;
    }
  }

.overview-content {
  display: flex;
  gap: 30px;
}

.park-info {
  flex: 1;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(74, 144, 226, 0.2);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      color: rgba(255, 255, 255, 0.7);
    }
    
    .value {
      color: #4A90E2;
      font-weight: bold;
    }
  }
}

.zone-map {
  background: rgba(15, 25, 45, 0.75);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  height: 300px;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(15, 25, 45, 0.85);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    border-color: rgba(74, 144, 226, 0.5);
  }
  
  .zone-chart {
    width: 100%;
    height: 200px;
    background: transparent;
    margin-top: 10px;
  }
}

// 发展理念
.development-concept {
  background: rgba(15, 25, 45, 0.75);
  border: 1px solid rgba(126, 211, 33, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(15, 25, 45, 0.85);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    border-color: rgba(126, 211, 33, 0.5);
  }
}

.concept-title {
  font-size: 18px;
  font-weight: 600;
  color: #7ED321;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.concept-items {
  display: flex;
  justify-content: space-around;
  
  .concept-item {
    text-align: center;
    
    .concept-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    span {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
    }
  }
}

// 数据总览
.data-overview {
  background: rgba(15, 25, 45, 0.75);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(15, 25, 45, 0.85);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
    border-color: rgba(74, 144, 226, 0.5);
  }
}

.key-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.metric-card {
  background: rgba(12, 20, 38, 0.7);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4A90E2;
    box-shadow: 0 4px 20px rgba(74, 144, 226, 0.4);
    transform: translateY(-2px);
    background: rgba(12, 20, 38, 0.8);
  }
  
  .metric-icon {
    font-size: 28px;
    color: #4A90E2;
  }
  
  .metric-content {
    .metric-value {
      font-size: 22px;
      font-weight: 700;
      color: #4A90E2;
    }
    
    .metric-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

// 系统状态
.system-status {
  margin-bottom: 30px;
  
  .status-title {
    font-size: 16px;
    color: #7ED321;
    margin-bottom: 15px;
  }
  
  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    background: rgba(12, 20, 38, 0.4);
    border-radius: 5px;
    font-size: 12px;
    
    .status-indicator {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      
      &.online {
        background: #7ED321;
      }
      
      &.warning {
        background: #F5A623;
      }
      
      &.offline {
        background: #D0021B;
      }
    }
    
    .status-text {
      margin-left: auto;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

// 项目概况样式
.project-overview {
  .project-content {
    .project-title {
      margin-bottom: 10px;
      
      h4 {
        color: #4A90E2;
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        line-height: 1.4;
      }
    }
    
    .project-description {
      margin-bottom: 15px;
      
      p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        line-height: 1.5;
        margin: 0;
        
        strong {
          color: #7ED321;
        }
      }
    }
    
    .project-features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      
      .feature-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        background: rgba(12, 20, 38, 0.4);
        border-radius: 5px;
        font-size: 11px;
        
        .feature-icon {
          font-size: 14px;
        }
        
        .feature-text {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
}

// 湿地概览图表
.wetland-overview {
  .wetland-chart {
    width: 100%;
    height: 200px;
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
  }
}

// 环境图表
.environment-chart {
  flex: 1;
  
  .chart-title {
    font-size: 16px;
    color: #4A90E2;
    margin-bottom: 15px;
  }
  
  .chart-container {
    background: rgba(12, 20, 38, 0.4);
    border-radius: 8px;
    padding: 15px;
    
    .environment-chart {
      width: 100%;
      height: 180px;
    }
  }
}

// 底部导航 - 改为悬浮窗居中
.homepage-footer {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  justify-content: center;
  pointer-events: none;
  
  .quick-nav {
    pointer-events: auto;
  }
}

.quick-nav {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  background: rgba(15, 25, 45, 0.85);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  padding: 8px 12px;
  max-width: 900px;
  width: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  gap: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(15, 25, 45, 0.95);
    border-color: rgba(64, 158, 255, 0.5);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 6px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 65px;
    max-width: 85px;
    
    &:hover {
      background: rgba(74, 144, 226, 0.2);
      transform: translateY(-2px);
    }
    
    .nav-icon {
      font-size: 20px;
    }
    
    span {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.8);
      text-align: center;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .nav-item {
      min-width: 60px;
      max-width: 80px;
      padding: 10px 6px;
      
      .nav-icon {
        font-size: 18px;
      }
      
      span {
        font-size: 9px;
      }
    }
  }
}
</style>