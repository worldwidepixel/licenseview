<template>
  <div class="revenue_container" v-if="data">
    <span class="revenue_date">{{ cc.code(data.currency_code)?.currency }}</span>
    <div v-for="(interval, key) in data.prices.intervals" v-bind:key="interval">
      {{ capitaliseFirstLetter(key.toString()) }}:
      <span style="font-weight: bold"> {{ getProperCost(data.currency_code, interval) }}</span>
      <span v-if="exchangeRate !== null">
        ({{
          getRenderedConversion(
            requestedCurrency ?? 'CAD',
            data.currency_code,
            interval * (1 / (exchangeRate ?? 0))
          )
        }})
      </span>
    </div>
    <span>Type: {{ capitaliseFirstLetter(data.prices.type) }}</span>
    <span>ID: {{ data.id }}</span>
    <span>Product ID: {{ data.product_id }} </span>
  </div>
</template>

<script setup lang="ts">
import cc from 'currency-codes'
import currencyData from 'currency-data'
const props = defineProps({
  data: Object,
  exchangeRate: Number,
  requestedCurrency: String
})
function capitaliseFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
function getProperCost(code: string, price: number) {
  const format = new Intl.NumberFormat(currencyData.getCountriesByCurrencyISOCode(code)[0], {
    style: 'currency',
    currency: code
  })
  return format.format(price / Math.pow(10, format.resolvedOptions().maximumFractionDigits ?? 0))
}
function getRenderedConversion(code: string, code2: string, price: number) {
  const format = new Intl.NumberFormat(currencyData.getCountriesByCurrencyISOCode(code)[0], {
    style: 'currency',
    currency: code2,
    currencyDisplay: 'code'
  })
  const format2 = new Intl.NumberFormat(currencyData.getCountriesByCurrencyISOCode(code)[0], {
    style: 'currency',
    currency: code
  })
  return format2.format(
    Number.parseFloat(
      format
        .format(price / Math.pow(10, format.resolvedOptions().maximumFractionDigits ?? 0))
        .replace(/^0123456789.,/, '')
        .replace(`${code2}`, '')
    )
  )
}
</script>
