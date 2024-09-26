import {SystemInfo} from "../index";
import WebTerminal from "./terminal";
import Render from "./render";
import UserLog from "../widget/userLog";
import CmdHistory from "../utils/cmdHistory";


export default class UserInputHandler {
  systemStr: string;

  inputTextArr: Array<string> = [];

  // 光标位置
  cursor = 0;

  cmdHistory: CmdHistory;

  onQuitFuncList: Array<() => void> = [];

  constructor(
    private webTerminal: WebTerminal,
    private renderHandler: Render,
  ) {
    this.cmdHistory = new CmdHistory(this.webTerminal.options.historyLength)
    this.systemStr = UserLog.formatSystemInfo(this.webTerminal.systemInfo);
  }

  setSystemStr(systemInfo: SystemInfo) {
    this.webTerminal.systemInfo = systemInfo;
    this.systemStr = UserLog.formatSystemInfo(systemInfo);
    this.renderHandler.updateSystemInfo(this.systemStr);
  }

  createUserRow(el: HTMLElement) {
    this.renderHandler.renderUserRow(this.systemStr);
    el.addEventListener("click", this.focus.bind(this))
    this.renderHandler.input?.addEventListener("input", this.onInput.bind(this))

    const keydownHandler = this.onkeydown.bind(this);

    this.renderHandler.input?.addEventListener("focus", () => {
      this.renderHandler.webTerminal?.addEventListener("keydown", keydownHandler)
      this.webTerminal.emitter.emit("focus")
    })
    this.renderHandler.input?.addEventListener("blur", () => {
      this.renderHandler.webTerminal?.removeEventListener("keydown", keydownHandler)
      this.webTerminal.emitter.emit("blur")
    })
  }

  removeUserRow() {
    this.renderHandler.userInputRow?.remove()
  }

  onInput(e: any) {
    const value = e.target.value
    const inputs = value.split("")
    this.inputTextArr.splice(this.cursor, 0, ...inputs)
    this.cursor += inputs.length;
    this.renderHandler.input!.value = ""
    this.updateUserText()
    this.webTerminal.emitter.emit("change", this.inputTextArr.join(""))
  }

  // 更新页面上用户输入的内容
  updateUserText() {
    const beforeText = this.inputTextArr.slice(0, this.cursor)
    const cursorText = this.inputTextArr.slice(this.cursor, this.cursor + 1)
    const afterText = this.inputTextArr.slice(this.cursor + 1, this.inputTextArr.length)
    this.renderHandler.beforeText!.innerText = beforeText.join("")
    if(cursorText[0] === " "){
      this.renderHandler.cursorChar!.innerHTML = "&nbsp;"
    } else {
      this.renderHandler.cursorChar!.innerText = cursorText.join("")
    }
    this.renderHandler.afterText!.innerText = afterText.join("")
    // 当光标存在选中的字符时，将光标宽度设为字符宽度
    if (cursorText.length && cursorText[0] !== " " && this.renderHandler.cursorChar) {
      this.renderHandler.cursorChar.style.width = "auto";
    } else if(!cursorText.length && this.renderHandler.cursorChar) {
      this.renderHandler.cursorChar.style.width = "";
    }
  }

  onkeydown(e: KeyboardEvent) {
    // console.log("onkeydown", e.keyCode, e)
    let stop = false;
    this.webTerminal.emitter.emit("keydown", {
      event: e,
      stop: () => (stop = true)
    })
    if(stop) return;
    switch (e.keyCode) {
      case 13:
      case 100:
        // 回车
        this.enter()
        break;
      case 8:
        // 删除
        this.deleteText()
        break;
      case 46:
        // Delete
        this.deleteRightText()
        break;
      case 37:
        // Left Arrow
        this.leftArrow()
        break;
      case 38:
        // Up Arrow
        this.setUserInput(this.cmdHistory.getLast());
        break;
      case 39:
        // Right Arrow
        this.rightArrow()
        break;
      case 40:
        // Dw Arrow
        this.setUserInput(this.cmdHistory.getNext());
        break;
      case 76:
        // 清理终端
        if(e.ctrlKey) this.cleanTerminal()
        break;
      case 67:
        // 退出当前任务
        if(e.ctrlKey) this.quitTask()
        break;
      case 9:
        // tab自动补齐
        e.preventDefault();
        this.webTerminal.emitter.emit("tabulator", this.inputTextArr.join(""))
        break
    }
  }

  focus() {
    this.renderHandler.input?.focus()
  }

  enter() {
    if (this.renderHandler.userRowHidden) return;
    const command = this.inputTextArr.join("");
    this.inputTextArr = [];
    this.cursor = 0;
    this.webTerminal.clearHelpWidget()
    this.updateUserText();
    this.renderHandler.hiddenUserRow();
    this.renderHandler.scrollBottom();
    if (command.length) this.cmdHistory.push(command);

    const userLog = new UserLog(this.webTerminal.systemInfo);
    userLog.set(command);
    this.webTerminal.logs.push(userLog)
    this.renderHandler.appendUserHistory(userLog);
    this.webTerminal.emitter.emit("enter", {
      command: command,
      onQuit: (cb) => this.onQuitFuncList.push(cb),
      offQuit: () => (this.onQuitFuncList = [])
    });
  }

  deleteText() {
    if (this.cursor < 1) return;
    this.inputTextArr.splice(--this.cursor, 1)
    this.updateUserText()
    this.renderHandler.scrollBottom()
    this.webTerminal.emitter.emit("change", this.inputTextArr.join(""))
  }

  deleteRightText() {
    if (this.cursor > this.inputTextArr.length - 1) return;
    this.inputTextArr.splice(this.cursor, 1)
    this.updateUserText()
    this.renderHandler.scrollBottom()
    this.webTerminal.emitter.emit("change", this.inputTextArr.join(""))
  }

  leftArrow() {
    if (this.cursor < 1) return;
    this.cursor--;
    this.updateUserText();
    this.renderHandler.scrollBottom();
  }

  rightArrow() {
    if (this.cursor > this.inputTextArr.length - 1) return;
    this.cursor++;
    this.updateUserText();
    this.renderHandler.scrollBottom();
  }

  setUserInput(command: string) {
    this.inputTextArr = command.split("");
    this.cursor = this.inputTextArr.length;
    this.updateUserText();
  }

  cleanTerminal() {
    this.renderHandler.cleanTerminal()
  }

  quitTask() {
    this.onQuitFuncList.forEach((cb) => cb());
    this.webTerminal.emitter.emit("quit");
  }
}
