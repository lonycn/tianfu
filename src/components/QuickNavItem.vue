<template>
  <div class="quick-nav-item" @click="handleClick">
    <div class="nav-icon">
      {{ emoji }}
    </div>
    <span class="nav-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  emoji: string
  label: string
  locationKey?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [locationKey: string]
}>()

const handleClick = () => {
  if (props.locationKey) {
    emit('click', props.locationKey)
  }
}
</script>

<style scoped>
.quick-nav-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 0;
  min-width: fit-content;
  white-space: nowrap;
}

.quick-nav-item:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 14px;
  margin-right: 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quick-nav-item:hover .nav-icon {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .quick-nav-item {
    padding: 3px 6px;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    font-size: 12px;
    margin-right: 4px;
  }
  
  .nav-label {
    font-size: 10px;
  }
}
</style>