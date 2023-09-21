import WidgetInter from "../utils/widgetInter";
import {InnerType, WidgetType} from "../index";


export interface Column{
  prop: string;
  label: string;
  width?: string;
  align?: string
}

export default class TableLog extends WidgetInter<Array<Array<keyof any>> | Array<Record<string, keyof any>>> {
  type: WidgetType = WidgetType.table;

  innerType: InnerType = InnerType.html;

  columns: Array<Column> | null = null;

  constructor(id?: string) {
    super(id)
  }

  set(value: Array<Array<keyof any>>): void;
  set(value: Array<Record<string, keyof any>>, columns: Array<Column>): void;
  set(value: Array<Array<keyof any>> | Array<Record<string, keyof any>>, columns?: Array<Column>): void {
    this.value = value;
    this.columns = columns || null;
    this.updateInner();
  };

  render(): string {
    if (!this.value) return "";
    if(this.columns) return this.toHtmlByJson()
    return this.toHtmlByArray()
  }

  toHtmlByArray() {
    const rows = (this.value as Array<Array<keyof any>>).map((row) => {
      const cols = row.map((col) => `<td class="log-table-td">${String(col)}</td>`)
      return `<tr class="log-table-tr">${cols.join("")}</tr>`
    })
    return `<table class="log-table"><tbody>${rows.join("")}</tbody></table>`;
  }

  toHtmlByJson(): string {
    if (!this.columns) return "";
    const header = this.columns.map((col) => {
      return `<td class="log-table-head-td" style="width: ${col.width}; text-align: ${col.align}">${col.label}</td>`
    })
    const headerStr = `<tr class="log-table-head-tr">${header.join("")}</tr>`;
    const rows = (this.value as Array<Record<string, keyof any>>).map((row) => {
      const cols = this.columns!.map((col) => {
        return `<td style="width: ${col.width}; text-align: ${col.align}">${String(row[col.prop])}</td>`
      })
      return `<tr class="log-table-tr">${cols.join("")}</tr>`
    })
    return `<table class="log-table">
              <thead>${headerStr}</thead>
              <tbody>${rows.join("")}</tbody>
            </table>`;
  }

}
