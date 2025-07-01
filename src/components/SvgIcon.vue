<template>
  <svg 
    :width="size" 
    :height="size" 
    :viewBox="viewBox" 
    :class="['svg-icon', `svg-icon-${name}`]"
    :style="{ color: color }"
  >
    <!-- 育秧工厂 -->
    <g v-if="name === 'seedling-factory'">
      <rect x="2" y="8" width="20" height="12" rx="1" fill="currentColor" opacity="0.8"/>
      <rect x="4" y="6" width="16" height="2" fill="currentColor"/>
      <rect x="6" y="4" width="12" height="2" fill="currentColor"/>
      <circle cx="8" cy="12" r="1.5" fill="#4ade80"/>
      <circle cx="12" cy="12" r="1.5" fill="#4ade80"/>
      <circle cx="16" cy="12" r="1.5" fill="#4ade80"/>
      <path d="M10 14 L10 16 M14 14 L14 16" stroke="#4ade80" stroke-width="1"/>
    </g>
    
    <!-- 水稻田 -->
    <g v-if="name === 'rice-field'">
      <path d="M3 18 Q6 12 9 18 Q12 12 15 18 Q18 12 21 18" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M3 16 Q6 10 9 16 Q12 10 15 16 Q18 10 21 16" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.7"/>
      <circle cx="6" cy="14" r="1" fill="#fbbf24"/>
      <circle cx="12" cy="14" r="1" fill="#fbbf24"/>
      <circle cx="18" cy="14" r="1" fill="#fbbf24"/>
      <rect x="2" y="19" width="20" height="2" fill="currentColor" opacity="0.3"/>
    </g>
    
    <!-- 果园 -->
    <g v-if="name === 'orchard'">
      <circle cx="12" cy="10" r="6" fill="currentColor" opacity="0.2"/>
      <circle cx="12" cy="8" r="3" fill="#ef4444"/>
      <path d="M12 5 Q10 3 8 5" stroke="#22c55e" stroke-width="2" fill="none"/>
      <rect x="11" y="16" width="2" height="6" fill="#a3a3a3"/>
      <circle cx="8" cy="12" r="2" fill="#ef4444" opacity="0.8"/>
      <circle cx="16" cy="11" r="2" fill="#ef4444" opacity="0.8"/>
    </g>
    
    <!-- 大棚 -->
    <g v-if="name === 'greenhouse'">
      <path d="M4 12 L12 4 L20 12 L20 20 L4 20 Z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4 12 L12 4 L20 12" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="6" y="14" width="3" height="6" fill="none" stroke="currentColor" stroke-width="1"/>
      <rect x="15" y="14" width="3" height="6" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="10" cy="16" r="1" fill="#22c55e"/>
      <circle cx="14" cy="17" r="1" fill="#22c55e"/>
    </g>
    
    <!-- 鸟类监测点 -->
    <g v-if="name === 'bird-monitoring'">
      <!-- 鸟身体 -->
      <ellipse cx="12" cy="11" rx="4" ry="2.5" fill="currentColor"/>
      <!-- 鸟头 -->
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
      <!-- 鸟眼 -->
      <circle cx="8.5" cy="8.5" r="0.8" fill="#ffffff"/>
      <circle cx="8.5" cy="8.5" r="0.4" fill="#1f2937"/>
      <!-- 鸟嘴 -->
      <path d="M6.5 9 L5 8.5 L6.5 8" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"/>
      <!-- 翅膀 -->
      <path d="M10 10 Q8 8 6 10 Q8 9 10 11" fill="currentColor" opacity="0.8"/>
      <path d="M14 10 Q16 8 18 10 Q16 9 14 11" fill="currentColor" opacity="0.8"/>
      <!-- 尾巴 -->
      <path d="M16 11 Q18 10 19 12 Q18 13 16 12" fill="currentColor" opacity="0.7"/>
      <!-- 监测信号圈 -->
      <circle cx="12" cy="11" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3" opacity="0.6"/>
      <circle cx="12" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.4"/>
    </g>
    
    <!-- 河道水质点 -->
    <g v-if="name === 'water-quality'">
      <path d="M12 3 Q8 8 8 12 Q8 16 12 16 Q16 16 16 12 Q16 8 12 3" fill="currentColor" opacity="0.8"/>
      <circle cx="12" cy="12" r="2" fill="#3b82f6"/>
      <path d="M6 18 Q9 16 12 18 Q15 16 18 18" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M4 20 Q8 18 12 20 Q16 18 20 20" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.7"/>
      <circle cx="10" cy="10" r="0.5" fill="#ffffff" opacity="0.8"/>
    </g>
    
    <!-- 冷库 -->
    <g v-if="name === 'cold-storage'">
      <rect x="4" y="8" width="16" height="12" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="6" y="10" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M8 12 L10 14 L8 16 M12 12 L14 14 L12 16 M16 12 L18 14 L16 16" stroke="#3b82f6" stroke-width="1.5" fill="none"/>
      <rect x="10" y="6" width="4" height="2" fill="currentColor"/>
      <circle cx="18" cy="10" r="1" fill="#ef4444"/>
    </g>
    
    <!-- 农机 -->
    <g v-if="name === 'farm-machinery'">
      <rect x="6" y="10" width="12" height="6" rx="1" fill="currentColor"/>
      <circle cx="8" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="16" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="8" cy="18" r="1" fill="currentColor"/>
      <circle cx="16" cy="18" r="1" fill="currentColor"/>
      <rect x="4" y="8" width="4" height="4" rx="1" fill="currentColor" opacity="0.8"/>
      <rect x="10" y="6" width="2" height="4" fill="currentColor"/>
    </g>
    
    <!-- 湿地宣教区 -->
    <g v-if="name === 'wetland-education'">
      <rect x="6" y="8" width="12" height="10" rx="1" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M6 8 L12 4 L18 8" fill="currentColor" opacity="0.8"/>
      <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 12 L11 13 L14 10" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <rect x="8" y="15" width="8" height="1" fill="currentColor" opacity="0.6"/>
      <rect x="9" y="16" width="6" height="1" fill="currentColor" opacity="0.4"/>
    </g>
    
    <!-- 观鸟区 -->
    <g v-if="name === 'bird-watching'">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <path d="M12 4 L12 8 M12 16 L12 20 M4 12 L8 12 M16 12 L20 12" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <path d="M8 8 Q10 6 12 8 Q14 6 16 8" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="10" cy="7" r="0.5" fill="currentColor"/>
      <circle cx="14" cy="7" r="0.5" fill="currentColor"/>
    </g>
    
    <!-- 首页概览 -->
    <g v-if="name === 'home'">
      <path d="M3 12 L12 3 L21 12 M5 10 L5 20 L19 20 L19 10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M9 21 L9 15 L15 15 L15 21" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </g>
    
    <!-- 智慧农业 -->
    <g v-if="name === 'agriculture'">
      <path d="M3 18 Q6 12 9 18 Q12 12 15 18 Q18 12 21 18" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M3 16 Q6 10 9 16 Q12 10 15 16 Q18 10 21 16" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.7"/>
      <circle cx="6" cy="14" r="1" fill="#fbbf24"/>
      <circle cx="12" cy="14" r="1" fill="#fbbf24"/>
      <circle cx="18" cy="14" r="1" fill="#fbbf24"/>
      <rect x="2" y="19" width="20" height="2" fill="currentColor" opacity="0.3"/>
    </g>
    
    <!-- 绿色认证 -->
    <g v-if="name === 'quality'">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M8 12 L11 15 L16 9" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
    </g>
    
    <!-- 智能育秧 -->
    <g v-if="name === 'industry'">
      <rect x="6" y="10" width="12" height="6" rx="1" fill="currentColor"/>
      <circle cx="8" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="16" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="8" cy="18" r="1" fill="currentColor"/>
      <circle cx="16" cy="18" r="1" fill="currentColor"/>
      <rect x="4" y="8" width="4" height="4" rx="1" fill="currentColor" opacity="0.8"/>
      <rect x="10" y="6" width="2" height="4" fill="currentColor"/>
    </g>
    
    <!-- 生态监测 -->
    <g v-if="name === 'ecology'">
      <!-- 监测范围圆圈 -->
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,2" opacity="0.6"/>
      <!-- 叶子/植物 -->
      <path d="M12 6 Q8 8 8 12 Q8 16 12 14 Q16 16 16 12 Q16 8 12 6" fill="currentColor" opacity="0.8"/>
      <!-- 中心监测点 -->
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="12" r="1" fill="#ffffff"/>
    </g>
    
    <!-- 科普研学 -->
    <g v-if="name === 'education'">
      <path d="M4 19 L20 19 M6 16 L18 16 M8 13 L16 13" stroke="currentColor" stroke-width="1.5"/>
      <rect x="6" y="4" width="12" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M9 7 L15 7 M9 10 L15 10" stroke="currentColor" stroke-width="1" opacity="0.6"/>
      <circle cx="12" cy="2" r="1" fill="currentColor"/>
    </g>
    
    <!-- 运维预警 -->
    <g v-if="name === 'maintenance'">
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 1 L12 6 M12 18 L12 23 M4.22 4.22 L7.76 7.76 M16.24 16.24 L19.78 19.78 M1 12 L6 12 M18 12 L23 12 M4.22 19.78 L7.76 16.24 M16.24 7.76 L19.78 4.22" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  name: string
  size?: string | number
  color?: string
  viewBox?: string
}

withDefaults(defineProps<Props>(), {
  size: '28',
  color: 'currentColor',
  viewBox: '0 0 24 24'
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.svg-icon:hover {
  transform: scale(1.15);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* 增强图标的视觉效果 */
.svg-icon g {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>