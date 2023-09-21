import WidgetInter from "../utils/widgetInter";
import {InnerType, WidgetType} from "../index";


export default class Weblog extends WidgetInter<string> {
  type: WidgetType = WidgetType.weblog;

  innerType: InnerType = InnerType.text;

  constructor(id?: string) {
    super(id)
  }

  render(): string {
    return this.value || "";
  }
}
