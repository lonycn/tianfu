<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Vue Router will handle the routing
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
