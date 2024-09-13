<template>
  <div class="revenue_container">
    <span class="revenue_date">{{ RELATIVE_TIME.format(new Date(time * 1000)) }}</span>
    <span>Total Revenue: {{ USD.format(revenue) }}</span>
    <span>Creator Revenue: {{ USD.format(creatorRevenue) }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  time: Number,
  revenue: Number,
  creatorRevenue: Number
})

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const RELATIVE_TIME = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })
</script>
