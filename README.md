![](https://img1.imgtp.com/2023/09/25/5a9KoUaQ.gif)

[使用文档](https://juejin.cn/post/7280844372169490493)

[github](https://github.com/yanxiao8080/y-webterminal/)

## 安装

```shell
npm install y-webterminal
```

## 概念

#### WebTerminal

可通过WebTerminal类创建终端、写入日志、监听用户输入。

#### widget部件

向终端写入的每一行日志都是通过widget创建的，不同的widget输出不同。例如调用writeln方法使用的是weblog部件，用户输入使用的是userInput部件。内置的部件还有tablelog，他可以输出网格日志，当用户执行 ls 命令输出当前文件夹下所有文件信息时，使用tablelog很合适。当widget不满足要求时，开发者也可以自己拓展新的widget。

#### systemInfo 

系统信息，由 `username`、`host`、`dir`、`mark` 构成，拼接后如 `user@localhost ~ #  `

## 示例

#### 初始化

```vue
<template>
  <div class="container">
		<!-- 为终端准备一个容器 -->
    <div id="webTerminal"></div>
  </div>
</template>

<style lang="scss" scoped>  
#webTerminal {
  // 设置宽高
  margin: 10px;
  width: 80%;
  height: 300px;
  border-radius: 4px;
}
</style>
<script setup lang="ts">
import {WebTerminal} from "y-webterminal";
// 引入样式文件和需要的主题文件
import "y-webterminal/style/index.css";
import "y-webterminal/style/dark.css";
import "y-webterminal/style/light.css";

// 创建应用实例
const webTerminal = new WebTerminal({
  // 指定主题，名称与主题文件名一样
  theme: "dark",
  // 系统信息
  systemInfo: {
    username: "yanxias",
    host: "@localhost",
    dir: "~",
    mark: "#",
    // 自定义信息，当custom存在时以上配置失效
    custom: ""
  }
})

onMounted(() => {
   // 页面挂载完成，渲染终端
  const webTerminalEl = document.getElementById("webTerminal")!
  webTerminal.render(webTerminalEl)
})
</script>

```

#### 监听回车，与服务器交互并输出日志

```typescript
webTerminal.on("enter", function ({command, onQuit, offQuit}) {
  // 获取到用户输入的命令，模拟与服务器交互
  console.log("onenter", command)
  const log = webTerminal.writeln("0")
  let count = 0
  // 模拟服务器不断传输日志
  const timer = setInterval(() => {
    count++
    // 在原来的日志上修改
    log.set(count + "")
    if(count >= 10){
      // 日志输出完毕
      clearInterval(timer)
      // 设置新的系统信息
      webTerminal.setSystemInfo({
        username: "root"
      })
      // 回车后会自动隐藏用户输入行，所以日志输出完毕后要显示用户输入行
      webTerminal.showUserRow()
      return
    }
  }, 500)
})
```

#### 执行任务期间强制退出

```typescript
// 1. 在回车事件中监听退出事件
webTerminal.on("enter", function ({command, onQuit, offQuit}) {
  let quitCount = 0
  // 监听退出事件
  onQuit(() => {
    quitCount++
    // 用户退出3次后开始退出任务
    if(quitCount >= 3) {
      // 取消监听退出
      offQuit()
      // ......退出任务的代码......
      // 显示用户输入行
      webTerminal.showUserRow()
    }
  })
})
// 2. 直接监听退出事件
webTerminal.on("quit" function() {
  // ......退出任务的代码......
})
```

#### 监听用户输入tab自动补齐命令

```typescript
webTerminal.on("tabulator", function (command) {
  console.log("command", command)
  // 设置用户输入的内容
  webTerminal.setUserInput(command + "new")
  // 创建列表日志，显示提示的命令列表
  const listLog = new ListLog()
  listLog.set(["help", "publish", "run", "test", "build"])
  // 写入提示
  webTerminal.writeHelp(listLog)
})
```

## 写入

#### 追加

```typescript
// 写入一行文本日志
webTerminal.writeln("Hello word!")
// 创建表格日志部件
const tableLog = new TableLog()
tableLog.set([
  ["yx", 18, "xz"],
  ["gc", 17, "yz"],
])
// 写入widget部件
webTerminal.writeWidget(tableLog)
```

#### 查询

```typescript
// 通过下标查询最后一行widget部件
const row = webTerminal.getRow(webTerminal.logs.length - 1)
// 或者通过id查询
const row = webTerminal.getRow(id)
```

#### 修改

```typescript
if(row.type === WidgetType.weblog){
  row.set("new log")
}
```

#### 删除

```typescript
// 通过下标或id删除
webTerminal.deleteRow(webTerminal.logs.length - 1)
webTerminal.deleteRow(id)
```

## API

WebTerminal 

#### 属性

- systemInfo 系统信息
- logs 所有日志
- on 监听用户输入事件

#### 构造函数

```typescript
constructor({theme, systemInfo}: Options);
```

- theme 使用的主题
- systemInfo 系统信息，由 `username`、`host`、`dir`、`mark` 构成，拼接后如 `user@localhost ~ #  `

#### render

渲染终端

```typescript
render(el: HTMLElement);
```

#### writeln

写入文本并换行

```typescript
writeln(text: string, id?: string): WebLog;
```

- text 写入的内容
- id 记录id，可通过id查找这一行
- return 返回WebLog对象

#### writeWidget

写入一个widget

```typescript
writeWidget(widget: WidgetInter<unknown>);
```

- widget 创建的widget对象，继承至WidgetInter

#### writeHelp

向用户输入行下面写入输入提示，例如用户按tab键获取输入提示

```typescript
writeHelp(widget: WidgetInter<unknown>)
```

- widget 创建的widget对象，继承至WidgetInter

#### clearHelpWidget

清空输入提示

```typescript
clearHelpWidget()
```

#### getRow

获取一行日志

```typescript
getRow(cursor: number | string): WidgetInter<unknown> | null;
```

- cursor 下标或id，当cursor为number类型时按下标查询，当cursor为string类型时按id查询
- 返回查到的 widget 或 null

#### deleteRow

删除一行日志

```typescript
deleteRow(cursor: number | string)
```

- cursor 下标或id，当cursor为number类型时按下标查询，当cursor为string类型时按id查询

#### setSystemInfo

设置系统信息

```typescript
setSystemInfo(systemInfo: Partial<SystemInfo>)
```

#### setUserInput

设置用户输入框的内容

```
setUserInput(command: string)
```

- command 输入的内容

#### hiddenUserRow

隐藏用户输入行，在回车后会自动隐藏

#### showUserRow

显示用户输入行

#### focus

使终端获取焦点

#### setTheme

设置主题，前提是先引入对应的主题文件

```typescript
setTheme(theme: string)
```

## 事件

事件系统使用`mitt`，事件类型及参数参考下方 `Events`

#### change

用户输入的内容发生变化时触发，参数：输入的值。

#### focus

获取焦点时触发

#### blur

失去焦点时触发

#### quit

用户输入 `ctrl + c` 时触发，用来退出当前任务

#### enter

用户输入回车执行命令时触发，参数 `{ command, onQuit, offQuit}`

- command 输入的命令
- onQuit 监听退出事件
- offQuit 取消监听退出，如果在enter事件中调用了onQuit方法，记得在合适的时机取消监听，否则多次enter事件重复监听退出事件

#### tabulator

用户输入 `tab` 制表符，参数command

- command 输入的命令

#### keydown

键盘按下事件，参数 `{ event, stop}`

- event 事件参数
- stop 调用stop方法，如果是控制键（例如：回车、删除、tab、上下左右等），y-webterminal将不会处理

## 类型

```typescript
export interface Options {
  theme?: string;
  historyLength?: number;
  systemInfo?: Partial<SystemInfo>;
}

export interface SystemInfo {
  username: string ;
  host: string;
  dir: string;
  mark: string;
  custom?: string | null;
}

export type Events = {
  change: string;
  enter: {
    command: string;
    onQuit: (cb: () => void) => void;
    offQuit: () => void;
  };
  tabulator: string;
  focus: void;
  blur: void;
  quit: void;
  keydown: {
    event: KeyboardEvent,
    stop: () => void;
  };
}

export enum WidgetType {
  userInput,
  weblog,
  progress,
  table
}

export enum InnerType {
  text,
  html
}
```

## 主题

#### 设置主题

````typescript
// 引入样式文件和需要的主题文件
import "y-webterminal/style/index.css";
import "y-webterminal/style/dark.css";
import "y-webterminal/style/light.css";
// 初始化时指定主题
const webTerminal = new WebTerminal({theme: "dark"});
// 后续修改主题
webTerminal.setTheme("light");
````

#### 自定义主题

1. 创建myDark.css文件并引入
2. 在myDark.css文件中定义样式变量

```css
// my-dark 为主题名
.my-dark {
  // 窗口背景
  --web-shell-bg: #1E1E1E;
  // 主要的文字颜色
  --primary-color: #ffffff;
  // 文字大小
  --font-size: 12px;
  // 光标颜色
  --cursor-color: rgba(173, 173, 173, 0.6);
  // 用户和主机名文字颜色
  --host-color: --primary-color;
  // 所在文件夹文字颜色
  --dir-color: --primary-color;
  // 标记颜色
  --mark-color: --primary-color;
}
```

```typescript
// 引入样式文件和自定义主题文件
import "y-webterminal/style/index.css";
import "@/style/myDark.css";
// 指定主题
const webTerminal = new WebTerminal({theme: "my-dark"});
```

## widget的使用及拓展

- userLog  用户输入命令回车后，会将系统信息及输入的命令生成一条日志，追加到日志列表
- webLog 普通的网络日志
- tableLog 以表格的形式输出日志
- listLog 以列表的形式输出日志

#### webLog部件的使用

```typescript
// 直接调用
webTerminal.writeln("hello world");
// 或先创建webLog对象，再设置值，最后调用writeWidget写入
const weblog = new WebLog();
weblog.set("hello world");
webTerminal.writeWidget(weblog);
```

set方法：

```typescript
set(value: string)
```

#### tablelog部件的使用

```typescript
// 创建widget
const tableLog = new TableLog();
// 设置一个二维数组
tableLog.set([
  ["yx", 18, "xz"],
  ["gc", 17, "yz"],
])
// 设置对象数组
tableLog.set([
  {name: "yxx", age: 18, address: "xz"},
  {name: "gcc", age: 17, address: "yz"}
],[
  {prop: "age", label: "年龄"},
  {prop: "name", label: "姓名"},
  {prop: "address", label: "地区", align: "right"}
]);
webTerminal.writeWidget(tableLog);
```

set方法：

```typescript
interface Column{
  prop: string;
  label: string;
  width?: string;
  align?: string
}
set(value: Array<Array<keyof any>>): void;
set(value: Array<Record<string, keyof any>>, columns: Array<Column>): void;
```

#### listLog部件的使用

```typescript
const listLog = new ListLog()
// 参数为一个数组，数组中可以是字符串或者对象
listLog.set([
  "index.html", 
  "index.ts", 
  {
    value: "static",
  	style: "color: red"
  }
])
webTerminal.writeHelp(listLog)
```

set方法：

```typescript
// class: 元素的类名， style: 元素的样式
set(value: Array<string | {value: string, class?: string, style?: string}>)
```

#### 拓展

当widget不满足要求时，或开发者想拓展新的widget时，可通过继承WidgetInter抽象类来开发自己的widget，所有widget都是继承至WidgetInter

```typescript
export default abstract class WidgetInter<S> {
  // wedget的唯一标识
  id: string;

  // wedget的类型，拓展时可以是string类型
  abstract type: WidgetType | string;

  // 以哪种方式插入到节点，文本或html字符串
  abstract innerType: InnerType;

  // 数据
  value?: S;

  // 插入的dom节点
  rowEl: HTMLDivElement | null = null;

  protected constructor(id?: string) {
    this.id = id || nanoid();
  }

  get() {
    return this.value;
  };

  set(value: S) {
    this.value = value;
    this.updateInner()
  };

  // 更新dom节点
  updateInner() {
    if (!this.rowEl) return;
    switch (this.innerType) {
      case InnerType.text:
        this.rowEl.innerText = this.render();
        break;
      case InnerType.html:
        this.rowEl.innerHTML = this.render();
        break;
    }
  }

  // 每次插入dom节点都会调用render函数，它应该返回一个字符串。当innerType为InnerType.html时，可以返回html字符串。
  abstract render(): string;

  // 当dom节点插入到文本后调用onMount，此时可以访问rowEl
  onMount() {}
}

```

例如weblog部件

```typescript
export default class WebLog extends WidgetInter<string> {
  type: WidgetType = WidgetType.weblog;

  innerType: InnerType = InnerType.text;

  constructor(id?: string) {
    super(id)
  }

  render(): string {
    return this.value || "";
  }
}
```
