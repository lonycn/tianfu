<template>
  <div class="map-draw-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-section">
        <h2 class="page-title">地图区域绘制工具</h2>
        <div class="draw-controls">
          <button 
            class="control-btn start-btn" 
            @click="startDraw" 
            :disabled="isDrawing"
          >
            <i class="icon-play"></i>
            开始绘制
          </button>
          <button 
            class="control-btn stop-btn" 
            @click="stopDraw" 
            :disabled="!isDrawing"
          >
            <i class="icon-stop"></i>
            停止绘制
          </button>
          <button 
            class="control-btn undo-btn" 
            @click="undoLastPoint" 
            :disabled="!isDrawing || currentPolygonPoints.length === 0"
          >
            <i class="icon-undo"></i>
            撤销
          </button>
          <button 
            class="control-btn redo-btn" 
            @click="redoLastPoint" 
            :disabled="!isDrawing || redoStack.length === 0"
          >
            <i class="icon-redo"></i>
            重做
          </button>
          <button 
            class="control-btn complete-btn" 
            @click="completeCurrentPolygon" 
            :disabled="!isDrawing || currentPolygonPoints.length < 3"
          >
            <i class="icon-complete"></i>
            完成当前区域
          </button>
          <button 
            class="control-btn delete-btn" 
            @click="deleteSelectedArea" 
            :disabled="!selectedAreaId"
          >
            <i class="icon-delete"></i>
            删除选中区域
          </button>
          <button 
            class="control-btn exit-edit-btn" 
            @click="exitEditMode" 
            :disabled="!isEditMode"
            v-show="isEditMode"
          >
            <i class="icon-exit"></i>
            退出编辑
          </button>
          <button 
            class="control-btn icon-mode-btn" 
            @click="toggleIconMode" 
            :class="{ active: isIconMode }"
          >
            <i class="icon-marker"></i>
            {{ isIconMode ? '退出图标模式' : '图标标记模式' }}
          </button>
        </div>
      </div>
      
      <div class="toolbar-section">
        <!-- 区域设置面板 -->
        <div class="area-settings" v-show="!isIconMode">
          <h3>{{ isEditMode ? '编辑区域' : '绘制设置' }}</h3>
          <div class="setting-group">
            <label>区域名称：</label>
            <input 
              v-model="currentAreaName" 
              type="text" 
              placeholder="请输入区域名称"
              class="area-name-input"
            />
          </div>
          <div class="setting-group">
            <label>边框颜色：</label>
            <input 
              v-model="currentStrokeColor" 
              type="color" 
              class="color-picker"
            />
          </div>
          <div class="setting-group">
            <label>边框粗细：</label>
            <div class="stroke-width-controls">
              <input 
                v-model="currentStrokeWidth" 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                class="stroke-width-slider"
              />
              <span class="stroke-width-value">{{ currentStrokeWidth }}px</span>
            </div>
          </div>
          <div class="setting-group">
            <label>填充颜色：</label>
            <div class="fill-color-controls">
              <input 
                v-model="currentFillColor" 
                type="color" 
                class="color-picker"
                :disabled="noFill"
              />
              <label class="checkbox-label">
                <input 
                  v-model="noFill" 
                  type="checkbox" 
                  class="no-fill-checkbox"
                />
                <span>无填充（围栏模式）</span>
              </label>
            </div>
          </div>
          <!-- 编辑模式下的应用按钮 -->
          <div v-if="isEditMode" class="setting-group">
            <button class="control-btn apply-btn" @click="applyEditChanges">
              <i class="icon-apply"></i>
              应用更改
            </button>
          </div>
        </div>
        
        <!-- 图标设置面板 -->
        <div class="icon-settings" v-show="isIconMode">
          <h3>{{ isEditingIcon ? '编辑图标' : '图标设置' }}</h3>
          
          <!-- 模式状态提示 -->
          <div class="mode-status">
            <div v-if="isEditingIcon" class="status-editing">
              <span class="status-icon">✏️</span>
              <span class="status-text">编辑模式：修改图标信息后点击"应用更改"</span>
            </div>
            <div v-else class="status-adding">
              <span class="status-icon">📍</span>
              <span class="status-text">新增模式：设置完成后点击地图添加图标</span>
            </div>
          </div>
          <div class="setting-group">
            <label>图标名称：</label>
            <input 
              v-model="currentIconName" 
              type="text" 
              placeholder="请输入图标名称"
              class="icon-name-input"
            />
          </div>
          <div class="setting-group">
            <label>选择Emoji：</label>
            <div class="emoji-selector">
              <div class="emoji-grid">
                <button 
                  v-for="emoji in emojiOptions" 
                  :key="emoji.value"
                  class="emoji-btn"
                  :class="{ active: currentIconEmoji === emoji.value }"
                  @click="selectEmoji(emoji.value)"
                  :title="emoji.label"
                >
                  {{ emoji.value }}
                </button>
              </div>
            </div>
          </div>
          <div class="setting-group">
            <label>图标类别：</label>
            <select v-model="currentIconCategory" class="category-select">
              <option value="monitoring">监测点</option>
              <option value="agriculture">农业设施</option>
              <option value="education">教育区域</option>
              <option value="storage">存储设施</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="setting-group">
            <label>描述信息：</label>
            <textarea 
              v-model="currentIconDescription" 
              placeholder="请输入图标描述信息"
              class="icon-description"
              rows="3"
            ></textarea>
          </div>
          <!-- 编辑模式下的应用按钮 -->
          <div v-if="isEditingIcon" class="setting-group">
            <button class="control-btn apply-btn" @click="applyIconChanges">
              <i class="icon-apply"></i>
              应用更改
            </button>
            <button class="control-btn cancel-btn" @click="cancelIconEdit">
              <i class="icon-cancel"></i>
              取消编辑
            </button>
          </div>
          
          <!-- 图标显示控制 -->
          <div class="setting-group icon-visibility-controls">
            <label>图标显示控制：</label>
            <div class="visibility-buttons">
              <button 
                class="control-btn show-all-icons-btn" 
                @click="showAllIcons"
                :disabled="visibleIconsCount === mapIcons.length"
                title="显示所有图标标记"
              >
                <i class="icon-eye"></i>
                显示全部 ({{ visibleIconsCount }}/{{ mapIcons.length }})
              </button>
              <button 
                class="control-btn hide-all-icons-btn" 
                @click="hideAllIcons"
                :disabled="hiddenIconsCount === mapIcons.length"
                title="隐藏所有图标标记"
              >
                <i class="icon-eye-off"></i>
                隐藏全部 ({{ hiddenIconsCount }}/{{ mapIcons.length }})
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="toolbar-section">
        <div class="action-controls">
          <button class="control-btn save-btn" @click="saveToLocal">
            <i class="icon-save"></i>
            保存到本地
          </button>
          <button class="control-btn export-btn" @click="exportCode">
            <i class="icon-export"></i>
            复制代码
          </button>
          <button class="control-btn clear-btn" @click="clearAllAreas">
            <i class="icon-clear"></i>
            清空所有
          </button>
        </div>
      </div>
    </div>
    
    <!-- 操作提示 -->
    <div v-if="isDrawing" class="drawing-tips">
      <div class="tip-item">
        <i class="icon-info"></i>
        <span>左键点击添加顶点，右键完成绘制</span>
      </div>
      <div class="tip-item">
        <i class="icon-info"></i>
        <span>点击顶点标记可删除该点</span>
      </div>
      <div class="tip-item">
        <i class="icon-info"></i>
        <span>当前已添加 {{ currentPolygonPoints.length }} 个顶点</span>
      </div>
    </div>
    
    <!-- 图标模式提示 -->
    <div v-if="isIconMode" class="icon-tips">
      <div class="tip-item">
        <i class="icon-info"></i>
        <span>点击地图添加图标标记</span>
      </div>
      <div class="tip-item">
        <i class="icon-info"></i>
        <span>点击已有图标可进行编辑或删除</span>
      </div>
      <div class="tip-item">
        <i class="icon-info"></i>
        <span>当前已添加 {{ mapIcons.length }} 个图标</span>
      </div>
    </div>
    
    <!-- 地图容器 -->
    <div id="map-container" class="map-container">
      <!-- 地址搜索悬浮窗 -->
      <div class="search-panel">
        <div class="search-input-group">
          <input 
          id="search-input-element"
          v-model="searchAddress" 
          type="text" 
          placeholder="输入地点名称或关键词搜索..." 
          @keyup.enter="searchLocation"
          class="search-input"
        />
          <button 
            class="search-btn" 
            @click="searchLocation"
            :disabled="!searchAddress.trim()"
            title="搜索地址"
          >
            <i class="icon-search"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 区域列表 -->
    <div class="area-list">
      <h3>已绘制区域</h3>
      <div class="area-items">
        <div 
          v-for="area in drawnAreas" 
          :key="area.id"
          class="area-item"
          :class="{ active: selectedAreaId === area.id }"
          @click="selectArea(area.id)"
        >
          <div class="area-info">
            <div class="area-name">{{ area.name || '未命名区域' }}</div>
            <div class="area-colors">
              <span 
                class="color-dot" 
                :style="{ backgroundColor: area.strokeColor }"
                title="边框颜色"
              ></span>
              <span 
                class="color-dot" 
                :style="{ backgroundColor: area.fillColor }"
                title="填充颜色"
              ></span>
            </div>
          </div>
          <div class="area-actions">
            <button 
              class="action-btn visibility-btn" 
              @click.stop="toggleAreaVisibility(area.id)"
              :title="area.visible !== false ? '隐藏区域' : '显示区域'"
              :class="{ hidden: area.visible === false }"
            >
              <i :class="area.visible !== false ? 'icon-eye' : 'icon-eye-off'"></i>
            </button>
            <button 
              class="action-btn move-to-btn" 
              @click.stop="moveToArea(area)"
              title="移动到"
            >
              <i class="icon-loation"></i>
            </button>
            <button 
              class="action-btn copy-json-btn" 
              @click.stop="copyAreaJson(area)"
              title="复制JSON"
            >
              <i class="icon-copy"></i>
            </button>
            <button 
              class="action-btn edit-btn" 
              @click.stop="editArea(area.id)"
              title="编辑"
            >
              <i class="icon-edit"></i>
            </button>
            <button 
              class="action-btn delete-btn" 
              @click.stop="deleteArea(area.id)"
              title="删除"
            >
              <i class="icon-delete"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图标列表 -->
    <div class="icon-list">
      <div class="icon-list-header">
        <h3>已添加图标</h3>
        <div class="icon-stats">
          <span class="total-count">总计: {{ mapIcons.length }}</span>
          <span class="visible-count">显示: {{ visibleIconsCount }}</span>
          <span class="hidden-count">隐藏: {{ hiddenIconsCount }}</span>
        </div>
      </div>
      
      <!-- 分类控制面板 -->
      <div class="category-controls">
        <div class="category-item" v-for="category in iconCategories" :key="category.key">
          <span class="category-name">{{ category.label }}</span>
          <span class="category-count">({{ category.count }})</span>
          <div class="category-actions">
            <button 
              class="control-btn show-btn" 
              @click="showCategoryIcons(category.key)"
              :disabled="category.visibleCount === category.count"
              title="显示该分类所有图标"
            >
              显示
            </button>
            <button 
              class="control-btn hide-btn" 
              @click="hideCategoryIcons(category.key)"
              :disabled="category.hiddenCount === category.count"
              title="隐藏该分类所有图标"
            >
              隐藏
            </button>
          </div>
        </div>
        <div class="global-controls">
          <button class="control-btn show-all-btn" @click="showAllIcons">显示全部</button>
          <button class="control-btn hide-all-btn" @click="hideAllIcons">隐藏全部</button>
        </div>
      </div>
      
      <div class="icon-items">
        <div 
          v-for="icon in mapIcons" 
          :key="icon.id"
          class="icon-item"
          :class="{ active: selectedIconId === icon.id }"
          @click="selectIcon(icon.id)"
        >
          <div class="icon-info">
            <div class="icon-emoji">{{ icon.emoji }}</div>
            <div class="icon-details">
              <div class="icon-name">{{ icon.name || '未命名图标' }}</div>
              <div class="icon-category">{{ getCategoryLabel(icon.category) }}</div>
              <div class="icon-coords">{{ icon.coordinates[0].toFixed(4) }}, {{ icon.coordinates[1].toFixed(4) }}</div>
            </div>
          </div>
          <div class="icon-actions">
            <button 
              class="action-btn visibility-btn" 
              @click.stop="toggleIconVisibility(icon.id)"
              :title="icon.visible !== false ? '隐藏图标' : '显示图标'"
              :class="{ hidden: icon.visible === false }"
            >
              <i :class="icon.visible !== false ? 'icon-eye' : 'icon-eye-off'"></i>
            </button>
            <button 
              class="action-btn move-to-btn" 
              @click.stop="moveToIcon(icon)"
              title="移动到"
            >
              <i class="icon-location"></i>
            </button>
            <button 
              class="action-btn copy-json-btn" 
              @click.stop="copyIconJson(icon)"
              title="复制JSON"
            >
              <i class="icon-copy"></i>
            </button>
            <button 
              class="action-btn edit-btn" 
              @click.stop="editIcon(icon.id)"
              title="编辑"
            >
              <i class="icon-edit"></i>
            </button>
            <button 
              class="action-btn delete-btn" 
              @click.stop="deleteIcon(icon.id)"
              title="删除"
            >
              <i class="icon-delete"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 代码导出弹窗 -->
    <div v-if="showCodeModal" class="modal-overlay" @click="closeCodeModal">
      <div class="code-modal" @click.stop>
        <div class="modal-header">
          <h3>导出代码</h3>
          <button class="close-btn" @click="closeCodeModal">&times;</button>
        </div>
        <div class="modal-body">
          <textarea 
            ref="codeTextarea"
            v-model="exportedCode" 
            readonly 
            class="code-textarea"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="control-btn copy-btn" @click="copyCode">
            复制代码
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

// 类型定义
interface DrawnArea {
  id: string
  name: string
  points: [number, number][]
  strokeColor: string
  strokeWidth?: number // 边框粗细
  fillColor: string
  noFill?: boolean // 是否为围栏模式（无填充）
  visible?: boolean // 是否在地图上显示
  polygon?: any
}

// 图标类型定义
interface MapIcon {
  id: string
  name: string
  emoji: string
  coordinates: [number, number] // 经纬度坐标
  category: string // 图标类别：monitoring(监测点)、agriculture(农业设施)、education(教育区域)、storage(存储设施)、other(其他)
  description?: string // 描述信息
  visible?: boolean // 是否可见
  style?: {
    size?: number // 图标大小
    bgColor?: string // 背景色
    borderRadius?: number // 圆角
    shadow?: boolean // 是否有阴影
  }
  marker?: any // 高德地图Marker实例
}

// 响应式数据
const map = ref<any>(null)
const isDrawing = ref(false)
const currentPolygonPoints = ref<[number, number][]>([])
const redoStack = ref<[number, number][]>([])
const drawnAreas = ref<DrawnArea[]>([])
const selectedAreaId = ref<string>('')
const currentAreaName = ref('')
const currentStrokeColor = ref('#ff0000')
const currentStrokeWidth = ref(2)
const currentFillColor = ref('#ff0033')
const noFill = ref(false)
const searchAddress = ref('')
const showCodeModal = ref(false)
const exportedCode = ref('')
const codeTextarea = ref<HTMLTextAreaElement>()
const drawingMode = ref<'polygon' | 'edit'>('polygon')
const isEditMode = ref(false)
const editingAreaId = ref('')
const editMarkers = ref<any[]>([])

// 图标相关响应式数据
const isIconMode = ref(false) // 是否处于图标模式
const mapIcons = ref<MapIcon[]>([]) // 地图图标数组
const selectedIconId = ref<string>('') // 选中的图标ID
const isEditingIcon = ref(false) // 是否正在编辑图标
const editingIconId = ref('') // 正在编辑的图标ID
const currentIconName = ref('') // 当前图标名称
const currentIconEmoji = ref('📍') // 当前图标emoji
const currentIconCategory = ref('other') // 当前图标类别
const currentIconDescription = ref('') // 当前图标描述
const iconMarkers = ref<any[]>([]) // 图标标记数组

// Emoji选项数据
const emojiOptions = ref([
  { value: '🏭', label: '工厂' },
  { value: '🌾', label: '农田' },
  { value: '🍎', label: '果园' },
  { value: '🏠', label: '房屋' },
  { value: '🦅', label: '鸟类' },
  { value: '💧', label: '水质' },
  { value: '❄️', label: '冷藏' },
  { value: '🚜', label: '农机' },
  { value: '🎓', label: '教育' },
  { value: '🔭', label: '观测' },
  { value: '📍', label: '位置' },
  { value: '🌱', label: '种植' },
  { value: '🌳', label: '树木' },
  { value: '🐟', label: '渔业' },
  { value: '⚡', label: '电力' },
  { value: '🔧', label: '维修' },
  { value: '📊', label: '数据' },
  { value: '🎯', label: '目标' },
  { value: '🚨', label: '警报' },
  { value: '🔬', label: '实验' }
])

// 计算属性 - 图标统计
const visibleIconsCount = computed(() => {
  return mapIcons.value.filter(icon => icon.visible !== false).length
})

const hiddenIconsCount = computed(() => {
  return mapIcons.value.filter(icon => icon.visible === false).length
})

const iconCategories = computed(() => {
  const categories = [
    { key: 'monitoring', label: '监测点' },
    { key: 'agriculture', label: '农业设施' },
    { key: 'education', label: '教育区域' },
    { key: 'storage', label: '存储设施' },
    { key: 'other', label: '其他' }
  ]
  
  return categories.map(category => {
    const categoryIcons = mapIcons.value.filter(icon => icon.category === category.key)
    const visibleCount = categoryIcons.filter(icon => icon.visible !== false).length
    const hiddenCount = categoryIcons.filter(icon => icon.visible === false).length
    
    return {
      ...category,
      count: categoryIcons.length,
      visibleCount,
      hiddenCount
    }
  }).filter(category => category.count > 0) // 只显示有图标的分类
})

// 地图相关变量
let currentPolygon: any = null
let currentPolyline: any = null
let clickListener: any = null
let currentMarkers: any[] = []
let editingArea: DrawnArea | null = null

// 初始化地图
const initMap = async () => {
  try {
    // 设置安全密钥
    (window as any)._AMapSecurityConfig = {
      securityJsCode: 'b58ed3cfeeb2f16454225f46277c2419'
    }
    
    const AMap = await AMapLoader.load({
      key: 'b7997390caeb35723dd42e55c1c3da51', // 高德地图API Key
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.PlaceSearch', 'AMap.AutoComplete']
    })
    
    // 确定地图中心点
    let mapCenter = [104.0648, 30.5728] // 默认成都坐标
    
    // 如果有已保存的区域数据，使用第一个区域的第一个坐标点作为中心
    try {
      const savedData = localStorage.getItem('map_drawn_areas')
      if (savedData) {
        const areas = JSON.parse(savedData)
        if (areas.length > 0 && areas[0].points && areas[0].points.length > 0) {
          mapCenter = areas[0].points[0]
        }
      }
    } catch (error) {
      console.warn('读取保存的区域数据失败，使用默认中心点:', error)
    }
    
    map.value = new AMap.Map('map-container', {
      zoom: 15,
      center: mapCenter,
      mapStyle: 'amap://styles/normal'
    })
    
    // 添加工具条和比例尺
    map.value.addControl(new AMap.ToolBar())
    map.value.addControl(new AMap.Scale())
    
    // 初始化搜索功能
    initSearch();
    
    // 从本地存储加载已保存的区域
    loadFromLocal();
    
    // 从本地存储加载已保存的图标
    loadIconsFromLocal();
    
  } catch (error) {
    console.error('地图初始化失败:', error)
    alert('地图初始化失败，请检查网络连接或API Key配置')
  }
}

// 开始绘制
const startDraw = () => {
  console.log('开始绘制按钮被点击')
  
  if (!map.value) {
    console.error('地图未初始化')
    alert('地图未初始化，请刷新页面重试')
    return
  }
  
  // 清理之前的绘制状态
  cleanupCurrentDraw();
  
  isDrawing.value = true
  drawingMode.value = 'polygon'
  currentPolygonPoints.value = []
  redoStack.value = []
  currentAreaName.value = `区域${drawnAreas.value.length + 1}`
  
  console.log('绘制状态已设置，当前绘制模式:', isDrawing.value)
  
  // 设置地图样式，提高点击精度
  map.value.setDefaultCursor('crosshair')
  
  // 监听地图点击事件
  clickListener = map.value.on('click', (e: any) => {
    console.log('地图被点击:', e.lnglat)
    
    // 图标模式处理
    if (isIconMode.value) {
      console.log('图标模式下的地图点击事件')
      console.log('点击目标:', e.target)
      
      // 检查点击的是否是已有的图标标记
      const target = e.target
      if (target && target.CLASS_NAME === 'AMap.Marker') {
        console.log('点击的是已有图标标记')
        // 点击的是图标，进入编辑模式
        const iconId = target.getExtData()?.iconId
        if (iconId) {
          console.log('进入图标编辑模式，图标ID:', iconId)
          editIcon(iconId);
        }
        return
      }
      
      // 点击空白地图区域，添加新图标
      const point: [number, number] = [e.lnglat.lng, e.lnglat.lat]
      console.log('点击空白地图区域，准备添加新图标，坐标:', point)
      addNewIcon(point);
      return
    }
    
    // 区域绘制模式处理
    if (!isDrawing.value) return
    
    // 检查点击的是否是标记点，如果是则不添加新点
    const target = e.target
    if (target && target.CLASS_NAME === 'AMap.Marker') {
      console.log('点击的是标记点，不添加新点')
      return
    }
    
    const point: [number, number] = [e.lnglat.lng, e.lnglat.lat]
    
    // 清空重做栈（新操作后不能重做之前的撤销）
    redoStack.value = []
    
    // 添加点
    currentPolygonPoints.value.push(point)
    console.log('当前点数:', currentPolygonPoints.value.length)
    
    // 更新绘制显示
    updateDrawingDisplay();;
    
    // 添加可视化标记点
    addDrawingMarker(point, currentPolygonPoints.value.length - 1);
  })
  
  // 监听右键点击完成绘制
  map.value.on('rightclick', () => {
    console.log('右键点击，当前点数:', currentPolygonPoints.value.length)
    if (isDrawing.value && currentPolygonPoints.value.length >= 3) {
      completeCurrentPolygon();
    }
  })
}

// 停止绘制
const stopDraw = () => {
  console.log('停止绘制按钮被点击')
  
  if (!isDrawing.value) {
    console.log('当前不在绘制状态')
    return
  }
  
  if (currentPolygonPoints.value.length < 3) {
    console.log('点数不足，当前点数:', currentPolygonPoints.value.length)
    alert('至少需要3个点才能形成区域')
    return
  }
  
  // 保存当前绘制的区域
  const newArea: DrawnArea = {
    id: Date.now().toString(),
    name: currentAreaName.value || `区域${drawnAreas.value.length + 1}`,
    points: [...currentPolygonPoints.value],
    strokeColor: currentStrokeColor.value,
    strokeWidth: currentStrokeWidth.value,
    fillColor: noFill.value ? 'transparent' : currentFillColor.value,
    noFill: noFill.value,
    visible: true // 新创建的区域默认可见
  }
  
  console.log('创建新区域:', newArea)
  
  // 创建最终的多边形
  createFinalPolygon(newArea)
  
  drawnAreas.value.push(newArea)
  
  // 清理当前绘制状态
  cleanupCurrentDraw();
  
  // 自动选中新创建的区域
  selectArea(newArea.id);
}

// 撤销上一步
const undoLastPoint = () => {
  console.log('撤销按钮被点击')
  
  if (currentPolygonPoints.value.length > 0) {
    const removedPoint = currentPolygonPoints.value.pop()
    console.log('撤销点:', removedPoint)
    if (removedPoint) {
      redoStack.value.push(removedPoint)
    }
    
    // 移除对应的标记点
    if (currentMarkers.length > 0) {
      const marker = currentMarkers.pop()
      if (marker) {
        map.value.remove(marker)
      }
    }
    
    updateDrawingDisplay()
  } else {
    console.log('没有可撤销的点')
  }
}

// 重做上一步
const redoLastPoint = () => {
  if (redoStack.value.length > 0) {
    const point = redoStack.value.pop()
    if (point) {
      currentPolygonPoints.value.push(point)
      addDrawingMarker(point, currentPolygonPoints.value.length - 1);
      updateDrawingDisplay();
    }
  }
}

// 完成当前多边形
const completeCurrentPolygon = () => {
  if (!isDrawing.value || currentPolygonPoints.value.length < 3) {
    alert('至少需要3个点才能形成区域')
    return
  }
  
  stopDraw();
}

// 更新绘制显示
const updateDrawingDisplay = () => {
  if (!map.value) return
  
  // 移除之前的绘制显示
  if (currentPolygon) {
    map.value.remove(currentPolygon)
    currentPolygon = null
  }
  if (currentPolyline) {
    map.value.remove(currentPolyline)
    currentPolyline = null
  }
  
  const pointCount = currentPolygonPoints.value.length
  
  if (pointCount >= 2) {
    const AMap = (window as any).AMap
    
    // 绘制连接线
    currentPolyline = new AMap.Polyline({
      path: currentPolygonPoints.value,
      strokeColor: currentStrokeColor.value,
      strokeWeight: 2,
      strokeOpacity: 0.8,
      strokeStyle: 'dashed',
      zIndex: 10 // 设置较低的层级
    })
    map.value.add(currentPolyline)
    
    // 如果有3个或以上点，显示预览多边形，但不阻挡点击
    if (pointCount >= 3) {
      currentPolygon = new AMap.Polygon({
        path: currentPolygonPoints.value,
        strokeColor: currentStrokeColor.value,
        strokeWeight: 2,
        strokeOpacity: 0.6,
        fillColor: noFill.value ? 'transparent' : currentFillColor.value,
        fillOpacity: noFill.value ? 0 : 0.1, // 围栏模式时完全透明
        strokeStyle: 'dashed',
        zIndex: 5, // 设置更低的层级
        clickable: false, // 关键：设置为不可点击
        bubble: true // 允许事件冒泡
      })
      map.value.add(currentPolygon)
    }
  }
}

// 添加绘制标记点
const addDrawingMarker = (point: [number, number], index: number) => {
  if (!map.value) return
  
  const AMap = (window as any).AMap
  
  const marker = new AMap.Marker({
    position: point,
    content: `<div class="drawing-marker" data-index="${index}">
      <div class="marker-dot"></div>
      <div class="marker-label">${index + 1}</div>
    </div>`,
    offset: new AMap.Pixel(-10, -10),
    zIndex: 2000, // 设置最高层级，确保标记点在最上层
    clickable: true // 确保标记点可点击
  })
  
  // 添加点击事件，允许删除特定点
  marker.on('click', (e: any) => {
    e.stopPropagation()
    if (confirm(`确定要删除第${index + 1}个点吗？`)) {
      removePointAtIndex(index);
    }
  })
  
  currentMarkers.push(marker)
  map.value.add(marker)
}

// 删除指定索引的点
const removePointAtIndex = (index: number) => {
  if (index >= 0 && index < currentPolygonPoints.value.length) {
    // 清空重做栈
    redoStack.value = []
    
    // 移除点
    currentPolygonPoints.value.splice(index, 1)
    
    // 重新绘制所有标记点
    clearDrawingMarkers();
    currentPolygonPoints.value.forEach((point, i) => {
      addDrawingMarker(point, i);
    });
    
    updateDrawingDisplay();
  }
}

// 清理绘制标记点
const clearDrawingMarkers = () => {
  currentMarkers.forEach(marker => {
    map.value.remove(marker)
  })
  currentMarkers = []
}



// 创建最终多边形
const createFinalPolygon = (area: DrawnArea) => {
  if (!map.value) return
  
  const AMap = (window as any).AMap
  const polygon = new AMap.Polygon({
    path: area.points,
    strokeColor: area.strokeColor,
    strokeWeight: area.strokeWidth || 2,
    strokeOpacity: 1,
    fillColor: area.noFill ? 'transparent' : area.fillColor,
    fillOpacity: area.noFill ? 0 : 0.5 // 围栏模式时完全透明
  })
  
  // 添加点击事件
  polygon.on('click', () => {
    selectArea(area.id);
  })
  
  area.polygon = polygon
  
  // 只有可见的区域才添加到地图上
  if (area.visible !== false) {
    map.value.add(polygon)
  }
}

// 清理当前绘制状态
const cleanupCurrentDraw = () => {
  isDrawing.value = false
  currentPolygonPoints.value = []
  redoStack.value = []
  
  // 恢复默认鼠标样式
  if (map.value) {
    map.value.setDefaultCursor('default')
  }
  
  // 移除临时绘制元素
  if (currentPolygon) {
    map.value.remove(currentPolygon)
    currentPolygon = null
  }
  
  if (currentPolyline) {
    map.value.remove(currentPolyline)
    currentPolyline = null
  }
  
  // 清理绘制标记点
  clearDrawingMarkers();
  
  // 移除事件监听
  if (clickListener) {
    map.value.off('click', clickListener)
    clickListener = null
  }
  
  // 移除右键监听
  map.value.off('rightclick')
}

// 选择区域
const selectArea = (areaId: string) => {
  selectedAreaId.value = areaId
  const area = drawnAreas.value.find(a => a.id === areaId)
  if (area && area.polygon) {
    // 高亮选中的区域
    highlightArea(area);
  }
}

// 高亮区域
const highlightArea = (area: DrawnArea) => {
  // 重置所有区域样式
  drawnAreas.value.forEach(a => {
    if (a.polygon) {
      a.polygon.setOptions({
        strokeWeight: a.strokeWidth || 2,
        strokeOpacity: 1
      })
    }
  })
  
  // 高亮选中区域
  if (area.polygon) {
    area.polygon.setOptions({
      strokeWeight: 4, // 选中时统一设置为4px
      strokeOpacity: 1
    })
  }
}

// 删除选中区域
const deleteSelectedArea = () => {
  if (selectedAreaId.value) {
    deleteArea(selectedAreaId.value);
  }
}

// 删除区域
const deleteArea = (areaId: string) => {
  const areaIndex = drawnAreas.value.findIndex(a => a.id === areaId)
  if (areaIndex !== -1) {
    const area = drawnAreas.value[areaIndex]
    
    // 如果正在编辑这个区域，先退出编辑模式
    if (editingAreaId.value === areaId) {
      exitEditMode();
    }
    
    // 从地图移除多边形
    if (area.polygon) {
      map.value.remove(area.polygon)
    }
    
    // 从数组移除
    drawnAreas.value.splice(areaIndex, 1)
    
    // 清除选中状态
    if (selectedAreaId.value === areaId) {
      selectedAreaId.value = ''
    }
  }
}

// 切换区域显示/隐藏
const toggleAreaVisibility = (areaId: string) => {
  const area = drawnAreas.value.find(a => a.id === areaId)
  if (!area || !map.value) return
  
  // 切换可见状态
  area.visible = area.visible === false ? true : false
  
  if (area.polygon) {
    if (area.visible === false) {
      // 隐藏区域
      map.value.remove(area.polygon)
    } else {
      // 显示区域
      map.value.add(area.polygon)
    }
  }
}

// 编辑区域
const editArea = (areaId: string) => {
  const area = drawnAreas.value.find(a => a.id === areaId)
  if (!area || !map.value) return
  
  // 如果已经在编辑其他区域，先退出编辑模式
  if (isEditMode.value) {
    exitEditMode()
  }
  
  // 进入编辑模式
  isEditMode.value = true
  editingAreaId.value = areaId
  
  // 更新当前编辑区域的属性
      currentAreaName.value = area.name
      currentStrokeColor.value = area.strokeColor
      currentStrokeWidth.value = area.strokeWidth || 2
      currentFillColor.value = area.fillColor
      noFill.value = area.noFill || false
  
  // 选中区域
  selectArea(areaId);
  
  // 创建可拖拽的顶点标记
   createEditMarkers(area);
}

// 创建编辑模式的顶点标记
const createEditMarkers = (area: DrawnArea) => {
  if (!map.value) return
  
  const AMap = (window as any).AMap
  
  // 清除之前的编辑标记
  clearEditMarkers();
  
  // 为每个顶点创建可拖拽的标记
  area.points.forEach((point, index) => {
    const marker = new AMap.Marker({
        position: point,
        content: `<div style="position: relative; width: 24px; height: 24px; cursor: move; display: flex; align-items: center; justify-content: center;" data-index="${index}" title="拖拽移动 | 右键菜单 | 双击复制">
          <div style="width: 20px; height: 20px; background: #4CAF50; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 3px 6px rgba(0,0,0,0.4); transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;">
            <div style="color: white; font-size: 11px; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.5); z-index: 1;">${index + 1}</div>
          </div>
        </div>`,
        offset: new AMap.Pixel(-12, -12),
        zIndex: 3000,
        draggable: true, // 设置为可拖拽
        clickable: true
      })
    
    // 拖拽结束事件
    marker.on('dragend', (e: any) => {
      const newPosition = e.target.getPosition()
      updateVertexPosition(index, [newPosition.lng, newPosition.lat]);
    })
    
    // 右键菜单
    marker.on('rightclick', (e: any) => {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
      showVertexContextMenu(e, index);
    })
    
    // 双击复制顶点
    marker.on('dblclick', (e: any) => {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
      duplicateVertex(index);
    })
    
    editMarkers.value.push(marker);
     map.value.add(marker);
   });
 }
 
 // 清除编辑标记
 const clearEditMarkers = () => {
   if (map.value) {
     editMarkers.value.forEach(marker => {
       map.value.remove(marker)
     })
   }
   editMarkers.value = []
 }
 
 // 更新顶点位置
 const updateVertexPosition = (index: number, newPosition: [number, number]) => {
   const area = drawnAreas.value.find(a => a.id === editingAreaId.value)
   if (!area) return
   
   // 更新顶点坐标
   area.points[index] = newPosition
   
   // 更新多边形显示
   if (area.polygon) {
     area.polygon.setPath(area.points)
   }
 }
 
 // 显示顶点右键菜单
 const showVertexContextMenu = (e: any, index: number) => {
   const area = drawnAreas.value.find(a => a.id === editingAreaId.value)
   if (!area) return
   
   const canDelete = area.points.length > 3
   
   // 创建菜单选项
   const menuItems = []
   if (canDelete) {
     menuItems.push(`删除第${index + 1}个顶点`)
   }
   menuItems.push(`复制第${index + 1}个顶点`)
   
   // 显示选择菜单
   const choice = prompt(`请选择操作（输入数字）：\n${menuItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}`, '1')
   
   if (choice) {
     const choiceNum = parseInt(choice)
     if (canDelete && choiceNum === 1) {
       removeVertex(index);
     } else if ((canDelete && choiceNum === 2) || (!canDelete && choiceNum === 1)) {
       duplicateVertex(index);
     }
   }
 }
 
 // 删除顶点
 const removeVertex = (index: number) => {
   const area = drawnAreas.value.find(a => a.id === editingAreaId.value)
   if (!area || area.points.length <= 3) return
   
   // 删除顶点
   area.points.splice(index, 1)
   
   // 更新多边形显示
   if (area.polygon) {
     area.polygon.setPath(area.points)
   }
   
   // 重新创建编辑标记
   createEditMarkers(area);
 }
 
 // 复制顶点
 const duplicateVertex = (index: number) => {
   const area = drawnAreas.value.find(a => a.id === editingAreaId.value)
   if (!area) return
   
   // 复制当前顶点坐标
   const originalPoint = area.points[index]
   const newPoint: [number, number] = [originalPoint[0], originalPoint[1]]
   
   // 在当前顶点后插入新顶点
   area.points.splice(index + 1, 0, newPoint)
   
   // 更新多边形显示
   if (area.polygon) {
     area.polygon.setPath(area.points)
   }
   
   // 重新创建编辑标记
   createEditMarkers(area);
   
   alert(`已在第${index + 1}个顶点后复制了一个新顶点`);
 }
 
 // 应用编辑更改
  const applyEditChanges = () => {
    const area = drawnAreas.value.find(a => a.id === editingAreaId.value)
    if (!area) return
    
    // 更新区域属性
    area.name = currentAreaName.value || `区域${drawnAreas.value.indexOf(area) + 1}`
    area.strokeColor = currentStrokeColor.value
    area.strokeWidth = currentStrokeWidth.value
    area.fillColor = noFill.value ? 'transparent' : currentFillColor.value
    area.noFill = noFill.value
    
    // 更新多边形样式
    if (area.polygon) {
      area.polygon.setOptions({
        strokeColor: area.strokeColor,
        strokeWeight: area.strokeWidth,
        fillColor: area.fillColor,
        fillOpacity: area.noFill ? 0 : 0.3
      })
    }
    
    // 提示用户更改已应用
  alert('区域属性已更新！')
}

// 搜索相关变量
let autoComplete: any = null
let placeSearch: any = null

// 初始化搜索功能
const initSearch = () => {
  const AMap = (window as any).AMap
  
  // 创建输入提示
  autoComplete = new AMap.AutoComplete({
    input: 'search-input-element' // 这个ID需要设置到input元素上
  })
  
  // 创建地点搜索
  placeSearch = new AMap.PlaceSearch({
    map: map.value,
    autoFitView: false // 手动控制视野
  })
  
  // 监听选择事件
  autoComplete.on('select', (e: any) => {
    console.log('选中了提示项:', e)
    if (e.poi && e.poi.name) {
      // 设置城市
      if (e.poi.adcode) {
        placeSearch.setCity(e.poi.adcode)
      }
      // 执行搜索
      placeSearch.search(e.poi.name)
      
      // 手动处理搜索结果
      setTimeout(() => {
        handleSearchResult(e.poi);
      }, 500);
    }
  })
}

// 处理搜索结果
const handleSearchResult = (poi: any) => {
  if (!poi || !poi.location) return
  
  console.log('处理搜索结果:', poi)
  
  const location = poi.location
  
  // 将地图中心移动到搜索结果位置
  map.value.setCenter([location.lng, location.lat])
  map.value.setZoom(16)
  
  // 在搜索位置添加临时标记
  const AMap = (window as any).AMap
  const marker = new AMap.Marker({
    position: [location.lng, location.lat],
    title: poi.name || '搜索位置'
  })
  
  // 添加信息窗体
  const infoWindow = new AMap.InfoWindow({
    content: `<div style="padding: 8px; font-size: 12px; max-width: 200px;">📍 <strong>${poi.name}</strong><br/>${poi.address || '暂无详细地址'}</div>`,
    offset: new AMap.Pixel(0, -30)
  })
  
  marker.on('click', () => {
    infoWindow.open(map.value, location)
  })
  
  map.value.add(marker)
  
  // 自动显示信息窗体
  infoWindow.open(map.value, location)
  
  // 3秒后自动移除标记和信息窗体
  setTimeout(() => {
    map.value.remove(marker)
    infoWindow.close()
  }, 3000)
  
  // 清空搜索框
  searchAddress.value = ''
}

// 手动搜索（回车或点击按钮时）
const searchLocation = () => {
  console.log('手动搜索被调用，搜索关键词:', searchAddress.value)
  
  if (!searchAddress.value.trim()) {
    alert('请输入搜索关键词')
    return
  }
  
  if (!map.value || !placeSearch) {
    alert('搜索功能未初始化，请稍后再试')
    return
  }
  
  // 直接使用PlaceSearch搜索
  placeSearch.search(searchAddress.value, (status: string, result: any) => {
    console.log('手动搜索结果:', status, result)
    
    if (status === 'complete' && result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
      const poi = result.poiList.pois[0]
      handleSearchResult(poi);
    } else {
      alert('未找到该地点，请尝试其他关键词')
    }
  })
}
  
  // 退出编辑模式
 const exitEditMode = () => {
   isEditMode.value = false
   editingAreaId.value = ''
   clearEditMarkers();
   selectedAreaId.value = '' // 清除选中状态
 }

// 清空所有区域
const clearAllAreas = () => {
  console.log('清空所有区域按钮被点击')
  
  if (confirm('确定要清空所有绘制的区域吗？')) {
    console.log('用户确认清空所有区域')
    drawnAreas.value.forEach(area => {
      if (area.polygon) {
        map.value.remove(area.polygon)
      }
    })
    drawnAreas.value = []
    selectedAreaId.value = ''
    cleanupCurrentDraw();
    console.log('所有区域已清空')
  } else {
    console.log('用户取消清空操作')
  }
}

// 保存到本地存储
const saveToLocal = () => {
  console.log('保存按钮被点击')
  
  try {
    const data = drawnAreas.value.map(area => ({
      id: area.id,
      name: area.name,
      points: area.points,
      strokeColor: area.strokeColor,
      strokeWidth: area.strokeWidth || 2,
      fillColor: area.fillColor,
      noFill: area.noFill || false,
      visible: true
    }))
    
    console.log('保存数据:', data)
    localStorage.setItem('map_drawn_areas', JSON.stringify(data))
    alert('保存成功！')
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败，请重试')
  }
}

// 从本地存储加载
const loadFromLocal = () => {
  try {
    const data = localStorage.getItem('map_drawn_areas')
    if (data) {
      const areas = JSON.parse(data)
      areas.forEach((areaData: any) => {
        const area: DrawnArea = {
          id: areaData.id,
          name: areaData.name,
          points: areaData.points,
          strokeColor: areaData.strokeColor,
          strokeWidth: areaData.strokeWidth || 2,
          fillColor: areaData.fillColor,
          noFill: areaData.noFill || false,
          visible: areaData.visible !== false // 默认可见，除非明确设置为false
        }
        
        createFinalPolygon(area);
        drawnAreas.value.push(area)
      })
    }
  } catch (error) {
    console.error('加载失败:', error)
  }
}

// 导出代码
const exportCode = () => {
  console.log('导出代码按钮被点击')
  
  const code = generateCode()
  exportedCode.value = code
  showCodeModal.value = true
  
  console.log('代码弹窗已显示')
  
  nextTick(() => {
    if (codeTextarea.value) {
      codeTextarea.value.select()
    }
  })
}

// 代码生成器配置
const codeGeneratorConfig = {
  templates: {
    // 基础数据模板
    dataTemplate: (areas) => `// 地图区域绘制数据\nconst mapAreas = ${JSON.stringify(areas, null, 2)};`,
    
    // 样式配置模板
    stylesTemplate: () => `// 区域名称样式配置\nconst areaNameStyles = {\n  fontSize: '14px',\n  fontWeight: 'bold',\n  color: '#2d8722',\n  backgroundColor: 'rgba(255, 255, 255, 0.9)',\n  padding: '4px 8px',\n  borderRadius: '4px',\n  border: '1px solid #2d8722',\n  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',\n  whiteSpace: 'nowrap',\n  textAlign: 'center',\n  position: 'relative',\n  zIndex: '1000'\n};`,
    
    // 渲染逻辑模板
    renderTemplate: () => `// 渲染区域到地图\nmapAreas.forEach((area, index) => {\n  if (!area.visible) return;\n  \n  const polygon = new AMap.Polygon({\n    path: area.points,\n    strokeColor: area.strokeColor,\n    strokeWeight: area.strokeWidth,\n    strokeOpacity: 1,\n    fillColor: area.noFill ? 'transparent' : area.fillColor,\n    fillOpacity: area.noFill ? 0 : 0.5\n  });\n  \n  map.add(polygon);\n  \n  // 添加区域名称标签\n  const center = polygon.getBounds().getCenter();\n  const marker = new AMap.Marker({\n    position: center,\n    content: \`<div style=\"\${Object.entries(areaNameStyles).map(([k,v]) => \`\${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: \${v}\`).join('; ')}\"\>\${area.name}</div>\`,\n    offset: new AMap.Pixel(-30, -15)\n  });\n  \n  map.add(marker);\n});`,
    
    // 工具函数模板
    utilsTemplate: () => `// 工具函数\nconst mapUtils = {\n  // 切换区域显示/隐藏\n  toggleArea: (areaId, visible) => {\n    const area = mapAreas.find(a => a.id === areaId);\n    if (area) area.visible = visible;\n  },\n  \n  // 获取区域中心点\n  getAreaCenter: (areaId) => {\n    const area = mapAreas.find(a => a.id === areaId);\n    if (!area || !area.points.length) return null;\n    \n    const centerLng = area.points.reduce((sum, p) => sum + p[0], 0) / area.points.length;\n    const centerLat = area.points.reduce((sum, p) => sum + p[1], 0) / area.points.length;\n    return [centerLng, centerLat];\n  }\n};`
  },
  
  // 代码生成选项
  options: {
    includeStyles: true,
    includeUtils: true,
    includeComments: true,
    format: 'es6' // 'es6' | 'commonjs' | 'umd'
  }
};

// 改进的代码生成函数
const generateCode = () => {
  const areas = drawnAreas.value.map(area => ({
    id: area.id,
    name: area.name,
    points: area.points,
    strokeColor: area.strokeColor,
    strokeWidth: area.strokeWidth || 2,
    fillColor: area.fillColor,
    noFill: area.noFill || false,
    visible: true
  }));
  
  // 添加图标数据
  const icons = mapIcons.value.map(icon => ({
    id: icon.id,
    name: icon.name,
    emoji: icon.emoji,
    position: {
      lng: icon.coordinates[0],
      lat: icon.coordinates[1]
    },
    category: icon.category,
    description: icon.description || '',
    visible: icon.visible !== false,
    iconStyle: {
      size: icon.style?.size || 32,
      backgroundColor: icon.style?.bgColor || "rgba(255, 255, 255, 0.9)",
      borderRadius: `${icon.style?.borderRadius || 6}px`,
      boxShadow: icon.style?.shadow !== false ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"
    }
  }));
  
  const { templates, options } = codeGeneratorConfig;
  const codeParts = [];
  
  // 添加文件头注释
  if (options.includeComments) {
    codeParts.push(`/**\n * 地图区域绘制和图标标记代码\n * 生成时间: ${new Date().toLocaleString()}\n * 区域数量: ${areas.length}\n * 图标数量: ${icons.length}\n * 使用方法: 在高德地图初始化后调用此代码\n */\n`);
  }
  
  // 添加区域数据
  codeParts.push(templates.dataTemplate(areas));
  
  // 添加图标数据
  codeParts.push(`\n// 图标数据\nconst mapIcons = ${JSON.stringify(icons, null, 2)};`);
  
  // 添加样式配置
  if (options.includeStyles) {
    codeParts.push('\n' + templates.stylesTemplate());
  }
  
  // 添加渲染逻辑
  codeParts.push('\n' + templates.renderTemplate());
  
  // 添加图标渲染逻辑
  codeParts.push(`\n\n// 渲染图标标记\nmapIcons.forEach(icon => {\n  if (icon.visible) {\n    const marker = new AMap.Marker({\n      position: [icon.position.lng, icon.position.lat],\n      content: \`<div style="\n        width: \${icon.iconStyle.size}px;\n        height: \${icon.iconStyle.size}px;\n        background: \${icon.iconStyle.backgroundColor};\n        border-radius: \${icon.iconStyle.borderRadius};\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        font-size: \${icon.iconStyle.size * 0.6}px;\n        box-shadow: \${icon.iconStyle.boxShadow};\n        cursor: pointer;\n      ">\${icon.emoji}</div>\`,\n      title: icon.name,\n      extData: { iconId: icon.id, iconData: icon }\n    });\n    \n    map.add(marker);\n    \n    // 添加点击事件\n    marker.on('click', () => {\n      console.log('点击图标:', icon.name, icon);\n      // 这里可以添加自定义的点击处理逻辑\n    });\n  }\n});`);
  
  // 添加工具函数
  if (options.includeUtils) {
    codeParts.push('\n' + templates.utilsTemplate());
  }
  
  // 添加使用示例
  if (options.includeComments) {
    codeParts.push(`\n\n// 使用示例:\n// 1. 确保高德地图已初始化\n// 2. 直接运行上述代码即可在地图上显示区域和图标\n// 3. 使用 mapUtils.toggleArea(areaId, false) 隐藏特定区域\n// 4. 使用 mapUtils.getAreaCenter(areaId) 获取区域中心点\n// 5. 图标数据包含完整的配置信息，可根据需要自定义样式`);
  }
  
  return codeParts.join('\n');
};

// 复制代码
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(exportedCode.value)
    alert('代码已复制到剪贴板！')
  } catch (error) {
    // 降级方案
    if (codeTextarea.value) {
      codeTextarea.value.select()
      document.execCommand('copy')
      alert('代码已复制到剪贴板！')
    }
  }
}

// 移动到指定区域
const moveToArea = (area: DrawnArea) => {
  if (!map.value || !area.points || area.points.length === 0) return
  
  // 计算区域的中心点
  let centerLng = 0
  let centerLat = 0
  
  area.points.forEach(point => {
    centerLng += point[0]
    centerLat += point[1]
  })
  
  centerLng /= area.points.length
  centerLat /= area.points.length
  
  // 移动地图到中心点并设置合适的缩放级别
  map.value.setZoomAndCenter(16, [centerLng, centerLat])
  
  // 高亮显示该区域
  selectArea(area.id)
  
  // 2秒后取消高亮
  setTimeout(() => {
    if (selectedAreaId.value !== area.id) {
      selectedAreaId.value = ''
    }
  }, 2000)
}

// 复制单个区域的JSON
const copyAreaJson = async (area: DrawnArea) => {
  try {
    const areaJson = {
      id: area.id,
      name: area.name,
      points: area.points,
      strokeColor: area.strokeColor,
      strokeWidth: area.strokeWidth || 2,
      fillColor: area.fillColor,
      noFill: area.noFill || false,
      visible: true
    }
    
    const jsonString = JSON.stringify(areaJson, null, 2)
    await navigator.clipboard.writeText(jsonString)
    alert(`区域 "${area.name}" 的JSON已复制到剪贴板！`)
  } catch (error) {
    console.error('复制失败:', error)
    alert('复制失败，请重试')
  }
}

// 关闭代码弹窗
const closeCodeModal = () => {
  showCodeModal.value = false
}

// ========== 图标相关方法 ==========

// 切换图标模式
const toggleIconMode = () => {
  isIconMode.value = !isIconMode.value
  
  if (isIconMode.value) {
    // 进入图标模式，退出其他模式
    if (isDrawing.value) {
      stopDraw()
    }
    if (isEditMode.value) {
      exitEditMode()
    }
    
    // 设置地图光标
    if (map.value) {
      map.value.setDefaultCursor('crosshair')
    }
    
    // 绑定地图点击事件（如果还没有绑定）
    if (!clickListener && map.value) {
      console.log('为图标模式绑定地图点击事件')
      clickListener = map.value.on('click', (e: any) => {
        console.log('地图被点击:', e.lnglat)
        
        // 图标模式处理
        if (isIconMode.value) {
          console.log('图标模式下的地图点击事件')
          console.log('点击目标:', e.target)
          console.log('当前编辑状态:', isEditingIcon.value)
          
          // 检查点击的是否是已有的图标标记
          const target = e.target
          if (target && target.CLASS_NAME === 'AMap.Marker') {
            console.log('点击的是已有图标标记')
            // 点击的是图标，进入编辑模式
            const iconId = target.getExtData()?.iconId
            if (iconId) {
              console.log('进入图标编辑模式，图标ID:', iconId)
              editIcon(iconId)
            }
            return
          }
          
          // 如果正在编辑图标，不允许添加新图标
          if (isEditingIcon.value) {
            console.log('正在编辑图标，忽略地图点击事件')
            return
          }
          
          // 点击空白地图区域，添加新图标
          const point: [number, number] = [e.lnglat.lng, e.lnglat.lat]
          console.log('点击空白地图区域，准备添加新图标，坐标:', point)
          addNewIcon(point)
          return
        }
        
        // 区域绘制模式处理
        if (isDrawing.value) {
          const point: [number, number] = [e.lnglat.lng, e.lnglat.lat]
          currentPolygonPoints.value.push(point)
          updateDrawingDisplay()
        }
      })
    }
    
    // 启用所有图标的拖拽功能
    enableAllIconsDragging()
    console.log('已启用所有图标的拖拽功能')
    
    // 重置图标设置
    resetIconSettings()
  } else {
    // 退出图标模式
    if (map.value) {
      map.value.setDefaultCursor('default')
    }
    
    // 如果正在编辑图标，先取消编辑
    if (isEditingIcon.value) {
      cancelIconEdit()
    }
    
    // 取消选中和编辑状态
    selectedIconId.value = ''
    isEditingIcon.value = false
    editingIconId.value = ''
    
    // 移除地图点击监听器（如果存在）
     if (clickListener && map.value) {
       map.value.off('click', clickListener)
       clickListener = null
       console.log('已移除图标模式的地图点击监听器')
     }
     
     // 禁用所有图标的拖拽功能
     disableAllIconsDragging()
     console.log('已禁用所有图标的拖拽功能')
  }
}

// 重置图标设置
const resetIconSettings = () => {
  currentIconName.value = `图标${mapIcons.value.length + 1}`
  currentIconEmoji.value = '📍'
  currentIconCategory.value = 'other'
  currentIconDescription.value = ''
}

// 选择emoji
const selectEmoji = (emoji: string) => {
  console.log('selectEmoji 被调用，选择的emoji:', emoji)
  currentIconEmoji.value = emoji
  console.log('当前选中的emoji已更新为:', currentIconEmoji.value)
}

// 添加新图标
const addNewIcon = (coordinates: [number, number]) => {
  console.log('addNewIcon 被调用，坐标:', coordinates)
  console.log('当前图标模式:', isIconMode.value)
  console.log('当前选中的emoji:', currentIconEmoji.value)
  console.log('当前图标名称:', currentIconName.value)
  
  // 验证必要的信息
  if (!currentIconEmoji.value) {
    console.error('未选择emoji')
    alert('请先选择一个图标emoji')
    return
  }
  
  if (!currentIconName.value) {
    console.error('未输入图标名称')
    alert('请输入图标名称')
    return
  }
  
  const newIcon: MapIcon = {
    id: Date.now().toString(),
    name: currentIconName.value || `图标${mapIcons.value.length + 1}`,
    emoji: currentIconEmoji.value,
    coordinates,
    category: currentIconCategory.value,
    description: currentIconDescription.value,
    visible: true,
    style: {
      size: 32,
      bgColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 6,
      shadow: true
    }
  }
  
  console.log('准备添加新图标:', newIcon)
  
  // 添加到数组
  mapIcons.value.push(newIcon)
  console.log('图标已添加到数组，当前图标数量:', mapIcons.value.length)
  
  // 在地图上创建标记
  createIconMarker(newIcon)
  
  // 保存到本地存储
  saveIconsToLocal()
  
  // 重置设置为下一个图标
  resetIconSettings()
  
  console.log('图标添加完成:', newIcon)
}

// 创建图标标记
const createIconMarker = (icon: MapIcon) => {
  if (!map.value) return
  
  const AMap = (window as any).AMap
  
  const marker = new AMap.Marker({
    position: icon.coordinates,
    content: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${icon.style?.size || 32}px;
        height: ${icon.style?.size || 32}px;
        font-size: 18px;
        background: ${icon.style?.bgColor || 'rgba(255, 255, 255, 0.9)'};
        border-radius: ${icon.style?.borderRadius || 6}px;
        ${icon.style?.shadow ? 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);' : ''}
        cursor: move;
        transition: all 0.3s ease;
      " 
      onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.2)';" 
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='${icon.style?.shadow ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'}';"
      title="拖拽移动图标位置">
        ${icon.emoji}
      </div>
    `,
    offset: new AMap.Pixel(-16, -16),
    extData: { iconId: icon.id },
    zIndex: 1000,
    draggable: isIconMode.value // 根据当前模式设置拖拽状态
  })
  
  // 添加点击事件
  marker.on('click', () => {
    if (isIconMode.value) {
      editIcon(icon.id)
    }
  })
  
  // 添加右键菜单事件
  marker.on('rightclick', (e: any) => {
    e.originEvent.preventDefault() // 阻止浏览器默认右键菜单
    showIconContextMenu(icon.id, icon.name)
  })
  
  // 添加拖拽结束事件
  marker.on('dragend', (e: any) => {
    const newPosition = e.target.getPosition()
    const newCoordinates: [number, number] = [newPosition.lng, newPosition.lat]
    
    console.log(`图标 ${icon.name} 被拖拽到新位置:`, newCoordinates)
    
    // 更新图标数据
    const iconIndex = mapIcons.value.findIndex(item => item.id === icon.id)
    if (iconIndex !== -1) {
      mapIcons.value[iconIndex].coordinates = newCoordinates
      
      // 保存到本地存储
      saveIconsToLocal()
      
      console.log('图标位置已更新并保存')
    }
  })
  
  // 添加信息窗体
  const infoWindow = new AMap.InfoWindow({
    content: `
      <div style="padding: 12px; min-width: 200px;">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">${icon.emoji}</span>
          ${icon.name}
        </div>
        <div style="color: #666; margin-bottom: 4px;">类别: ${getCategoryLabel(icon.category)}</div>
        <div style="color: #666; margin-bottom: 8px;">坐标: ${icon.coordinates[0].toFixed(4)}, ${icon.coordinates[1].toFixed(4)}</div>
        ${icon.description ? `<div style="color: #333; font-size: 14px;">${icon.description}</div>` : ''}
      </div>
    `,
    offset: new AMap.Pixel(0, -30)
  })
  
  marker.on('mouseover', () => {
    if (!isEditingIcon.value) {
      infoWindow.open(map.value, icon.coordinates)
    }
  })
  
  marker.on('mouseout', () => {
    if (!isEditingIcon.value) {
      infoWindow.close()
    }
  })
  
  // 保存标记引用
  icon.marker = marker
  iconMarkers.value.push(marker)
  
  // 添加到地图
  map.value.add(marker)
}

// 获取类别标签
const getCategoryLabel = (category: string) => {
  const labels: { [key: string]: string } = {
    monitoring: '监测点',
    agriculture: '农业设施',
    education: '教育区域',
    storage: '存储设施',
    other: '其他'
  }
  return labels[category] || '其他'
}

// 选择图标
const selectIcon = (iconId: string) => {
  selectedIconId.value = iconId
}

// 编辑图标
const editIcon = (iconId: string) => {
  const icon = mapIcons.value.find(i => i.id === iconId)
  if (!icon) return
  
  // 设置编辑状态
  isEditingIcon.value = true
  editingIconId.value = iconId
  selectedIconId.value = iconId
  
  // 填充编辑表单
  currentIconName.value = icon.name
  currentIconEmoji.value = icon.emoji
  currentIconCategory.value = icon.category
  currentIconDescription.value = icon.description || ''
  
  console.log('开始编辑图标:', icon)
}

// 应用图标更改
const applyIconChanges = () => {
  const icon = mapIcons.value.find(i => i.id === editingIconId.value)
  if (!icon) return
  
  // 更新图标数据
  icon.name = currentIconName.value
  icon.emoji = currentIconEmoji.value
  icon.category = currentIconCategory.value
  icon.description = currentIconDescription.value
  
  // 移除旧标记
  if (icon.marker) {
    map.value.remove(icon.marker)
    const markerIndex = iconMarkers.value.indexOf(icon.marker)
    if (markerIndex > -1) {
      iconMarkers.value.splice(markerIndex, 1)
    }
  }
  
  // 创建新标记
  createIconMarker(icon)
  
  // 保存到本地存储
  saveIconsToLocal()
  
  // 退出编辑模式
  cancelIconEdit()
  
  console.log('图标更改已应用:', icon)
}

// 取消图标编辑
const cancelIconEdit = () => {
  isEditingIcon.value = false
  editingIconId.value = ''
  selectedIconId.value = ''
  resetIconSettings()
}

// 删除图标
const deleteIcon = (iconId: string) => {
  if (!confirm('确定要删除这个图标吗？')) return
  
  const iconIndex = mapIcons.value.findIndex(i => i.id === iconId)
  if (iconIndex === -1) return
  
  const icon = mapIcons.value[iconIndex]
  
  // 从地图移除标记
  if (icon.marker) {
    map.value.remove(icon.marker)
    const markerIndex = iconMarkers.value.indexOf(icon.marker)
    if (markerIndex > -1) {
      iconMarkers.value.splice(markerIndex, 1)
    }
  }
  
  // 从数组移除
  mapIcons.value.splice(iconIndex, 1)
  
  // 清除选中状态
  if (selectedIconId.value === iconId) {
    selectedIconId.value = ''
  }
  
  // 如果正在编辑这个图标，退出编辑模式
  if (editingIconId.value === iconId) {
    cancelIconEdit()
  }
  
  // 保存到本地存储
  saveIconsToLocal()
  
  console.log('图标已删除:', iconId)
}

// 移动到图标位置
const moveToIcon = (icon: MapIcon) => {
  if (!map.value) return
  
  map.value.setZoomAndCenter(16, icon.coordinates)
  selectIcon(icon.id)
  
  // 2秒后取消选中
  setTimeout(() => {
    if (selectedIconId.value === icon.id) {
      selectedIconId.value = ''
    }
  }, 2000)
}

// 切换图标可见性
const toggleIconVisibility = (iconId: string) => {
  const icon = mapIcons.value.find(i => i.id === iconId)
  if (!icon) return
  
  // 切换可见状态
  icon.visible = icon.visible === false ? true : false
  
  // 根据可见状态控制地图上的显示
  if (icon.visible === false) {
    // 隐藏图标 - 从地图移除标记
    if (icon.marker) {
      map.value.remove(icon.marker)
      // 从iconMarkers数组中移除
      const markerIndex = iconMarkers.value.indexOf(icon.marker)
      if (markerIndex > -1) {
        iconMarkers.value.splice(markerIndex, 1)
      }
      // 清除marker引用
      icon.marker = null
    }
  } else {
    // 显示图标 - 重新创建标记
    if (!icon.marker) {
      createIconMarker(icon)
    }
  }
  
  // 保存到本地存储
  saveIconsToLocal()
  
  console.log(`图标 "${icon.name}" 可见性已切换为:`, icon.visible)
}

// 复制图标JSON
const copyIconJson = async (icon: MapIcon) => {
  try {
    const iconJson = {
      id: icon.id,
      name: icon.name,
      emoji: icon.emoji,
      position: {
        lng: icon.coordinates[0],
        lat: icon.coordinates[1]
      },
      category: icon.category,
      description: icon.description,
      visible: icon.visible,
      iconStyle: {
        size: icon.style?.size || 32,
        backgroundColor: icon.style?.bgColor || "rgba(255, 255, 255, 0.9)",
        borderRadius: `${icon.style?.borderRadius || 6}px`,
        boxShadow: icon.style?.shadow !== false ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"
      }
    }
    
    const jsonString = JSON.stringify(iconJson, null, 2)
    await navigator.clipboard.writeText(jsonString)
    alert(`图标 "${icon.name}" 的JSON已复制到剪贴板！`)
  } catch (error) {
    console.error('复制失败:', error)
    alert('复制失败，请重试')
  }
}

// 保存图标到本地存储
const saveIconsToLocal = () => {
  try {
    const iconsData = mapIcons.value.map(icon => ({
      id: icon.id,
      name: icon.name,
      emoji: icon.emoji,
      position: {
        lng: icon.coordinates[0],
        lat: icon.coordinates[1]
      },
      category: icon.category,
      description: icon.description,
      visible: icon.visible,
      iconStyle: {
        size: icon.style?.size || 32,
        backgroundColor: icon.style?.bgColor || "rgba(255, 255, 255, 0.9)",
        borderRadius: `${icon.style?.borderRadius || 6}px`,
        boxShadow: icon.style?.shadow !== false ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"
      }
    }))
    
    localStorage.setItem('map_icons', JSON.stringify(iconsData))
    console.log('图标数据已保存到本地存储')
  } catch (error) {
    console.error('保存图标数据失败:', error)
  }
}

// 显示指定分类的所有图标
const showCategoryIcons = (category: string) => {
  mapIcons.value.forEach(icon => {
    if (icon.category === category && icon.visible === false) {
      toggleIconVisibility(icon.id)
    }
  })
}

// 隐藏指定分类的所有图标
const hideCategoryIcons = (category: string) => {
  mapIcons.value.forEach(icon => {
    if (icon.category === category && icon.visible !== false) {
      toggleIconVisibility(icon.id)
    }
  })
}

// 显示所有图标
const showAllIcons = () => {
  mapIcons.value.forEach(icon => {
    if (icon.visible === false) {
      toggleIconVisibility(icon.id)
    }
  })
}

// 隐藏所有图标
const hideAllIcons = () => {
  mapIcons.value.forEach(icon => {
    if (icon.visible !== false) {
      toggleIconVisibility(icon.id)
    }
  })
}

// 从本地存储加载图标
const loadIconsFromLocal = () => {
  try {
    const savedData = localStorage.getItem('map_icons')
    if (savedData) {
      const icons = JSON.parse(savedData)
      icons.forEach((iconData: any) => {
        // 处理新旧格式兼容性
        let coordinates: [number, number]
        if (iconData.position) {
          // 新格式：position对象
          coordinates = [iconData.position.lng, iconData.position.lat]
        } else if (iconData.coordinates) {
          // 旧格式：coordinates数组
          coordinates = iconData.coordinates
        } else {
          console.warn('图标缺少位置信息，跳过加载:', iconData)
          return
        }
        
        // 确保图标有visible属性，默认为true
        const icon: MapIcon = {
          ...iconData,
          coordinates,
          visible: iconData.visible !== undefined ? iconData.visible : true
        }
        mapIcons.value.push(icon)
        // 在地图上创建标记
        createIconMarker(icon)
      })
      console.log('图标加载成功，共加载', icons.length, '个图标')
    }
  } catch (error) {
    console.error('加载图标失败:', error)
  }
}

// 显示图标右键菜单
const showIconContextMenu = (iconId: string, iconName: string) => {
  const menuItems = [
    '删除图标',
    '复制图标'
  ]
  
  const choice = prompt(`图标"${iconName}"操作菜单（输入数字）：\n${menuItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}`, '1')
  
  if (choice) {
    const choiceNum = parseInt(choice)
    switch (choiceNum) {
      case 1:
        deleteIcon(iconId)
        break
      case 2:
        duplicateIconFromMenu(iconId)
        break
    }
  }
}

// 复制图标（右键菜单）
const duplicateIconFromMenu = (iconId: string) => {
  const originalIcon = mapIcons.value.find(icon => icon.id === iconId)
  if (!originalIcon) return
  
  // 创建新图标，位置稍微偏移
  const newCoordinates: [number, number] = [
    originalIcon.coordinates[0] + 0.001, // 经度偏移
    originalIcon.coordinates[1] + 0.001  // 纬度偏移
  ]
  
  const newIcon: MapIcon = {
    ...originalIcon,
    id: Date.now().toString(),
    name: `${originalIcon.name}_副本`,
    coordinates: newCoordinates
  }
  
  // 添加到数组
  mapIcons.value.push(newIcon)
  
  // 在地图上创建标记
  createIconMarker(newIcon)
  
  // 保存到本地存储
  saveIconsToLocal()
  
  console.log(`图标"${originalIcon.name}"已复制`)
}

// 启用所有图标的拖拽功能
const enableAllIconsDragging = () => {
  iconMarkers.value.forEach(marker => {
    if (marker && marker.setDraggable) {
      marker.setDraggable(true)
    }
  })
}

// 禁用所有图标的拖拽功能
const disableAllIconsDragging = () => {
  iconMarkers.value.forEach(marker => {
    if (marker && marker.setDraggable) {
      marker.setDraggable(false)
    }
  })
}

// 清除所有图标
const clearAllIcons = () => {
  if (!confirm('确定要清空所有图标吗？')) return
  
  // 从地图移除所有图标标记
  iconMarkers.value.forEach(marker => {
    if (map.value) {
      map.value.remove(marker)
    }
  })
  
  // 清空数组
  mapIcons.value = []
  iconMarkers.value = []
  selectedIconId.value = ''
  
  // 如果正在编辑，退出编辑模式
  if (isEditingIcon.value) {
    cancelIconEdit()
  }
  
  // 保存到本地存储
  saveIconsToLocal()
  
  console.log('所有图标已清空')
}

// 生命周期
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  cleanupCurrentDraw()
  
  // 清理图标标记
  iconMarkers.value.forEach(marker => {
    if (map.value) {
      map.value.remove(marker)
    }
  })
  iconMarkers.value = []
})
</script>

<style scoped> 
.map-draw-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
}

/* 工具栏样式 */
.toolbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 60px;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.draw-controls,
.action-controls {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.area-settings {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.area-settings h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
  padding-right: 8px;
  border-right: 1px solid #dee2e6;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.setting-group label {
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
  font-weight: 500;
}

.area-name-input {
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 3px;
  font-size: 12px;
  width: 120px;
  height: 28px;
  transition: border-color 0.2s ease;
}

.area-name-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.color-picker {
  width: 32px;
  height: 28px;
  border: 1px solid #ced4da;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.color-picker:hover {
  border-color: #007bff;
}

.fill-color-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  cursor: pointer;
  user-select: none;
  color: #6c757d;
  font-weight: 500;
}

.no-fill-checkbox {
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #007bff;
}

.color-picker:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 按钮样式 */
.control-btn {
  padding: 6px 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  min-height: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #495057;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.2);
}

.control-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.start-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #28a745;
}

.start-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
  border-color: #1e7e34;
}

.stop-btn {
  background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
  color: white;
  border-color: #dc3545;
}

.stop-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #c0392b 100%);
  border-color: #bd2130;
}

.undo-btn {
  background: linear-gradient(135deg, #ffc107 0%, #f39c12 100%);
  color: #212529;
  border-color: #ffc107;
}

.undo-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e0a800 0%, #d68910 100%);
  border-color: #d39e00;
}

.redo-btn {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border-color: #6c757d;
}

.redo-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  border-color: #545b62;
}

.complete-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-color: #007bff;
}

.complete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0069d9 0%, #004085 100%);
  border-color: #0062cc;
}

.delete-btn {
  background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
  color: white;
  border-color: #dc3545;
}

.delete-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #c0392b 100%);
  border-color: #bd2130;
}

.exit-edit-btn {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border-color: #6c757d;
}

.exit-edit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  border-color: #545b62;
}

.apply-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  width: 100%;
  margin-top: 10px;
}

.apply-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049, #3d8b40);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.stroke-width-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stroke-width-slider {
  flex: 1;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  min-width: 60px;
}

.stroke-width-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.stroke-width-slider::-webkit-slider-thumb:hover {
  background: #0056b3;
}

.stroke-width-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.stroke-width-slider::-moz-range-thumb:hover {
  background: #0056b3;
}

.stroke-width-value {
  min-width: 30px;
  font-size: 11px;
  color: #6c757d;
  text-align: center;
  font-weight: 500;
}

/* 地址搜索面板样式 */
.search-panel {
  position: absolute;
  bottom: 120px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

/* 模式状态提示样式 */
.mode-status {
  margin: 12px 0;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.4;
}

.status-editing {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffc107;
  color: #856404;
}

.status-adding {
  background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
  border: 1px solid #17a2b8;
  color: #0c5460;
}

.status-icon {
  margin-right: 6px;
  font-size: 14px;
}

.status-text {
   font-weight: 500;
 }

.search-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 280px;
  height: 36px;
  padding: 0 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #409eff, #3a8ee6);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 16px;
}

.search-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3a8ee6, #337ecc);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.save-btn {
  background: #409eff;
  color: white;
}

.save-btn:hover {
  background: #337ecc;
}

.export-btn {
  background: #909399;
  color: white;
}

.export-btn:hover {
  background: #82848a;
}

.clear-btn {
  background: #f56c6c;
  color: white;
}

.clear-btn:hover {
  background: #f45454;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图标设置面板 */
.icon-settings {
  position: absolute;
  top: 90px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  z-index: 1001;
  min-width: 280px;
}

.icon-settings h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-option,
.emoji-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
}

.emoji-option:hover,
.emoji-btn:hover {
  border-color: #409eff;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.emoji-option.selected,
.emoji-btn.active {
  border-color: #409eff;
  background: #f0f8ff;
  transform: scale(1.05);
}

.icon-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icon-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.icon-form label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.icon-form input,
.icon-form select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.3s ease;
}

.icon-form input:focus,
.icon-form select:focus {
  border-color: #409eff;
}

.icon-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

.icon-actions .control-btn {
  padding: 6px 12px;
  font-size: 12px;
}

/* 操作提示 */
.drawing-tips {
  position: absolute;
  top: 90px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 1001;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 300px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item .icon-info::before {
  content: 'ℹ';
  color: #409eff;
  font-weight: bold;
}

/* 地图容器 */
.map-container {
  width: 100%;
  height: 100%;
  padding-top: 80px;
  padding-right: 300px;
  box-sizing: border-box;
}

/* 区域列表 */
.area-list {
  position: absolute;
  top: 80px;
  right: 0;
  width: 300px;
  height: calc(100vh - 80px);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  z-index: 999;
}

.area-list h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.area-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.area-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.area-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.area-item.active {
  border-color: #409eff;
  background: #f0f8ff;
}

.area-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.area-name {
  font-weight: 500;
  color: #333;
}

.area-colors {
  display: flex;
  gap: 4px;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.area-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.move-to-btn {
  background: #eeeeee;
  color: white;
}

.move-to-btn:hover {
  background: #28a745;
}

.copy-json-btn {
  background: #eeeeee;
  color: white;
}

.copy-json-btn:hover {
  background: #337ecc;
}

.edit-btn {
  background: #eeeeee;
  color: white;
}

.edit-btn:hover {
  background: #d4a31b;
}

.action-btn.delete-btn {
  background: #eeeeee;
  color: white;
}

.action-btn.delete-btn:hover {
  background: #f45454;
}

.visibility-btn {
  background: #28a745;
  color: white;
  opacity: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.visibility-btn:hover {
  background: #218838;
}

.visibility-btn.hidden {
  background: #dc3545;
  color: white;
  opacity: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.visibility-btn.hidden:hover {
  background: #c82333;
}

/* 图标列表样式 */
.icon-list {
  margin-top: 20px;
}

.icon-list h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.icon-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.icon-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.icon-item.active {
  border-color: #409eff;
  background: #f0f8ff;
}

.icon-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.icon-details {
  flex: 1;
}

.icon-emoji {
  font-size: 20px;
  margin-right: 8px;
}

.icon-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.icon-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.icon-category {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  display: inline-block;
  margin-bottom: 2px;
}

.icon-coordinates {
  font-family: monospace;
  font-size: 11px;
}

.icon-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

/* 代码弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.code-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow: hidden;
}

.code-textarea {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: none;
  background: #f8f9fa;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.copy-btn {
  background: #67c23a;
  color: white;
}

.copy-btn:hover {
  background: #5daf34;
}

/* 绘制标记点样式 */
.drawing-marker {
  position: relative;
  cursor: pointer;
  z-index: 1000;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #409eff;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.drawing-marker:hover .marker-dot {
  width: 16px;
  height: 16px;
  background: #f56c6c;
  transform: translate(-2px, -2px);
}

.marker-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
  pointer-events: none;
}

/* 编辑模式顶点标记样式 */
.edit-marker {
  position: relative;
  width: 24px;
  height: 24px;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-marker-dot {
  width: 20px;
  height: 20px;
  background: #4CAF50;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 3px 6px rgba(0,0,0,0.4);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-marker:hover .edit-marker-dot {
  background: #45a049;
  transform: scale(1.1);
}

.edit-marker-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 11px;
  font-weight: bold;
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  z-index: 1;
}

/* 图标显示控制样式 */
.icon-visibility-controls {
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
  margin-top: 15px;
}

.icon-visibility-controls label {
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: block;
}

.visibility-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.show-all-icons-btn,
.hide-all-icons-btn {
  flex: 1;
  min-width: 120px;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.show-all-icons-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #28a745;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.hide-all-icons-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
  color: white;
  border-color: #dc3545;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

.show-all-icons-btn:disabled,
.hide-all-icons-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f8f9fa;
  color: #6c757d;
}

/* 图标样式 */
.icon-play::before { content: '▶';  font-style: normal;}
.icon-stop::before { content: '⏹';  font-style: normal;}
.icon-undo::before { content: '↶';  font-style: normal;}
.icon-redo::before { content: '↷';  font-style: normal;}
.icon-complete::before { content: '✓'; font-style: normal; }
.icon-delete::before { content: '🗑'; font-style: normal; }
.icon-save::before { content: '💾';  font-style: normal;}
.icon-export::before { content: '📤'; font-style: normal; }
.icon-clear::before { content: '🗑'; font-style: normal; }
.icon-edit::before { content: '✏️';  font-style: normal;}
.icon-exit::before { content: '✕';  font-style: normal;}
.icon-apply::before { content: '✓'; font-style: normal; }
.icon-search::before { content: '🔍'; font-style: normal; }
.icon-copy::before { content: '📋';  font-style: normal;}
.icon-loation::before { content: '📍'; font-style: normal;}
.icon-location::before { content: '📍'; font-style: normal;}
.icon-marker::before { content: '📍'; font-style: normal;}
.icon-cancel::before { content: '✕'; font-style: normal;}
.icon-eye::before { content: '👁'; font-style: normal;}
.icon-eye-off::before { content: '🙈'; font-style: normal;}

/* 响应式设计 */
@media (max-width: 1200px) {
  .map-container {
    padding-right: 0;
    padding-bottom: 300px;
  }
  
  .area-list {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 300px;
  }
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
    padding: 10px;
  }
  
  .toolbar-section {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .area-settings {
    flex-direction: column;
    gap: 10px;
  }
  
  .setting-group {
    justify-content: space-between;
    width: 100%;
  }
  
  .area-name-input {
    width: 120px;
  }
  
  .map-container {
    padding-top: 140px;
  }
  
  .area-list {
    top: 140px;
  }
}

/* 高德地图联想下拉框样式 - 最强覆盖 */
.amap-sug-result {
  color: #000000 !important;
  background-color: #ffffff !important;
}

.amap-sug-result .auto-item {
  color: #000000 !important;
  background-color: #ffffff !important;
}

.auto-item {
  color: #000000 !important;
  background-color: #ffffff !important;
}

/* 更强的样式覆盖 */
div.amap-sug-result {
  color: #000000 !important;
  background-color: #ffffff !important;
}

div.amap-sug-result div.auto-item {
  color: #000000 !important;
  background-color: #ffffff !important;
}

/* 针对body内的样式覆盖 */
body .amap-sug-result {
  color: #000000 !important;
  background-color: #ffffff !important;
}

body .amap-sug-result .auto-item {
  color: #000000 !important;
  background-color: #ffffff !important;
}

body div.amap-sug-result {
  color: #000000 !important;
  background-color: #ffffff !important;
}

body div.amap-sug-result div.auto-item {
  color: #000000 !important;
  background-color: #ffffff !important;
}

/* 使用属性选择器进行更精确的覆盖 */
div[class="amap-sug-result"] {
  color: #000000 !important;
  background-color: #ffffff !important;
}

div[class="amap-sug-result"] div[class="auto-item"] {
  color: #000000 !important;
  background-color: #ffffff !important;
}

/* 使用通配符选择器确保覆盖所有可能的情况 */
* .amap-sug-result,
* .amap-sug-result * {
  color: #000000 !important;
}

* .auto-item {
  color: #000000 !important;
  background-color: #ffffff !important;
}

/* 针对可能的内联样式覆盖 */
.amap-sug-result[style*="color"] {
  color: #000000 !important;
}

.auto-item[style*="color"] {
  color: #000000 !important;
  background-color: #ffffff !important;
}
</style>