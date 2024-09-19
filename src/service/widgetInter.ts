import {InnerType, WidgetType} from "../index";
import {nanoid} from "nanoid";


export default abstract class WidgetInter<S> {
  id: string;

  abstract type: WidgetType | string;

  abstract innerType: InnerType;

  value?: S;

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

  abstract render(): string;

  onMount() {}
}
