import WidgetInter from "../service/widgetInter";
import {InnerType, WidgetType} from "../index";


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
