<template>
  <div class="statsContainer">
    <h1>{{ $route.params.user || $route.params.org }}</h1>
    <Pie
      style="max-height: 30rem; position: relative"
      v-if="loaded === true"
      :data="chartData"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const route = useRoute()

interface Project {
  license: {
    id: string
  }
  color: number
}
interface LicenseCounts {
  [key: string]: number
}

const licenses = ref<LicenseCounts>({})
const colours = ref<string[]>([])
const loaded = ref(false)
const requestUrl = ref(`https://api.modrinth.com/v2/user/${route.params.user}/projects`)

console.log(route.params.user)

if (route.path.includes('/org')) {
  requestUrl.value = `https://api.modrinth.com/v3/organization/${route.params.org}/projects`
} else {
  requestUrl.value = `https://api.modrinth.com/v2/user/${route.params.user}/projects`
}

const response = await fetch(requestUrl.value)
const data: Project[] = await response.json()

for (const item of data) {
  const projectId = item.license.id
  if (!Object.prototype.hasOwnProperty.call(licenses.value, projectId)) {
    licenses.value[projectId] = 1
    if (item.color.toString(16) !== 'ffffff') {
      colours.value.push('#' + item.color.toString(16))
    } else {
      const randomColour = '#' + Math.floor(Math.random() * 16777215).toString(16)
      colours.value.push(randomColour)
    }
  } else {
    licenses.value[projectId]++
  }
}

const options = {
  responsive: true,
  maintainAspectRatio: true
}

const chartData = {
  labels: Object.keys(licenses.value),
  datasets: [
    {
      backgroundColor: colours.value,
      data: Object.values(licenses.value)
    }
  ]
}

loaded.value = true
</script>
