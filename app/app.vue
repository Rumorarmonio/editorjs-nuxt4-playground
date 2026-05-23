<script setup lang="ts">
import { onMounted } from 'vue'
import { installToastDebugApi } from '~~/shared/notifications'

useAppLocale()
useAppTheme()

onMounted(() => {
  installToastDebugApi()
})
</script>

<template>
  <NuxtPage />
</template>
