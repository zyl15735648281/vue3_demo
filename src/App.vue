<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { reactive, ref } from 'vue'

const config = reactive({
  autoInsertSpace: false,
})
const locale = ref(zhCn)
</script>

<template>
  <el-config-provider :button="config" :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
