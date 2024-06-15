<template>
  <div class="statsContainer">
    <h1>{{ $route.params.user }}</h1>
    <Pie
      style="max-height: 30rem; position: relative"
      v-if="loaded === true"
      :data="chartData"
      :options="options"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const route = useRoute()
const licenses = ref({})
let colours = []
const loaded = ref(false)
console.log(route.params.user)

const response = await fetch(`https://api.modrinth.com/v2/user/${route.params.user}/projects`)
const data = await response.json()
//console.log(data)

for (let i = 0; i < data.length; i++) {
  //console.log(data[i].license.id)
  if (!Object.prototype.hasOwnProperty.call(licenses.value, data[i].license.id)) {
    //licenses.value.push(data[i].license.id, 1)
    licenses.value[data[i].license.id] = 1
    if (data[i].color.toString(16) != 'ffffff') {
      colours.push('#' + data[i].color.toString(16))
    } else {
      const randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16)
      colours.push(randomColour)
    }
  } else {
    licenses.value[data[i].license.id]++
  }
}
//console.log(licenses.value)
//console.log(colours)

const options = {
  responsive: true,
  maintainAspectRatio: true
}
const chartData = {
  labels: Object.keys(licenses.value),
  datasets: [
    {
      backgroundColor: colours,
      data: Object.values(licenses.value)
    }
  ]
}
loaded.value = true
//console.log(chartData)
</script>
