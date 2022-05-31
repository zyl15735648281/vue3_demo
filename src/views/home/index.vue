<template>
  <div id="cesiumContainer"></div>
</template>
<script setup name="Home">
import * as Cesium from 'cesium'
import { onMounted } from 'vue'

onMounted(() => {
  // test({ id: 123 })
  // const viewer = new Cesium.Viewer('cesiumContainer')
  window.viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: false,
  })

  // console.log(viewer)
})
</script>
