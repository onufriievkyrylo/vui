<template>
  <v-scroll id="app">
    <v-date-picker
      v-model="d"
      locale="uk"
    />
  </v-scroll>
</template>

<script>
// import { ref, computed } from '@vue/composition-api'

export default {
  name: 'app',
  setup () {
    return {
      c: console.log,
      d: [{ year: 2019, month: 12, day: 3 }, { year: 2019, month: 12, day: 19 }]
    }
  }
}
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
