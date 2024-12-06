<template>
  <div v-if="loaded" class="statsContainer">
    <h1>modrinth product prices</h1>
    use ?cur=CAD (or other preferred currency code) to access other conversions
    <div class="statsContainer" v-for="product in data" v-bind:key="product">
      <span>ID: {{ product.id }} &bull; Product Type: {{ product.metadata.type }}</span>
      <div class="payout_grid">
        <PriceNode
          v-for="price in product.prices"
          :exchangeRate="conversionData.rates[price.currency_code] ?? null"
          :requestedCurrency="requestedCurrency"
          :data="price"
          v-bind:key="price"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PriceNode from '@/components/PriceNode.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
let requestedCurrency = route.query.cur ?? ''

const loaded = ref(false)
const requestUrl = ref(`https://api.modrinth.com/_internal/billing/products`)

const response = await fetch(requestUrl.value)
const data = await response.json()

const currencyResponse = await fetch('https://api.frankfurter.dev/v1/currencies')
const currencyData = await currencyResponse.json()

if (requestedCurrency === null) {
  requestedCurrency = 'CAD'
} else if (!Object.keys(currencyData).includes(requestedCurrency.toString().toUpperCase())) {
  requestedCurrency = 'CAD'
} else {
  requestedCurrency = requestedCurrency.toString().toUpperCase()
}

const conversionResponse = await fetch(
  `https://api.frankfurter.dev/v1/latest?base=${requestedCurrency}`
)
const conversionData = await conversionResponse.json()

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

loaded.value = true
</script>
