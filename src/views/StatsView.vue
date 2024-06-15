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

const licenses = ref<LicenseCounts>({}) // Initialize as empty object
const colours = ref<string[]>([]) // Array of hex color codes
const loaded = ref(false)

console.log(route.params.user)

const response = await fetch(`https://api.modrinth.com/v2/user/${route.params.user}/projects`)
const data: Project[] = await response.json() // Assume response is an array of projects

// Loop through projects with type checking
for (const item of data) {
  const projectId = item.license.id // Use const for clarity
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
