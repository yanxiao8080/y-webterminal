import WidgetInter from "../utils/widgetInter";
import {InnerType, SystemInfo, WidgetType} from "../index";


export default class UserLog extends WidgetInter<string>{
  type: WidgetType = WidgetType.userInput;

  innerType: InnerType = InnerType.text;

  systemStr: string;

  constructor(public systemInfo: SystemInfo, id?: string) {
    super(id)
    this.systemStr = UserLog.formatSystemInfo(systemInfo)
  }

  static formatSystemInfo(systemInfo: SystemInfo) {
    if (systemInfo.custom) return systemInfo.custom;
    return `<span class="system-host">${systemInfo.username}${systemInfo.host}</span>&nbsp;
            <span class="system-dir">${systemInfo.dir}</span>&nbsp;
            <span class="system-mark">${systemInfo.mark}</span>&nbsp;`
  }

  render(): string {
    return this.systemStr + this.value;
  }
}
