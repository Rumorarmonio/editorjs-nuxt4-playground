<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { installToastDebugApi } from '~~/shared/notifications'

const route = useRoute()
const { t } = useI18n()

useAppLocale()
useAppTheme()

const pageTitle = computed(() =>
  route.path.startsWith('/preview')
    ? t('app.previewPage.title')
    : t('app.editorPage.title'),
)

useHead(() => ({
  link: [
    {
      href: '/favicon.svg',
      rel: 'icon',
      type: 'image/svg+xml',
    },
  ],
  title: pageTitle.value,
}))

onMounted(() => {
  installToastDebugApi()
})
</script>

<template>
  <NuxtPage />
</template>
