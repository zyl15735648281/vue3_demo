<template>
  <div>这是首页</div>
  <el-button>Default</el-button>
  <Demo />
</template>
<script setup name="Home">
import { onMounted } from 'vue'
import { test } from '@/api/demo.js'
import { Demo } from '@/components/Demo'

onMounted(() => {
  test({ id: 123 })
})
</script>
