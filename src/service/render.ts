import {InnerType, Options} from "../index";
import WidgetInter from "./widgetInter";
import UserLog from "../widget/userLog";

export default class Render {
  container: HTMLElement | null = null;

  webTerminal: HTMLDivElement | null = null;

  // 用户输入行
  userInputRow: HTMLDivElement | null = null;

  systemInfoSpan: HTMLSpanElement | null = null;

  cursorChar: HTMLSpanElement | null = null;

  // 输入框
  input: HTMLInputElement | null = null;

  // 光标前的内容
  beforeText: HTMLSpanElement | null = null;

  // 光标后的内容
  afterText: HTMLSpanElement | null = null;

  userRowHidden: boolean = false;

  constructor(private options: Options) {
  }

  render(el: HTMLElement) {
    this.container = el;
    el.classList.add("web-shell-container")
    el.classList.add(this.options.theme || "dark")

    this.webTerminal = document.createElement("div");
    this.webTerminal.className = "web-shell"

    el.appendChild(this.webTerminal);
  }

  createRow(widget: WidgetInter<unknown>) {
    const row = document.createElement("div");
    row.className = "shell-row";
    switch (widget.innerType) {
      case InnerType.text:
        row.innerText = widget.render();
        break;
      case InnerType.html:
        row.innerHTML = widget.render();
        break;
    }
    return row;
  }

  appendRow(widget: WidgetInter<unknown>) {
    const row = this.createRow(widget)
    if (this.userInputRow) {
      this.webTerminal?.insertBefore(row, this.userInputRow)
    } else {
      this.webTerminal?.appendChild(row);
    }
    widget.rowEl = row;
    widget.onMount()
    return row
  }

  appendHelp(widget: WidgetInter<unknown>) {
    const row = this.createRow(widget)
    this.webTerminal?.appendChild(row);
    widget.rowEl = row;
    widget.onMount()
    return row
  }

  appendUserHistory(userInput: UserLog) {
    const row = document.createElement("div");
    row.className = "shell-row user-history";
    const systemInfo = document.createElement("span");
    systemInfo.innerHTML = userInput.systemStr

    const command = document.createElement("span");
    command.innerText = userInput.value || ""
    row.append(systemInfo, command)

    if (this.userInputRow) {
      this.webTerminal?.insertBefore(row, this.userInputRow)
    } else {
      this.webTerminal?.appendChild(row);
    }
    userInput.rowEl = row;
    userInput.onMount()
  }

  renderUserRow(systemInfo: string = "") {
    this.userInputRow = document.createElement("div");
    this.userInputRow.id = "UserInputRow";
    this.userInputRow.className = "shell-row";
    if (this.options.hiddenUserInput) this.userInputRow.style.display = "none"

    this.systemInfoSpan = document.createElement("span");
    this.systemInfoSpan.className = "system-info"
    this.systemInfoSpan.innerHTML = systemInfo;
    this.userInputRow.appendChild(this.systemInfoSpan);

    this.beforeText = document.createElement("span");
    this.userInputRow.appendChild(this.beforeText);

    // 光标位置
    const cursor = document.createElement("span");
    cursor.className = "cursor-position";

    this.cursorChar = document.createElement("span");
    this.cursorChar.className = "cursor-char";
    cursor.appendChild(this.cursorChar)

    this.input = document.createElement("input");
    this.input.id = "WebTerminalInput";
    cursor.appendChild(this.input)

    this.userInputRow.appendChild(cursor);

    this.afterText = document.createElement("span");
    this.userInputRow.appendChild(this.afterText);

    this.webTerminal?.appendChild(this.userInputRow);
  }

  updateSystemInfo(systemInfo: string) {
    this.systemInfoSpan && (this.systemInfoSpan.innerHTML = systemInfo);
  }

  hiddenUserRow() {
    if (!this.userInputRow) return
    this.userInputRow.style.display = "none"
  }

  showUserRow() {
    if (!this.userInputRow) return
    this.userInputRow.style.display = ""
  }

  // 滚动到底部
  scrollBottom() {
    queueMicrotask(() => {
      if (!this.container) return;
      const {height} = this.container.getBoundingClientRect();
      this.container.scrollTo(0, this.container.scrollHeight - height);
    })
  }

  // 清理终端
  cleanTerminal() {
    if (!this.container || !this.webTerminal || !this.userInputRow) return;
    const {top, height: containerHeight} = this.container.getBoundingClientRect()
    const {height} = this.webTerminal.getBoundingClientRect();
    const {top: inputTop} = this.userInputRow.getBoundingClientRect()
    if (inputTop > top + containerHeight) {
      this.scrollBottom();
      return;
    }
    this.webTerminal.style.height = height + inputTop - top + "px";
    this.scrollBottom();
  }

  setTheme(theme: string) {
    this.container?.classList.replace(this.options.theme || "", theme);
    this.options.theme = theme;
  }
}
