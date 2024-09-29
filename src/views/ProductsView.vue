<template>
  <div v-if="loaded" class="statsContainer">
    <h1>modrinth product prices</h1>
    <div class="statsContainer" v-for="product in data" v-bind:key="product">
      <span>ID: {{ product.id }} &bull; Product Type: {{ product.metadata.type }}</span>
      <div class="payout_grid">
        <PriceNode v-for="price in product.prices" :data="price" v-bind:key="price" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PriceNode from '@/components/PriceNode.vue'
import { ref } from 'vue'

const loaded = ref(false)
const requestUrl = ref(`https://api.modrinth.com/_internal/billing/products`)

const response = await fetch(requestUrl.value)
const data = await response.json()

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

loaded.value = true
</script>
