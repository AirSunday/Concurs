<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>

:root {
  --color-back: #d2fff1;
  --color-main: #7dd2be;
  --color-main-second: #8CA6DB;
  --color-second: #fff;
  --color-back-second: #e8f6f3;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--color-back);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  }

</style>
