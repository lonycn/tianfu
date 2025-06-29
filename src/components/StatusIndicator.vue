<template>
  <div class="status-indicator" :class="status">
    <div class="dot"></div>
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getDeviceStatusText } from '@/utils'

interface Props {
  status: 'online' | 'offline' | 'warning' | 'running' | 'stopped'
  text?: string
  showDot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDot: true
})

const text = computed(() => {
  return props.text || getDeviceStatusText(props.status)
})
</script>

<style scoped lang="scss">
.status-indicator {
  .dot {
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>