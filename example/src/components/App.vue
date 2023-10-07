<template>
  <div class="page">
    <div id="webTerminal" ref="webTermRef"></div>
  </div>
</template>

<script setup lang="ts">
import {WebTerminal} from "y-webterminal";
import "y-webterminal/style/index.css";
import "y-webterminal/style/dark.css";
import {onMounted, ref} from "vue";

const webTerminal = new WebTerminal()

const webTermRef = ref()

onMounted(() => {
  webTerminal.render(webTermRef.value)
})

webTerminal.on("enter", ({command}) => {
  console.log("enter", command)
  webTerminal.showUserRow()
})


</script>

<style scoped>
.page{
  width: 100%;
  height: 100%;
}
#webTerminal{
  width: 50%;
  height:300px;
}
</style>
