<template>
  <div v-if="loaded" class="statsContainer">
    <h1>{{ $route.params.project }}</h1>
    <span>{{ data.downloads }} downloads</span>
    <div class="payout_grid">
      <VersionNode
        v-for="version in version_map"
        :version="version[0]"
        :downloads="NUMBER.format(version[1])"
        v-bind:key="version[1]"
      />
    </div>
    credit to trash panda for logic
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import VersionNode from '@/components/VersionNode.vue'

const route = useRoute()

const loaded = ref(false)
const requestUrl = ref(`https://api.modrinth.com/v2/project/${route.params.project}`)

const response = await fetch(requestUrl.value)
const data = await response.json()

let version_map = new Map()

fetch(`https://api.modrinth.com/v2/project/${route.params.project}/version`).then((r) =>
  r.json().then((o) => {
    for (let version of o) {
      for (let game_version of version.game_versions) {
        if (version_map.get(game_version) == undefined) {
          version_map.set(game_version, 0)
        }
        version_map.set(game_version, version_map.get(game_version) + version.downloads)
      }
    }
    loaded.value = true
    console.log(version_map)
  })
)

const NUMBER = new Intl.NumberFormat('en-CA', {
  style: 'decimal'
})
</script>
