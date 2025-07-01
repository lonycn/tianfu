import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: '天福国家湿地公园智慧种植可视化大屏 - 首页'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '天福国家湿地公园智慧种植可视化大屏 - 仪表盘'
    }
  },
  {
    path: '/agriculture',
    name: 'Agriculture',
    component: () => import('@/views/AgriculturePage.vue'),
    meta: {
      title: '智慧农业监测板块'
    }
  },
  {
    path: '/quality',
    name: 'Quality',
    component: () => import('@/views/QualityPage.vue'),
    meta: {
      title: '绿色种植与质量监管板块'
    }
  },
  {
    path: '/ecology',
    name: 'Ecology',
    component: () => import('@/views/EcologyPage.vue'),
    meta: {
      title: '生态环境监测板块'
    }
  },
  {
    path: '/technology',
    name: 'Technology',
    component: () => import('@/views/TechnologyPage.vue'),
    meta: {
      title: '科技创新与数字化板块'
    }
  },
  {
    path: '/industry',
    name: 'Industry',
    component: () => import('@/views/IndustryPage.vue'),
    meta: {
      title: '产业融合与发展板块'
    }
  },
  {
    path: '/tourism',
    name: 'Tourism',
    component: () => import('@/views/TourismPage.vue'),
    meta: {
      title: '乡村旅游与文化板块'
    }
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('@/views/PolicyPage.vue'),
    meta: {
      title: '政策支持与管理板块'
    }
  },
  {
    path: '/education',
    name: 'Education',
    component: () => import('@/views/EducationPage.vue'),
    meta: {
      title: '教育研学板块'
    }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/MaintenancePage.vue'),
    meta: {
      title: '系统运维板块'
    }
  },
  {
    path: '/map_draw',
    name: 'MapDraw',
    component: () => import('@/views/MapDrawPage.vue'),
    meta: {
      title: '地图区域绘制工具'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router