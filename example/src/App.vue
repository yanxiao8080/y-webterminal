<template>
  <div class="page">
    <div id="webTerminal" ref="webTermRef"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {WebTerminal, WebLog} from "../../src/index";
import "../../style/index.css"
import "../../style/dark.css"

const webTerminal = new WebTerminal()

const webTermRef = ref()

const weblog = new WebLog()
weblog.set("hello world!")
webTerminal.writeWidget(weblog)

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
  height: 300px;
}
</style>
