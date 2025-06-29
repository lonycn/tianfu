<template>
  <div class="dashboard-card" :class="cardClass">
    <div class="card-header" v-if="title">
      <div class="card-title">
        <component :is="icon" class="icon" v-if="icon" />
        {{ title }}
      </div>
      <div class="card-extra" v-if="extra">
        {{ extra }}
      </div>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  extra?: string
  icon?: any
  size?: 'normal' | 'large' | 'tall'
  glow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  glow: false
})

const cardClass = computed(() => {
  return {
    'card-large': props.size === 'large',
    'card-tall': props.size === 'tall',
    'card-glow': props.glow
  }
})
</script>

<style scoped lang="scss">
.card-glow {
  border-image: linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(0, 255, 136, 0.9), rgba(255, 107, 53, 0.9)) 1 !important;
  box-shadow: 
    0 0 40px rgba(0, 212, 255, 0.6),
    0 0 80px rgba(0, 212, 255, 0.3),
    inset 0 0 20px rgba(0, 212, 255, 0.1) !important;
  
  &::before {
    background: 
      linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, transparent 50%, rgba(0, 255, 136, 0.08) 100%),
      radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.15) 0%, transparent 60%),
      radial-gradient(circle at 70% 70%, rgba(0, 255, 136, 0.15) 0%, transparent 60%) !important;
  }
  
  &::after {
    animation-duration: 2s !important;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 212, 255, 1),
      rgba(0, 255, 136, 1),
      transparent
    ) !important;
    height: 3px !important;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.8) !important;
  }
}
</style>