import mitt, {Emitter} from "mitt";
import WidgetInter from "./widgetInter";
import Render from "./render";
import UserInputHandler from "./userInputHandler";
import Weblog from "../widget/weblog";
import {Events, Options, SystemInfo} from "../index";

export default class WebTerminal {
  public emitter: Emitter<Events> = mitt<Events>()

  on = this.emitter.on

  systemInfo: SystemInfo = {
    username: "user",
    host: "@localhost",
    dir: "~",
    mark: "#"
  }

  rows: Array<WidgetInter<unknown>> = [];

  private readonly renderHandler: Render;

  private userHandler: UserInputHandler;

  constructor(public options: Options) {
    this.renderHandler = new Render(options);
    this.userHandler = new UserInputHandler(this, this.renderHandler);
    options.systemInfo && this.setSystemInfo(options.systemInfo);
  }

  render(el: HTMLElement) {
    this.renderHandler.render(el)
    this.userHandler.setUserRow(el)
    this.rows.forEach((widget) => {
      widget.rowEl = this.renderHandler.appendRow(widget);
    })
  }

  // 写入并换行
  writeln(text: string, id?: string) {
    const weblog = new Weblog(id);
    weblog.set(text)
    this.rows.push(weblog);
    weblog.rowEl = this.renderHandler.appendRow(weblog);
    return weblog;
  }

  writeWidget(widget: WidgetInter<unknown>) {
    this.rows.push(widget);
    widget.rowEl = this.renderHandler.appendRow(widget);
  }

  // 获取指定行文本对象
  getRow(cursor: number | string): WidgetInter<unknown> | null {
    if (typeof cursor === "number"){
      return this.rows[cursor] || null;
    } else {
      return this.rows.find((item) => item.id === cursor) || null;
    }
  }

  deleteRow(cursor: number | string) {
    if (typeof cursor === "number") {
      const widget = this.rows[cursor]
      if (this.rows[cursor]){
        this.rows.splice(cursor, 1);
        widget.rowEl?.remove();
      }
    } else {
      const idx = this.rows.findIndex((item) => item.id === cursor);
      if(idx !== -1) {
        this.rows.splice(idx, 1);
        this.rows[idx].rowEl?.remove();
      }
    }
  }

  setSystemInfo(systemInfo: Partial<SystemInfo>) {
    this.systemInfo = Object.assign(this.systemInfo, systemInfo);
    this.userHandler.setSystemStr(this.systemInfo);
  }

  hiddenUserRow() {
    this.renderHandler.hiddenUserRow();
  }

  showUserRow() {
    this.renderHandler.showUserRow();
    this.userHandler.focus();
  }

  focus() {
    this.userHandler.focus()
  }

  setTheme(theme: string) {
    this.renderHandler.setTheme(theme)
  }
}
