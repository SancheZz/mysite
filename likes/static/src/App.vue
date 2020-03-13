<template>
  <main id="app">
    <router-view name="header"></router-view>
    <router-view name="content"></router-view>
  </main>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
html {
  --font-size: 14px;

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: var(--font-size);

  /* colors */
  --light-grey-color: #e8e8e8;
}

body {
  margin: 0;
}

#app {
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
}
</style>
