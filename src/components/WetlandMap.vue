<template>
  <div class="wetland-map">
    <!-- 高德地图容器 -->
    <div ref="mapContainer" class="map-container"></div>
    
    <!-- 地图导航标记点 -->
    <div class="map-navigation" v-if="showNavigation">
      <div class="quick-nav">
        <div 
          v-for="(location, key) in mapLocations" 
          :key="key"
          class="nav-item" 
          @click="flyToLocation(key)"
        >
          <div class="nav-icon">
            {{ getLocationEmoji(key) }}
          </div>
          <span>{{ location.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import mapBoundariesData from '@/data/mapBoundaries.json'
import SvgIcon from './SvgIcon.vue'

// Props
interface Props {
  showNavigation?: boolean
  mapStyle?: string
  zoom?: number
  center?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  showNavigation: true,
  mapStyle: 'amap://styles/blue',
  zoom: 15,
  center: () => [121.114349, 31.3353]
})

// Emits
const emit = defineEmits<{
  mapReady: [map: any]
  locationFocused: [locationKey: string, location: any]
}>()

// 地图相关
const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<any>(null)
const AMap = ref<any>(null)

// 地图边界相关
const mapBoundaries = ref(mapBoundariesData)
const boundaryPolygons = ref<any[]>([])

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

// 区域名称样式配置
const areaNameStyles = {
  // 基础样式
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#ffffff',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  padding: '6px 12px',
  borderRadius: '6px',
  border: 'none',
  boxShadow: '',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  
  // 位置控制
  position: 'relative',
  zIndex: '1000',
  
  // 响应式字体大小选项
  fontSizes: {
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px'
  },
  
  // 颜色主题选项（简化为文字颜色，背景统一为半透明黑色）
  themes: {
    default: {
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    blue: {
      color: '#87ceeb',
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    red: {
      color: '#ff6b6b',
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    orange: {
      color: '#ffa726',
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    purple: {
      color: '#ba68c8',
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    }
  },
  
  // 偏移量选项（用于精确定位）
  offsets: {
    center: [-30, -15],
    top: [-30, -35],
    bottom: [-30, 5],
    left: [-60, -15],
    right: [0, -15]
  }
}

// 初始化高德地图
const initMap = async () => {
  try {
    // 设置安全密钥
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: 'b58ed3cfeeb2f16454225f46277c2419'
    }
    
    const amap = await AMapLoader.load({
      key: 'b7997390caeb35723dd42e55c1c3da51',
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar']
    })
    
    AMap.value = amap
    
    // 创建地图实例
    map.value = new amap.Map(mapContainer.value, {
      viewMode: '2D',
      zoom: props.zoom,
      center: props.center,
      mapStyle: props.mapStyle,
      showLabel: true,
      showRoad: true,
      showBuilding: true,
      features: ['bg', 'road', 'building', 'point']
    })
    
    // 添加比例尺控件
    map.value.addControl(new amap.Scale())
    
    // 添加工具栏控件到左下角
    const toolBar = new amap.ToolBar({
      position: {
        bottom: '20px',
        left: '20px'
      }
    })
    map.value.addControl(toolBar)
    
    // 初始化地图边界
    initMapBoundaries()
    
    // 触发地图准备就绪事件
    emit('mapReady', map.value)
    
  } catch (error) {
    console.error('地图加载失败:', error)
  }
}

// 初始化地图边界
const initMapBoundaries = () => {
  if (!map.value) {
    console.warn('地图未初始化，无法加载边界')
    return
  }
  
  const AMapClass = (window as any).AMap
  if (!AMapClass) {
    console.warn('AMap类未加载，无法创建边界')
    return
  }
  
  console.log('开始初始化地图边界，边界数据：', mapBoundaries.value)
  
  // 清除现有边界
  clearBoundaries()
  
  // 添加所有可见边界
  mapBoundaries.value.forEach((boundary, index) => {
    if (boundary.visible) {
      console.log('添加边界：', boundary.name)
      addBoundaryToMap(boundary, index)
    }
  })
}

// 添加边界到地图
const addBoundaryToMap = (boundary: any, index: number) => {
  console.log('开始添加边界到地图：', boundary)
  
  if (!map.value) {
    console.error('地图对象不存在')
    return
  }
  
  const AMapClass = (window as any).AMap
  if (!AMapClass) {
    console.error('AMap 未加载')
    return
  }
  
  console.log('边界坐标点：', boundary.points)
  console.log('边界样式：', {
    strokeColor: boundary.strokeColor,
    fillColor: boundary.fillColor,
    strokeWidth: boundary.strokeWidth,
    noFill: boundary.noFill
  })
  
  try {
    // 按照MapDraw示例创建多边形，支持strokeWidth和noFill属性
    const polygon = new AMapClass.Polygon({
      path: boundary.points,
      strokeColor: boundary.strokeColor,
      strokeWeight: boundary.strokeWidth || 2,
      strokeOpacity: 1,
      fillColor: boundary.noFill ? 'transparent' : boundary.fillColor,
      fillOpacity: boundary.noFill ? 0 : 0.5
    })
    
    console.log('多边形创建成功：', polygon)
    
    // 添加到地图
    map.value.add(polygon)
    
    // 按照MapDraw示例添加标签，使用增强的样式配置
    if (boundary.name) {
      const center = polygon.getBounds().getCenter()
      
      // 可以根据区域索引或名称选择不同的主题和样式
      const themeKeys = Object.keys(areaNameStyles.themes)
      const boundaryIndex = mapBoundaries.value.findIndex(b => b.id === boundary.id)
      const currentTheme = areaNameStyles.themes[themeKeys[boundaryIndex % themeKeys.length] as keyof typeof areaNameStyles.themes] || areaNameStyles.themes.default
      const fontSize = areaNameStyles.fontSizes.medium // 可根据需要调整
      const offset = areaNameStyles.offsets.center // 可根据需要调整位置
      
      const marker = new AMapClass.Marker({
        position: center,
        content: `<div style="
          font-size: ${fontSize};
          font-weight: ${areaNameStyles.fontWeight};
          color: ${currentTheme.color};
          background-color: ${currentTheme.backgroundColor};
          padding: ${areaNameStyles.padding};
          border-radius: ${areaNameStyles.borderRadius};
          border: ${areaNameStyles.border};
          box-shadow: ${areaNameStyles.boxShadow};
          white-space: ${areaNameStyles.whiteSpace};
          text-align: ${areaNameStyles.textAlign};
          position: ${areaNameStyles.position};
          z-index: ${areaNameStyles.zIndex};
        ">${boundary.name}</div>`,
        offset: new AMapClass.Pixel(offset[0], offset[1])
      })
      
      map.value.add(marker)
      
      // 保存到数组中
      boundaryPolygons.value.push({
        id: boundary.id,
        polygon: polygon,
        marker: marker,
        boundary: boundary
      })
      
      console.log('标签已添加')
    } else {
      // 没有名称时只保存多边形
      boundaryPolygons.value.push({
        id: boundary.id,
        polygon: polygon,
        boundary: boundary
      })
    }
    
    console.log('边界添加完成')
  } catch (error) {
    console.error('添加边界时出错：', error)
  }
}

// 清除所有边界
const clearBoundaries = () => {
  boundaryPolygons.value.forEach(item => {
    if (item.polygon) {
      map.value.remove(item.polygon)
    }
    if (item.marker) {
      map.value.remove(item.marker)
    }
  })
  boundaryPolygons.value = []
}

// 获取位置对应的emoji表情
const getLocationEmoji = (locationKey: string) => {
  const emojiMap: { [key: string]: string } = {
    'bird-monitoring': '🦅',
    'water-quality': '💧',
    'vegetation': '🌿',
    'weather': '🌤️',
    'soil': '🌱',
    'air-quality': '💨'
  }
  return emojiMap[locationKey] || '📍'
}

// 飞行到指定位置
const flyToLocation = (locationKey: string) => {
  focusMapLocation(locationKey as keyof typeof mapLocations)
}

// 地图标记点聚焦功能
const focusMapLocation = (locationKey: keyof typeof mapLocations) => {
  if (!map.value) {
    console.warn('地图未初始化')
    return
  }
  
  const AMapClass = (window as any).AMap
  if (!AMapClass) {
    console.warn('AMap类未加载')
    return
  }
  
  const location = mapLocations[locationKey]
  if (!location) {
    console.warn('未找到指定位置:', locationKey)
    return
  }
  
  // 设置地图中心点和缩放级别
  map.value.setZoomAndCenter(16, [location.lng, location.lat])
  
  // 添加标记点
  const marker = new AMapClass.Marker({
    position: [location.lng, location.lat],
    title: location.name,
    icon: new AMapClass.Icon({
      size: new AMapClass.Size(32, 32),
      image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
    })
  })
  
  // 添加新标记点
  map.value.add(marker)
  
  // 添加信息窗体
  const infoWindow = new AMapClass.InfoWindow({
    content: `<div style="padding: 10px;"><h4>${location.name}</h4><p>经度: ${location.lng}</p><p>纬度: ${location.lat}</p></div>`,
    offset: new AMapClass.Pixel(0, -30)
  })
  
  // 点击标记点显示信息窗体
  marker.on('click', () => {
    infoWindow.open(map.value, marker.getPosition())
  })
  
  // 自动显示信息窗体
  setTimeout(() => {
    infoWindow.open(map.value, marker.getPosition())
  }, 500)
  
  // 触发位置聚焦事件
  emit('locationFocused', locationKey, location)
}

// 暴露给父组件的方法
defineExpose({
  map,
  focusMapLocation,
  clearBoundaries,
  initMapBoundaries
})

// 生命周期
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  // 清理地图资源
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<style scoped>
.wetland-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.map-navigation {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.quick-nav {
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #ffffff;
  backdrop-filter: blur(8px);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-item .nav-icon {
    font-size: 20px;
    margin-right: 8px;
    transition: all 0.3s ease;
  }

.nav-item:hover .nav-icon {
    transform: scale(1.2);
  }

.nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-item span {
  font-size: 12px;
  color: white;
  text-align: center;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .quick-nav {
    max-width: 90vw;
    gap: 8px;
    padding: 8px;
  }
  
  .nav-item {
    padding: 6px 8px;
    min-width: 50px;
  }
  
  .nav-icon {
    font-size: 16px;
  }
  
  .nav-item span {
    font-size: 10px;
  }
}
</style>