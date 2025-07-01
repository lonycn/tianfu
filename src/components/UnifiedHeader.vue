<template>
  <header class="unified-header">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo">
          <div class="logo-inner">
            <img src="/images/logo.jpg" alt="天福湿地公园标志" />
          </div>
        </div>
        <div class="title-group">
          <h1 class="title">天福国家湿地公园智慧管理平台</h1>
          <p class="subtitle">Tianfu National Wetland Park Smart Management Platform</p>
        </div>
      </div>
      
      <nav class="nav-menu">
        <div class="nav-item" :class="{ active: currentPath === '/' }" @click="navigateTo('/')">
          <div class="nav-icon home-icon">
            <SvgIcon name="home" :size="28" color="#ffffff" />
          </div>
          <span>首页概览</span>
        </div>
        <div class="nav-item" :class="{ active: currentPath === '/agriculture' }" @click="navigateTo('/agriculture')">
          <div class="nav-icon agriculture-icon">
            <SvgIcon name="agriculture" :size="28" color="#ffffff" />
          </div>
          <span>智慧农业</span>
        </div>
        <div class="nav-item" :class="{ active: currentPath === '/quality' }" @click="navigateTo('/quality')">
          <div class="nav-icon quality-icon">
            <SvgIcon name="quality" :size="28" color="#ffffff" />
          </div>
          <span>绿色认证</span>
        </div>
        <div class="nav-item" :class="{ active: currentPath === '/industry' }" @click="navigateTo('/industry')">
          <div class="nav-icon industry-icon">
            <SvgIcon name="industry" :size="28" color="#ffffff" />
          </div>
          <span>智能育秧</span>
        </div>
        <div class="nav-item" :class="{ active: currentPath === '/ecology' }" @click="navigateTo('/ecology')">
          <div class="nav-icon ecology-icon">
            <SvgIcon name="ecology" :size="28" color="#ffffff" />
          </div>
          <span>生态监测</span>
        </div>
        <div class="nav-item" :class="{ active: currentPath === '/education' }" @click="navigateTo('/education')">
          <div class="nav-icon education-icon">
            <SvgIcon name="education" :size="28" color="#ffffff" />
          </div>
          <span>科普研学</span>
        </div>
        <div class="nav-item" v-if="0" :class="{ active: currentPath === '/maintenance' }" @click="navigateTo('/maintenance')">
          <div class="nav-icon">
            <SvgIcon name="maintenance" :size="20" color="#ffffff" />
          </div>
          <span>运维预警</span>
        </div>
      </nav>
      
      <div class="time-section">
        <div class="current-time">{{ currentTime }}</div>
        <div class="current-date">{{ currentDate }}</div>
        <div class="status-indicator">
          <div class="status-dot"></div>
          <span>系统运行正常</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from './SvgIcon.vue'

const router = useRouter()
const route = useRoute()
const currentTime = ref('')
const currentDate = ref('')

const currentPath = computed(() => route.path)

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

const navigateTo = (path: string) => {
  router.push(path)
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped lang="scss">
.unified-header {
  position: relative;
  z-index: 10;
  padding: 10px;
  border-bottom: 1px solid rgba(74, 144, 226, 0.3);
  background: rgba(0, 50, 107, 0.5);
  
  @media (min-width: 768px) {
    padding: 0px 40px;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0px;
}

.logo {
  position: relative;
  width: 120px;
  height: 120px;
}
 

.logo-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: #4A90E2;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.title-group {
  .title {
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    background: linear-gradient(45deg, #4A90E2, #7ED321);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 5px 0 0 0;
  }
}

// 导航菜单
.nav-menu {
  display: flex;
  gap: 20px;
  align-items: center;
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 15px;
    border: 1px solid rgba(74, 144, 226, 0.8);
    border-radius: 8px;
    background: rgba(28, 85, 151, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 100px;
    
    &:hover {
      background: rgba(74, 144, 226, 0.2);
      border-color: #4A90E2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
      
      .nav-icon {
        background: rgba(74, 144, 226, 0.3);
        transform: scale(1.05);
        filter: drop-shadow(0 4px 8px rgba(74, 144, 226, 0.6));
      }
    }
    
    &.active {
      background: rgba(126, 211, 33, 0.2);
      border-color: #7ED321;
    }
    
    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(74, 144, 226, 0.2), rgba(126, 211, 33, 0.2));
      transition: all 0.3s ease;
      filter: drop-shadow(0 2px 6px rgba(74, 144, 226, 0.4));
    }
    
    .home-icon {
      background: linear-gradient(135deg, #4A90E2, #7ED321);
    }
    
    .agriculture-icon {
      background: linear-gradient(135deg, #7ED321, #F5A623);
    }
    
    .quality-icon {
      background: linear-gradient(135deg, #50E3C2, #4A90E2);
    }
    
    .industry-icon {
      background: linear-gradient(135deg, #F5A623, #D0021B);
    }
    
    .ecology-icon {
      background: linear-gradient(135deg, #7ED321, #50E3C2);
    }
    
    .education-icon {
      background: linear-gradient(135deg, #9013FE, #4A90E2);
    }
    
    span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
      text-align: center;
    }
    
    .nav-subtitle {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      margin-top: 2px;
      line-height: 1.2;
    }
  }
  
  @media (max-width: 1200px) {
    gap: 10px;
    
    .nav-item {
      padding: 8px 10px;
      min-width: 60px;
      
      .nav-icon {
        font-size: 16px;
      }
      
      span {
        font-size: 10px;
      }
    }
  }
}

.time-section {
  text-align: right;
  
  .current-time {
    font-size: 24px;
    font-weight: bold;
    color: #4A90E2;
  }
  
  .current-date {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 5px 0;
  }
  
  .status-indicator {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    font-size: 12px;
    
    .status-dot {
      width: 8px;
      height: 8px;
      background: #7ED321;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>