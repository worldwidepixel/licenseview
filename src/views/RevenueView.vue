<template>
  <div class="statsContainer">
    <h1>{{ USD.format(total_revenue) }} paid to creators</h1>
    <span>{{ USD.format(all_revenue) }} total revenue since Nov. 12 2022 (est)</span>
    <div class="payout_grid">
      <PayoutNode
        v-for="node in data.data"
        :time="+node.time"
        :revenue="+node.revenue"
        :creator-revenue="+node.creator_revenue"
        v-bind:key="node"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PayoutNode from '@/components/PayoutNode.vue'
import { ref } from 'vue'

const loaded = ref(false)
const requestUrl = ref(`https://api.modrinth.com/v3/payout/platform_revenue`)

const response = await fetch(requestUrl.value)
const data = await response.json()

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const total_revenue = data.all_time

const last_30d_payouts = data.data

let total_25_75_paid = 0

for (const node of last_30d_payouts) {
  if (new Date(node.time * 1000) > new Date('September 4, 2024 00:00:00')) {
    const revenue: number = +node.creator_revenue
    total_25_75_paid += revenue
  }
}

const total_90_10_paid: number = data.all_time - total_25_75_paid

const all_revenue = total_90_10_paid * 1.125 + total_25_75_paid * 1.25

loaded.value = true
</script>
