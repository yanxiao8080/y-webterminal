import WidgetInter from "../service/widgetInter";
import {InnerType, WidgetType} from "../index";
import {CheckType} from "../utils/checkType";

export default class ListLog extends WidgetInter<Array<string | {value: string, class?: string, style?: string}>> {
  type: WidgetType | string = WidgetType.list;

  innerType: InnerType = InnerType.html;

  constructor(id?: string) {
    super(id);
  }

  render(): string {
    const list = this.value.map((item) => {
      if(CheckType.isObject(item)) {
        return `<span class="${item.class}" style="${item.style}">${item.value}</span>`
      } else {
        return `<span>${item}</span>`
      }
    })
    return `<div class="list-log">${list.join("")}</div>`;
  }

  onMount() {
    const spanList = this.rowEl.children[0].children
    let maxWidth = 0
    for (let idx=0;idx<spanList.length;idx++){
      const span = spanList.item(idx)
      const {width} = span.getBoundingClientRect()
      console.log(width)
      if(width > maxWidth) maxWidth = width;
    }
    if(maxWidth > 0) {
      for (let idx=0;idx<spanList.length;idx++){
        const span = spanList.item(idx)
        const style = span.getAttribute("style")
        span.setAttribute("style",  `width: ${Math.round(maxWidth)}px;` + style)
      }
    }
  }

}
