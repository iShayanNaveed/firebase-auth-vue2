<template>
  <div id="app">
    <nav>
      <!-- <NavBar /> -->
    </nav>
    <router-view />
  </div>
</template>
<script lang="ts">
import NavBar from "../src/components/NavBar.vue";
export default {
  components: {
    NavBar,
  },
};
</script>
<style></style>
