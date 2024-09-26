import mitt, {Emitter} from "mitt";
import WidgetInter from "./widgetInter";
import Render from "./render";
import UserInputHandler from "./userInputHandler";
import WebLog from "../widget/webLog";
import {Events, Options, SystemInfo} from "../index";
import {deepClone} from "../utils";

export default class WebTerminal {
  public emitter: Emitter<Events> = mitt<Events>();

  on = this.emitter.on;

  systemInfo: SystemInfo = {
    username: "user",
    host: "@localhost",
    dir: "~",
    mark: "#"
  };

  logs: Array<WidgetInter<unknown>> = [];

  helpWidgetList: Array<WidgetInter<unknown>> = [];

  private readonly renderHandler: Render;

  private userHandler: UserInputHandler;

  constructor(public options: Options = {}) {
    this.renderHandler = new Render(this.options);
    this.userHandler = new UserInputHandler(this, this.renderHandler);
    this.options.systemInfo && this.setSystemInfo(this.options.systemInfo);
  }

  render(el: HTMLElement) {
    this.renderHandler.render(el);
    this.userHandler.createUserRow(el);
    this.logs.forEach((widget) => {
      this.renderHandler.appendRow(widget);
    });
  }

  // 写入并换行
  writeln(text: string, id?: string) {
    const weblog = new WebLog(id);
    weblog.set(text);
    this.logs.push(weblog);
    this.renderHandler.appendRow(weblog);
    return weblog;
  }

  writeWidget(widget: WidgetInter<unknown>) {
    this.logs.push(widget);
    this.renderHandler.appendRow(widget);
  }

  writeHelp(widget: WidgetInter<unknown>) {
    this.helpWidgetList.push(widget);
    this.renderHandler.appendHelp(widget);
  }

  clearHelpWidget() {
    this.helpWidgetList.forEach((widget) => widget.rowEl?.remove());
    this.helpWidgetList = [];
  }

  // 获取指定行文本对象
  getRow(cursor: number | string): WidgetInter<unknown> | null {
    if (typeof cursor === "number"){
      return this.logs[cursor] || null;
    } else {
      return this.logs.find((item) => item.id === cursor) || null;
    }
  }

  deleteRow(cursor: number | string) {
    if (typeof cursor === "number") {
      const widget = this.logs[cursor];
      if (this.logs[cursor]){
        this.logs.splice(cursor, 1);
        widget.rowEl?.remove();
      }
    } else {
      const idx = this.logs.findIndex((item) => item.id === cursor);
      if(idx !== -1) {
        this.logs.splice(idx, 1);
        this.logs[idx].rowEl?.remove();
      }
    }
  }

  clearLogs(filter?: (widget: WidgetInter<unknown>) => boolean) {
    let logs = deepClone(this.logs);
    if (filter) logs = logs.filter(filter);
    logs.forEach((widget) => {
      widget.rowEl?.remove();
      const idx = this.logs.findIndex((w) => w.id === widget.id)
      if (idx !== -1) this.logs.splice(idx, 1)
    });
  }

  setSystemInfo(systemInfo: Partial<SystemInfo>) {
    this.systemInfo = Object.assign(this.systemInfo, systemInfo);
    this.userHandler.setSystemStr(this.systemInfo);
  }

  // 设置用户输入内容
  setUserInput(command: string) {
    this.userHandler.setUserInput(command);
  }

  hiddenUserRow() {
    this.renderHandler.hiddenUserRow();
  }

  showUserRow() {
    this.renderHandler.showUserRow();
    this.userHandler.focus();
  }

  focus() {
    this.userHandler.focus();
  }

  setTheme(theme: string) {
    this.renderHandler.setTheme(theme);
  }

  // 滚动条滚动到底部
  scrollBottom() {
    this.renderHandler.scrollBottom()
  }
}
