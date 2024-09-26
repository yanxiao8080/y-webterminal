import WebTerminal from "./service/terminal";
import WidgetInter from "./service/widgetInter";
import UserLog from "./widget/userLog";
import WebLog from "./widget/webLog";
import TableLog from "./widget/tableLog";
import ListLog from "./widget/listLog";


export {
  WebTerminal,
  WidgetInter,
  UserLog,
  WebLog,
  TableLog,
  ListLog
}

export interface Options {
  theme?: string;
  historyLength?: number;
  systemInfo?: Partial<SystemInfo>;
  hiddenUserInput?: boolean;
}

export interface SystemInfo {
  username: string ;
  host: string;
  dir: string;
  mark: string;
  custom?: string | null;
}

export type Events = {
  change: string;
  enter: {
    command: string;
    onQuit: (cb: () => void) => void;
    offQuit: () => void;
  };
  tabulator: string;
  focus: void;
  blur: void;
  quit: void;
  keydown: {
    event: KeyboardEvent,
    stop: () => void;
  };
}

export enum WidgetType {
  userInput,
  weblog,
  table,
  list
}

export enum InnerType {
  text,
  html
}
