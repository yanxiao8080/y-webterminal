<template>
  <div class="page">
    <div id="webTerminal" ref="webTermRef"></div>
    <div>
      <button @click="writRow">写入一行</button>
      <button @click="clearLogs">清空</button>
      <button @click="scrollBottom">滚动到底部</button>
      <button @click="focus">获取焦点</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {WebTerminal, WidgetType} from "y-webterminal";
import "y-webterminal/style/index.css";
import "y-webterminal/style/dark.css";
import {onMounted, ref} from "vue";

const webTerminal = new WebTerminal({hiddenUserInput: false})

const webTermRef = ref()

onMounted(() => {
  webTerminal.render(webTermRef.value)
})

webTerminal.on("enter", ({command}) => {
  console.log("enter", command)
  webTerminal.showUserRow()
})

function clearLogs() {
  webTerminal.clearLogs((widget) => {
    return widget.type !== WidgetType.userInput
  })
}

function writRow() {
  webTerminal.writeln("test" + Math.random())
  webTerminal.writeln("test" + Math.random())
  webTerminal.writeln("test" + Math.random())
  webTerminal.writeln("test" + Math.random())
  webTerminal.writeln("test" + Math.random())
  webTerminal.writeln("test" + Math.random())
  webTerminal.writeln("test" + Math.random())
  webTerminal.writeln("test" + Math.random())
}

function scrollBottom() {
  webTerminal.scrollBottom()
}

function focus() {
  webTerminal.focus()
}

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
