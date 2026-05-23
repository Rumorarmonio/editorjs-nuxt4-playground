<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    disabled?: boolean
    href?: string
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
  }>(),
  {
    disabled: false,
    href: '',
    to: undefined,
    type: 'button',
    variant: 'secondary',
  },
)
</script>

<template>
  <NuxtLink
    v-if="to"
    :class="[$style.button, $style[`button_${variant}`]]"
    :to="to"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="href"
    :class="[$style.button, $style[`button_${variant}`]]"
    :href="href"
  >
    <slot />
  </a>
  <button
    v-else
    :class="[$style.button, $style[`button_${variant}`]]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<style module lang="scss" src="./AppButton.module.scss" />
