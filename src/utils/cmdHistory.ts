
export default class CmdHistory {
  history: Array<string> = []

  maxLength = 20

  cursor = 0

  constructor(maxLength?: number) {
    maxLength && (this.maxLength = maxLength)
  }

  push(command: string){
    this.history.push(command)
    if(this.history.length > 20) {
      this.history.shift()
    }
    this.cursor = this.history.length
  }

  getLast() {
    if (this.cursor > 0) this.cursor--;
    return this.history[this.cursor];
  }

  getNext() {
    if (this.cursor >= this.history.length) return "";
    this.cursor++;
    return this.history[this.cursor] || "";
  }
}
