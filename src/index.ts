import WebTerminal from "./utils/terminal";
import TableLog from "./widget/tableLog";
import WidgetInter from "./utils/widgetInter";


export {
  WebTerminal,
  TableLog,
  WidgetInter
}

export interface Options {
  theme?: string;
  historyLength?: number;
  systemInfo?: Partial<SystemInfo>;
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
  focus: void;
  blur: void;
  quit: void;
}

export enum WidgetType {
  userInput,
  weblog,
  progress,
  table
}

export enum InnerType {
  text,
  html
}
