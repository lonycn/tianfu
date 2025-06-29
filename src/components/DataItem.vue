<template>
  <div class="data-item">
    <div class="label">
      <component :is="icon" class="label-icon" v-if="icon" />
      {{ label }}
    </div>
    <div class="value" :class="valueClass">
      {{ formattedValue }}
      <span class="unit" v-if="unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber, formatPercent } from '@/utils'

interface Props {
  label: string
  value: number | string
  unit?: string
  icon?: any
  type?: 'number' | 'percent' | 'text'
  status?: 'success' | 'warning' | 'danger' | 'normal'
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  status: 'normal',
  decimals: 1
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') {
    return props.value
  }
  
  switch (props.type) {
    case 'number':
      return formatNumber(props.value, props.decimals)
    case 'percent':
      return formatPercent(props.value, props.decimals)
    default:
      return props.value.toString()
  }
})

const valueClass = computed(() => {
  return {
    success: props.status === 'success',
    warning: props.status === 'warning',
    danger: props.status === 'danger'
  }
})
</script>

<style scoped lang="scss">
.data-item {
  .label {
    display: flex;
    align-items: center;
    gap: 5px;
    
    .label-icon {
      width: 14px;
      height: 14px;
      color: $primary-color;
    }
  }
  
  .value {
    display: flex;
    align-items: baseline;
    gap: 3px;
    
    .unit {
      font-size: $font-size-xs;
      color: $text-muted;
      font-weight: normal;
    }
  }
}
</style>