<template>
  <div class="floating-card">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 可以接收props来自定义样式
interface Props {
  variant?: 'default' | 'compact' | 'large'
  transparent?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  transparent: false
})
</script>

<style scoped>
.floating-card {
  background: rgba(15, 25, 45, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
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

/* 变体样式 */
.floating-card.compact {
  padding: 12px;
  min-height: 80px;
}

.floating-card.large {
  padding: 28px;
  min-height: 160px;
}

.floating-card.transparent {
  background: rgba(15, 25, 45, 0.4);
  
  &:hover {
    background: rgba(15, 25, 45, 0.6);
  }
}

/* 响应式适配 */
@media (min-width: 2560px) {
  .floating-card {
    padding: 28px;
  }
  
  .floating-card.compact {
    padding: 16px;
  }
  
  .floating-card.large {
    padding: 32px;
  }
}

@media (max-width: 1366px) {
  .floating-card {
    padding: 16px;
    min-height: 100px;
  }
  
  .floating-card.compact {
    padding: 10px;
    min-height: 60px;
  }
  
  .floating-card.large {
    padding: 20px;
    min-height: 140px;
  }
}

@media (max-width: 768px) {
  .floating-card {
    padding: 12px;
    min-height: 80px;
    border-radius: 12px;
  }
  
  .floating-card.compact {
    padding: 8px;
    min-height: 50px;
  }
  
  .floating-card.large {
    padding: 16px;
    min-height: 120px;
  }
}
</style>