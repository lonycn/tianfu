<template>
  <div class="ecology-page">
    <!-- 科技背景 -->
    <div class="tech-bg">
      <div class="water-wave"></div>
      <div class="grid-overlay"></div>
    </div>
    
    <!-- 页面头部 -->
    <UnifiedHeader />

    <!-- 数据统计横幅 -->
    <section class="data-banner">
      <div class="banner-item" v-for="item in summaryData" :key="item.label">
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-content">
          <div class="item-value">
            <span class="number">{{ item.value }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
          <div class="item-label">{{ item.label }}</div>
        </div>
      </div>
    </section>

    <!-- 主内容 -->
    <main class="page-main">
      <!-- 左侧：图像轮播 + 鸟类图谱 -->
      <section class="left-section">
        <!-- 鸟类实拍图像轮播 -->
        <div class="bird-carousel-card">
          <h2 class="section-title">
            <i class="icon-bird"></i>
            鸟类实时监测
          </h2>
          
          <div class="carousel-container">
            <div class="carousel-main">
              <div class="bird-image-wrapper">
                <div class="image-placeholder">
                  <div class="bird-icon">🦅</div>
                  <div class="image-label">图像加载中...</div>
                </div>
                <div class="image-info">
                  <h3 class="bird-name">{{ currentBirdImage.name }}</h3>
                  <div class="bird-details">
                    <span class="detail-item">
                      <i>📍</i> {{ currentBirdImage.location }}
                    </span>
                    <span class="detail-item">
                      <i>🕰️</i> {{ currentBirdImage.time }}
                    </span>
                  </div>
                  <div class="ai-recognition" v-if="currentBirdImage.aiResult">
                    <span class="ai-badge">AI识别</span>
                    <span class="ai-result">{{ currentBirdImage.aiResult }}</span>
                    <span class="confidence">置信度: {{ currentBirdImage.confidence }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 轮播指示器 -->
            <div class="carousel-indicators">
              <span 
                v-for="(img, index) in birdImages" 
                :key="img.id"
                class="indicator"
                :class="{ active: currentBirdIndex === index }"
                @click="selectBirdImage(index)"
              ></span>
            </div>
          </div>
        </div>
        
        <!-- 鸟类图谱列表 -->
        <div class="bird-atlas-card">
          <div class="atlas-header">
            <h3 class="subsection-title">鸟类图谱</h3>
            <button class="load-more-btn" @click="loadMoreBirds">
              查看更多鸟类 <span class="count">({{ totalBirdSpecies }})</span>
            </button>
          </div>
          
          <div class="atlas-grid">
            <div 
              v-for="bird in birdAtlas" 
              :key="bird.id"
              class="bird-card"
              :class="{ protected: bird.protected }"
              @click="showBirdDetail(bird)"
            >
              <div class="bird-avatar">{{ bird.icon }}</div>
              <div class="bird-info">
                <div class="bird-name">{{ bird.name }}</div>
                <div class="bird-scientific">{{ bird.scientific }}</div>
                <div class="bird-habitat">
                  <i>🌿</i> {{ bird.habitat }}
                </div>
                <div class="protection-badge" v-if="bird.protected">
                  {{ bird.protectionLevel }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 右侧：动态数据图表 -->
      <section class="right-section">
        <!-- 年度鸟类发现数量折线图 -->
        <div class="bird-trend-card">
          <h2 class="section-title">
            <i class="icon-chart"></i>
            鸟类监测趋势
          </h2>
          
          <div class="chart-container">
            <canvas ref="birdTrendChart" width="500" height="280"></canvas>
          </div>
          
          <div class="trend-legend">
            <div class="legend-item">
              <span class="legend-dot" style="background: #178DFF"></span>
              <span class="legend-label">新增种类</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #62C370"></span>
              <span class="legend-label">监测样本数</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #FFB74D"></span>
              <span class="legend-label">保护种类</span>
            </div>
          </div>
        </div>
        
        <!-- 鸟类分类分布饼图 -->
        <div class="bird-distribution-card">
          <h3 class="subsection-title">鸟类分类分布</h3>
          
          <div class="distribution-content">
            <div class="pie-chart-wrapper">
              <canvas ref="birdPieChart" width="220" height="220"></canvas>
            </div>
            
            <div class="distribution-list">
              <div v-for="category in birdCategories" :key="category.name" class="category-item">
                <span class="category-dot" :style="{ background: category.color }"></span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}种</span>
                <span class="category-percent">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 监测热度区域图 -->
        <div class="hotspot-map-card">
          <h3 class="subsection-title">鸟类活跃度热力图</h3>
          
          <div class="hotspot-content">
            <div class="map-wrapper">
              <div class="hotspot-area" v-for="area in hotspotAreas" :key="area.id">
                <div 
                  class="area-marker" 
                  :class="area.activity"
                  :style="{ left: area.x + '%', top: area.y + '%' }"
                >
                  <div class="area-name">{{ area.name }}</div>
                  <div class="area-count">{{ area.count }}种</div>
                  <div class="pulse-ring"></div>
                </div>
              </div>
              <div class="map-legend">
                <span class="legend-title">活跃度</span>
                <div class="legend-scale">
                  <span class="scale-low">低</span>
                  <div class="scale-gradient"></div>
                  <span class="scale-high">高</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 底部辅助区 -->
    <section class="bottom-section">
      <!-- 湿地修复前后对比 -->
      <div class="restoration-comparison">
        <h2 class="section-title">
          <i class="icon-compare"></i>
          湿地修复成果
        </h2>
        
        <div class="comparison-content">
          <div class="comparison-item before">
            <div class="year-label">2013年</div>
            <div class="image-placeholder">
              <div class="status-icon">🏜️</div>
              <div class="status-text">退化湿地</div>
            </div>
            <div class="metrics">
              <div class="metric">湿地率: 45.2%</div>
              <div class="metric">鸟类: 89种</div>
              <div class="metric">植被覆盖: 62%</div>
            </div>
          </div>
          
          <div class="vs-divider">
            <div class="vs-icon">VS</div>
            <div class="progress-arrow">→</div>
          </div>
          
          <div class="comparison-item after">
            <div class="year-label">2024年</div>
            <div class="image-placeholder">
              <div class="status-icon">🌳</div>
              <div class="status-text">生态湿地</div>
            </div>
            <div class="metrics">
              <div class="metric highlight">湿地率: 63.62%</div>
              <div class="metric highlight">鸟类: 235种</div>
              <div class="metric highlight">植被覆盖: 92%</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 生态标语滚动 -->
      <div class="ecological-slogans">
        <div class="slogan-track" ref="sloganTrack">
          <div class="slogan-item" v-for="(slogan, index) in [...slogans, ...slogans]" :key="index">
            <span class="slogan-icon">🌿</span>
            <span class="slogan-text">{{ slogan }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import UnifiedHeader from '@/components/UnifiedHeader.vue'

// Canvas refs
const birdTrendChart = ref<HTMLCanvasElement | null>(null)
const birdPieChart = ref<HTMLCanvasElement | null>(null)
const sloganTrack = ref<HTMLDivElement | null>(null)

// 状态数据
const currentBirdIndex = ref(0)
const totalBirdSpecies = ref(235)
let birdCarouselInterval: number | null = null

// 顶部数据总览
const summaryData = ref([
  { icon: '🌳', label: '恢复湿地面积', value: '495.94', unit: '公顷' },
  { icon: '📊', label: '当前湿地率', value: '63.62', unit: '%' },
  { icon: '🦅', label: '已监测鸟类种类', value: '235', unit: '种' },
  { icon: '⭐', label: '国家重点保护鸟类', value: '56', unit: '种' }
])

// 鸟类图像轮播数据
const birdImages = ref([
  {
    id: 1,
    name: '中华秋沙鸭',
    location: '红房子观鸟区',
    time: '2024-01-15 14:32',
    aiResult: '中华秋沙鸭 (国家一级)',
    confidence: 98.5
  },
  {
    id: 2,
    name: '黑鹳',
    location: '水岸湿地',
    time: '2024-01-15 15:18',
    aiResult: '黑鹳 (国家二级)',
    confidence: 96.2
  },
  {
    id: 3,
    name: '苍鹭',
    location: '芦苇荡',
    time: '2024-01-15 16:45',
    aiResult: '苍鹭 (涉禽)',
    confidence: 99.1
  },
  {
    id: 4,
    name: '白鹭',
    location: '核心保护区',
    time: '2024-01-15 17:20',
    aiResult: '白鹭 (常见种)',
    confidence: 97.8
  },
  {
    id: 5,
    name: '青头潜鸭',
    location: '缓冲区',
    time: '2024-01-15 18:05',
    aiResult: '青头潜鸭 (极危物种)',
    confidence: 94.3
  }
])

const currentBirdImage = computed(() => birdImages.value[currentBirdIndex.value] || birdImages.value[0])

// 鸟类图谱
const birdAtlas = ref([
  {
    id: 1,
    icon: '🦅',
    name: '东方白鹳',
    scientific: 'Ciconia boyciana',
    habitat: '湿地、沼泽',
    protected: true,
    protectionLevel: '国家一级'
  },
  {
    id: 2,
    icon: '🦆',
    name: '黑脸琵鹭',
    scientific: 'Platalea minor',
    habitat: '浅水区',
    protected: true,
    protectionLevel: '国家一级'
  },
  {
    id: 3,
    icon: '🦜',
    name: '绿头鸭',
    scientific: 'Anas platyrhynchos',
    habitat: '湖泊、河流',
    protected: false
  },
  {
    id: 4,
    icon: '🦚',
    name: '小天鹅',
    scientific: 'Cygnus columbianus',
    habitat: '大型水域',
    protected: true,
    protectionLevel: '国家二级'
  },
  {
    id: 5,
    icon: '🦉',
    name: '普通鸬鹚',
    scientific: 'Tachybaptus ruficollis',
    habitat: '淡水湖泊',
    protected: false
  },
  {
    id: 6,
    icon: '🦜',
    name: '赤麻鸭',
    scientific: 'Tadorna ferruginea',
    habitat: '咸淡水交界',
    protected: false
  }
])

// 鸟类分类数据
const birdCategories = ref([
  { name: '涉禽', count: 78, percentage: 33.2, color: '#178DFF' },
  { name: '鸣禽', count: 65, percentage: 27.7, color: '#62C370' },
  { name: '猛禽', count: 24, percentage: 10.2, color: '#FFB74D' },
  { name: '游禽', count: 42, percentage: 17.9, color: '#FF7043' },
  { name: '其他', count: 26, percentage: 11.0, color: '#9C27B0' }
])

// 监测热点区域
const hotspotAreas = ref([
  { id: 1, name: '红房子', x: 25, y: 30, count: 89, activity: 'high' },
  { id: 2, name: '水岸', x: 50, y: 45, count: 67, activity: 'high' },
  { id: 3, name: '林带', x: 75, y: 35, count: 45, activity: 'medium' },
  { id: 4, name: '芦苇荡', x: 35, y: 65, count: 56, activity: 'high' },
  { id: 5, name: '缓冲区', x: 60, y: 70, count: 34, activity: 'medium' },
  { id: 6, name: '实验区', x: 80, y: 60, count: 23, activity: 'low' }
])

// 生态标语
const slogans = ref([
  '每一只归来的鸟，都是生态修复的答卷',
  '还湿于地，赋生于林',
  '智慧监测守护生物多样性',
  '用科技之眼，见证生态之美',
  '保护湿地就是保护我们的未来'
])

// 鸟类图像切换
const selectBirdImage = (index: number) => {
  currentBirdIndex.value = index
}

// 自动轮播
const startBirdCarousel = () => {
  birdCarouselInterval = window.setInterval(() => {
    currentBirdIndex.value = (currentBirdIndex.value + 1) % birdImages.value.length
  }, 5000)
}

const stopBirdCarousel = () => {
  if (birdCarouselInterval) {
    clearInterval(birdCarouselInterval)
    birdCarouselInterval = null
  }
}

// 加载更多鸟类
const loadMoreBirds = () => {
  // 模拟加载更多
  console.log('Loading more birds...')
}

// 显示鸟类详情
const showBirdDetail = (bird: any) => {
  console.log('Show bird detail:', bird)
}

// 绘制鸟类趋势图
const drawBirdTrendChart = () => {
  if (!birdTrendChart.value) return
  
  const ctx = birdTrendChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 500, 280)
  
  // 模拟数据
  const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
  const newSpecies = [12, 15, 8, 23, 19, 16, 21]
  const samples = [1200, 1450, 1680, 2100, 2450, 2800, 3200]
  const protectedSpecies = [42, 45, 48, 51, 53, 54, 56]
  
  const chartWidth = 440
  const chartHeight = 220
  const startX = 40
  const startY = 240
  const stepX = chartWidth / (years.length - 1)
  
  // 绘制网格
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = startY - (i * chartHeight / 5)
    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(startX + chartWidth, y)
    ctx.stroke()
  }
  
  // 绘制新增种类线
  ctx.strokeStyle = '#178DFF'
  ctx.lineWidth = 3
  ctx.beginPath()
  newSpecies.forEach((value, index) => {
    const x = startX + index * stepX
    const y = startY - (value / 30) * chartHeight
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()
  
  // 绘制点
  newSpecies.forEach((value, index) => {
    const x = startX + index * stepX
    const y = startY - (value / 30) * chartHeight
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#178DFF'
    ctx.fill()
  })
  
  // 绘制年份标签
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  years.forEach((year, index) => {
    const x = startX + index * stepX
    ctx.fillText(year, x, 265)
  })
}

// 绘制鸟类分布饼图
const drawBirdPieChart = () => {
  if (!birdPieChart.value) return
  
  const ctx = birdPieChart.value.getContext('2d')
  if (!ctx) return
  
  ctx.clearRect(0, 0, 220, 220)
  
  const centerX = 110
  const centerY = 110
  const radius = 80
  
  let currentAngle = -Math.PI / 2
  
  birdCategories.value.forEach((category) => {
    const angle = (category.percentage / 100) * Math.PI * 2
    
    // 绘制扇形
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle)
    ctx.closePath()
    ctx.fillStyle = category.color
    ctx.fill()
    
    // 绘制标签
    const labelAngle = currentAngle + angle / 2
    const labelX = centerX + Math.cos(labelAngle) * (radius + 20)
    const labelY = centerY + Math.sin(labelAngle) * (radius + 20)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(category.percentage + '%', labelX, labelY)
    
    currentAngle += angle
  })
  
  // 绘制中心圆
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI)
  ctx.fillStyle = '#0a0f1b'
  ctx.fill()
}

// 标语滚动动画
const startSloganAnimation = () => {
  if (!sloganTrack.value) return
  
  const track = sloganTrack.value
  let position = 0
  
  const animate = () => {
    position -= 1
    if (position <= -track.scrollWidth / 2) {
      position = 0
    }
    track.style.transform = `translateX(${position}px)`
    requestAnimationFrame(animate)
  }
  
  requestAnimationFrame(animate)
}

onMounted(() => {
  // 初始化图表
  setTimeout(() => {
    drawBirdTrendChart()
    drawBirdPieChart()
  }, 100)
  
  // 启动鸟类图像轮播
  startBirdCarousel()
  
  // 启动标语滚动
  startSloganAnimation()
})

onUnmounted(() => {
  stopBirdCarousel()
})
</script>

<style scoped lang="scss">
.ecology-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a1628, #1a2f4e);
  color: #fff;
  overflow: hidden;
  position: relative;
  padding: 0;
}

// 科技背景效果
.tech-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .water-wave {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 30%, rgba(0, 170, 255, 0.05) 50%, transparent 70%);
    animation: wave 15s ease-in-out infinite;
  }

  .grid-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }
}

@keyframes wave {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(50%) translateY(-20px); }
}

// 数据统计横幅
.data-banner {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding: 0 20px;

  .banner-item {
    flex: 1;
    background: linear-gradient(135deg, rgba(20, 35, 60, 0.9), rgba(10, 25, 50, 0.9));
    border: 1px solid rgba(50, 120, 180, 0.4);
    border-radius: 6px;
    padding: 15px 20px;
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00ff88, transparent);
      animation: shimmer 3s infinite;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 15px rgba(0, 255, 136, 0.2);
      border-color: rgba(0, 255, 136, 0.5);
    }

    .item-icon {
      font-size: 2rem;
      filter: drop-shadow(0 2px 4px rgba(0, 255, 136, 0.3));
      flex-shrink: 0;
    }

    .item-content {
      flex: 1;
      
      .item-value {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-bottom: 2px;

        .number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00aaff;
          text-shadow: 0 1px 3px rgba(0, 170, 255, 0.3);
        }

        .unit {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
      }

      .item-label {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.2;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

// 主内容区域
.page-main {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
  padding: 0 20px;
}

.left-section {
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .bird-carousel-card {
    background: rgba(20, 35, 60, 0.8);
    border: 1px solid rgba(50, 120, 180, 0.5);
    border-radius: 8px;
    padding: 20px;
    backdrop-filter: blur(10px);
    height: 350px;

    .carousel-container {
      height: calc(100% - 50px);

      .carousel-main {
        height: calc(100% - 30px);
        position: relative;
        background: rgba(10, 20, 40, 0.6);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(100, 200, 255, 0.3);

        .bird-image-wrapper {
          height: 100%;
          display: flex;
          flex-direction: column;

          .image-placeholder {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(0, 170, 255, 0.1), rgba(0, 255, 136, 0.1));

            .bird-icon {
              font-size: 4rem;
              margin-bottom: 10px;
              filter: drop-shadow(0 3px 6px rgba(0, 255, 136, 0.3));
            }

            .image-label {
              font-size: 1rem;
              color: rgba(255, 255, 255, 0.6);
            }
          }

          .image-info {
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
            padding: 20px;
            color: #fff;

            .bird-name {
              font-size: 1.5rem;
              font-weight: bold;
              color: #00ff88;
              margin: 0 0 10px 0;
              text-shadow: 0 2px 4px rgba(0, 255, 136, 0.3);
            }

            .bird-details {
              display: flex;
              gap: 20px;
              margin-bottom: 10px;

              .detail-item {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.8);

                i {
                  font-style: normal;
                  font-size: 1.1rem;
                }
              }
            }

            .ai-recognition {
              display: flex;
              align-items: center;
              gap: 10px;
              background: rgba(0, 170, 255, 0.2);
              border: 1px solid rgba(0, 170, 255, 0.5);
              border-radius: 20px;
              padding: 5px 15px;
              width: fit-content;

              .ai-badge {
                background: #00aaff;
                color: #fff;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.75rem;
                font-weight: bold;
              }

              .ai-result {
                font-size: 0.9rem;
                color: #00ff88;
              }

              .confidence {
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.7);
              }
            }
          }
        }
      }

      .carousel-indicators {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 15px;

        .indicator {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;

          &.active {
            background: #00ff88;
            box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
          }

          &:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }

  .bird-atlas-card {
    flex: 1;
    background: rgba(20, 35, 60, 0.8);
    border: 1px solid rgba(50, 120, 180, 0.5);
    border-radius: 8px;
    padding: 20px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;


    .atlas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .subsection-title {
        margin: 0;
      }

      .load-more-btn {
        background: linear-gradient(135deg, rgba(0, 170, 255, 0.2), rgba(0, 255, 136, 0.2));
        border: 1px solid rgba(0, 255, 136, 0.5);
        color: #00ff88;
        padding: 8px 20px;
        border-radius: 15px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, rgba(0, 170, 255, 0.3), rgba(0, 255, 136, 0.3));
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0, 255, 136, 0.3);
        }

        .count {
          color: #00aaff;
          font-weight: bold;
        }
      }
    }

    .atlas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 15px;
      flex: 1;
      overflow-y: auto;
      padding-right: 5px;
      
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(100, 200, 255, 0.5);
        border-radius: 3px;
      }

      .bird-card {
        background: rgba(10, 20, 40, 0.6);
        border: 1px solid rgba(100, 200, 255, 0.3);
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(50, 120, 180, 0.4);
          border-color: #00ff88;
        }

        &.protected {
          border-color: rgba(255, 100, 0, 0.5);
        }

        .bird-avatar {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 10px;
          filter: drop-shadow(0 2px 4px rgba(0, 255, 136, 0.2));
        }

        .bird-info {
          .bird-name {
            font-size: 1rem;
            font-weight: bold;
            color: #00ff88;
            margin-bottom: 5px;
          }

          .bird-scientific {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
            font-style: italic;
            margin-bottom: 8px;
          }

          .bird-habitat {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            display: flex;
            align-items: center;
            gap: 5px;

            i {
              font-style: normal;
            }
          }
        }

        .protection-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 100, 0, 0.9);
          color: #fff;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: bold;
          backdrop-filter: blur(5px);
        }
      }
    }

  }
}

.right-section {
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .bird-trend-card,
  .bird-distribution-card,
  .hotspot-map-card {
    background: rgba(20, 35, 60, 0.8);
    border: 1px solid rgba(50, 120, 180, 0.5);
    border-radius: 8px;
    padding: 20px;
    backdrop-filter: blur(10px);
  }

  .bird-trend-card {
    height: 280px;

    .chart-container {
      height: calc(100% - 80px);
      display: flex;
      align-items: center;
      justify-content: center;

      canvas {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .trend-legend {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 15px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }

  .bird-distribution-card {
    height: 280px;

    .distribution-content {
      display: flex;
      gap: 20px;
      height: calc(100% - 50px);

      .pie-chart-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .distribution-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;

        .category-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: rgba(10, 20, 40, 0.4);
          border-radius: 5px;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(10, 20, 40, 0.6);
          }

          .category-dot {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .category-name {
            flex: 1;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
          }

          .category-count {
            font-size: 0.85rem;
            color: #00ff88;
            font-weight: bold;
          }

          .category-percent {
            font-size: 0.85rem;
            color: #00aaff;
            font-weight: bold;
            min-width: 45px;
            text-align: right;
          }
        }
      }
    }
  }

  .hotspot-map-card {
    height: 240px;

    .hotspot-content {
      height: calc(100% - 50px);

      .map-wrapper {
        height: 100%;
        position: relative;
        background: linear-gradient(135deg, rgba(0, 170, 255, 0.05), rgba(0, 255, 136, 0.05));
        border-radius: 8px;
        border: 1px solid rgba(100, 200, 255, 0.2);

        .area-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: translate(-50%, -50%) scale(1.1);
          }

          .area-name {
            background: rgba(0, 0, 0, 0.8);
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.85rem;
            color: #fff;
            white-space: nowrap;
            backdrop-filter: blur(5px);
          }

          .area-count {
            text-align: center;
            font-size: 0.75rem;
            color: #00ff88;
            margin-top: 3px;
          }

          .pulse-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid;
            animation: pulse 2s ease-out infinite;
          }

          &.high {
            .pulse-ring {
              border-color: #ff4444;
            }
          }

          &.medium {
            .pulse-ring {
              border-color: #ffaa44;
            }
          }

          &.low {
            .pulse-ring {
              border-color: #44ff44;
            }
          }
        }

        .map-legend {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px;
          border-radius: 5px;
          backdrop-filter: blur(5px);

          .legend-title {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 5px;
          }

          .legend-scale {
            display: flex;
            align-items: center;
            gap: 10px;

            .scale-gradient {
              width: 80px;
              height: 8px;
              background: linear-gradient(90deg, #44ff44, #ffaa44, #ff4444);
              border-radius: 4px;
            }

            .scale-low,
            .scale-high {
              font-size: 0.75rem;
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
    }
  }
}

.section-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #00ff88;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;

  i {
    font-style: normal;
    font-size: 1.5rem;
  }
}

.subsection-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #00aaff;
  margin: 0 0 15px 0;
}

// 底部区域
.bottom-section {
  position: relative;
  z-index: 10;
  margin-top: 15px;
  padding: 0 20px;
  max-height: 300px;
  overflow-y: auto;

  .restoration-comparison {
    background: rgba(20, 35, 60, 0.8);
    border: 1px solid rgba(50, 120, 180, 0.5);
    border-radius: 8px;
    padding: 30px;
    backdrop-filter: blur(10px);

    .comparison-content {
      display: flex;
      align-items: center;
      gap: 40px;
      justify-content: center;

      .comparison-item {
        text-align: center;

        .year-label {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00aaff;
          margin-bottom: 15px;
          text-shadow: 0 2px 4px rgba(0, 170, 255, 0.3);
        }

        .image-placeholder {
          width: 250px;
          height: 180px;
          background: linear-gradient(135deg, rgba(0, 170, 255, 0.1), rgba(0, 255, 136, 0.1));
          border: 2px solid rgba(100, 200, 255, 0.3);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;

          .status-icon {
            font-size: 4rem;
            margin-bottom: 10px;
          }

          .status-text {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.7);
          }
        }

        .metrics {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .metric {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.8);

            &.highlight {
              color: #00ff88;
              font-weight: bold;
            }
          }
        }

        &.before {
          .image-placeholder {
            border-color: rgba(255, 100, 100, 0.5);
            background: linear-gradient(135deg, rgba(255, 100, 100, 0.1), rgba(255, 150, 100, 0.1));
          }
        }

        &.after {
          .image-placeholder {
            border-color: rgba(0, 255, 136, 0.5);
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 170, 255, 0.1));
          }
        }
      }

      .vs-divider {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .vs-icon {
          font-size: 2rem;
          font-weight: bold;
          color: #ffaa44;
          text-shadow: 0 3px 6px rgba(255, 170, 68, 0.5);
        }

        .progress-arrow {
          font-size: 2.5rem;
          color: #00ff88;
          animation: arrowPulse 2s ease-in-out infinite;
        }
      }
    }
  }

  .ecological-slogans {
    margin-top: 20px;
    background: rgba(20, 35, 60, 0.8);
    border: 1px solid rgba(50, 120, 180, 0.5);
    border-radius: 8px;
    padding: 15px;
    backdrop-filter: blur(10px);
    overflow: hidden;

    .slogan-track {
      display: flex;
      gap: 50px;
      white-space: nowrap;

      .slogan-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);

        .slogan-icon {
          font-size: 1.3rem;
          filter: drop-shadow(0 2px 4px rgba(0, 255, 136, 0.3));
        }

        .slogan-text {
          font-style: italic;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

@keyframes arrowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>