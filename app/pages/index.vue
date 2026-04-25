<template>
  <main :class="$style.page">
    <section
      :class="$style.intro"
      aria-labelledby="page-title"
    >
      <p :class="$style.kicker">Nuxt 4 bootstrap</p>
      <h1
        id="page-title"
        :class="$style.title"
      >
        Editor.js architecture playground
      </h1>
      <p :class="$style.description">
        Early project shell for future editor, renderer, and JSON workflow layers.
      </p>
    </section>
  </main>
</template>

<style module lang="scss" src="./index.module.scss" />
