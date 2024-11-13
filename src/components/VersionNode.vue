<template>
  <div class="revenue_container">
    <span class="revenue_date">{{ version }}</span>
    <span>Downloads: {{ downloads }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  version: String,
  downloads: String
})
</script>
