/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  InnerType: function() { return /* binding */ InnerType; },
  ListLog: function() { return /* reexport */ listLog; },
  TableLog: function() { return /* reexport */ tableLog; },
  UserLog: function() { return /* reexport */ widget_userLog; },
  WebLog: function() { return /* reexport */ webLog; },
  WebTerminal: function() { return /* reexport */ terminal; },
  WidgetInter: function() { return /* reexport */ widgetInter; },
  WidgetType: function() { return /* binding */ WidgetType; }
});

;// CONCATENATED MODULE: ./node_modules/mitt/dist/mitt.mjs
/* harmony default export */ function mitt(n){return{all:n=n||new Map,on:function(t,e){var i=n.get(t);i?i.push(e):n.set(t,[e])},off:function(t,e){var i=n.get(t);i&&(e?i.splice(i.indexOf(e)>>>0,1):n.set(t,[]))},emit:function(t,e){var i=n.get(t);i&&i.slice().map(function(n){n(e)}),(i=n.get("*"))&&i.slice().map(function(n){n(t,e)})}}}
//# sourceMappingURL=mitt.mjs.map

;// CONCATENATED MODULE: ./src/utils/render.ts

var Render = /** @class */ (function () {
    function Render(options) {
        this.options = options;
        this.container = null;
        this.webTerminal = null;
        // 用户输入行
        this.userInputRow = null;
        this.systemInfoSpan = null;
        this.cursorChar = null;
        // 输入框
        this.input = null;
        // 光标前的内容
        this.beforeText = null;
        // 光标后的内容
        this.afterText = null;
        this.userRowHidden = false;
    }
    Render.prototype.render = function (el) {
        this.container = el;
        el.classList.add("web-shell-container");
        el.classList.add(this.options.theme || "dark");
        this.webTerminal = document.createElement("div");
        this.webTerminal.className = "web-shell";
        el.appendChild(this.webTerminal);
    };
    Render.prototype.createRow = function (widget) {
        var row = document.createElement("div");
        row.className = "shell-row";
        switch (widget.innerType) {
            case InnerType.text:
                row.innerText = widget.render();
                break;
            case InnerType.html:
                row.innerHTML = widget.render();
                break;
        }
        return row;
    };
    Render.prototype.appendRow = function (widget) {
        var _a, _b;
        var row = this.createRow(widget);
        if (this.userInputRow) {
            (_a = this.webTerminal) === null || _a === void 0 ? void 0 : _a.insertBefore(row, this.userInputRow);
        }
        else {
            (_b = this.webTerminal) === null || _b === void 0 ? void 0 : _b.appendChild(row);
        }
        widget.rowEl = row;
        widget.onMount();
        return row;
    };
    Render.prototype.appendHelp = function (widget) {
        var _a;
        var row = this.createRow(widget);
        (_a = this.webTerminal) === null || _a === void 0 ? void 0 : _a.appendChild(row);
        widget.rowEl = row;
        widget.onMount();
        return row;
    };
    Render.prototype.appendUserHistory = function (userInput) {
        var _a, _b;
        var row = document.createElement("div");
        row.className = "shell-row";
        var systemInfo = document.createElement("span");
        systemInfo.innerHTML = userInput.systemStr;
        var command = document.createElement("span");
        command.innerText = userInput.value || "";
        row.append(systemInfo, command);
        if (this.userInputRow) {
            (_a = this.webTerminal) === null || _a === void 0 ? void 0 : _a.insertBefore(row, this.userInputRow);
        }
        else {
            (_b = this.webTerminal) === null || _b === void 0 ? void 0 : _b.appendChild(row);
        }
        userInput.rowEl = row;
        userInput.onMount();
    };
    Render.prototype.setUserRow = function (systemInfo) {
        var _a;
        if (systemInfo === void 0) { systemInfo = ""; }
        this.userInputRow = document.createElement("div");
        this.userInputRow.id = "UserInputRow";
        this.userInputRow.className = "shell-row";
        this.systemInfoSpan = document.createElement("span");
        this.systemInfoSpan.className = "system-info";
        this.systemInfoSpan.innerHTML = systemInfo;
        this.userInputRow.appendChild(this.systemInfoSpan);
        this.beforeText = document.createElement("span");
        this.userInputRow.appendChild(this.beforeText);
        // 光标位置
        var cursor = document.createElement("span");
        cursor.className = "cursor-position";
        this.cursorChar = document.createElement("span");
        this.cursorChar.className = "cursor-char";
        cursor.appendChild(this.cursorChar);
        this.input = document.createElement("input");
        this.input.id = "WebTerminalInput";
        cursor.appendChild(this.input);
        this.userInputRow.appendChild(cursor);
        this.afterText = document.createElement("span");
        this.userInputRow.appendChild(this.afterText);
        (_a = this.webTerminal) === null || _a === void 0 ? void 0 : _a.appendChild(this.userInputRow);
    };
    Render.prototype.updateSystemInfo = function (systemInfo) {
        this.systemInfoSpan && (this.systemInfoSpan.innerHTML = systemInfo);
    };
    Render.prototype.hiddenUserRow = function () {
        if (this.systemInfoSpan && this.beforeText && this.afterText && this.cursorChar) {
            this.userRowHidden = true;
            this.systemInfoSpan.style.display = "none";
            this.beforeText.style.display = "none";
            this.afterText.style.display = "none";
            this.cursorChar.style.display = "none";
        }
    };
    Render.prototype.showUserRow = function () {
        if (this.systemInfoSpan && this.beforeText && this.afterText && this.cursorChar) {
            this.userRowHidden = false;
            this.systemInfoSpan.style.display = "";
            this.beforeText.style.display = "";
            this.afterText.style.display = "";
            this.cursorChar.style.display = "";
        }
    };
    Render.prototype.scrollBottom = function () {
        var _this = this;
        queueMicrotask(function () {
            if (!_this.container)
                return;
            var height = _this.container.getBoundingClientRect().height;
            _this.container.scrollTo(0, _this.container.scrollHeight - height);
        });
    };
    Render.prototype.clearLog = function () {
        if (!this.container || !this.webTerminal || !this.userInputRow)
            return;
        var _a = this.container.getBoundingClientRect(), top = _a.top, containerHeight = _a.height;
        var height = this.webTerminal.getBoundingClientRect().height;
        var inputTop = this.userInputRow.getBoundingClientRect().top;
        if (inputTop > top + containerHeight) {
            this.scrollBottom();
            return;
        }
        this.webTerminal.style.height = height + inputTop - top + "px";
        this.scrollBottom();
    };
    Render.prototype.setTheme = function (theme) {
        this.container.classList.replace(this.options.theme, theme);
        this.options.theme = theme;
    };
    return Render;
}());
/* harmony default export */ const render = (Render);

;// CONCATENATED MODULE: ./node_modules/nanoid/index.browser.js

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')

;// CONCATENATED MODULE: ./src/utils/widgetInter.ts


var WidgetInter = /** @class */ (function () {
    function WidgetInter(id) {
        this.rowEl = null;
        this.id = id || nanoid();
    }
    WidgetInter.prototype.get = function () {
        return this.value;
    };
    ;
    WidgetInter.prototype.set = function (value) {
        this.value = value;
        this.updateInner();
    };
    ;
    WidgetInter.prototype.updateInner = function () {
        if (!this.rowEl)
            return;
        switch (this.innerType) {
            case InnerType.text:
                this.rowEl.innerText = this.render();
                break;
            case InnerType.html:
                this.rowEl.innerHTML = this.render();
                break;
        }
    };
    WidgetInter.prototype.onMount = function () { };
    return WidgetInter;
}());
/* harmony default export */ const widgetInter = (WidgetInter);

;// CONCATENATED MODULE: ./src/widget/userLog.ts
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var UserLog = /** @class */ (function (_super) {
    __extends(UserLog, _super);
    function UserLog(systemInfo, id) {
        var _this = _super.call(this, id) || this;
        _this.systemInfo = systemInfo;
        _this.type = WidgetType.userInput;
        _this.innerType = InnerType.text;
        _this.systemStr = UserLog.formatSystemInfo(systemInfo);
        return _this;
    }
    UserLog.formatSystemInfo = function (systemInfo) {
        if (systemInfo.custom)
            return systemInfo.custom;
        return "<span class=\"system-host\">".concat(systemInfo.username).concat(systemInfo.host, "</span>&nbsp;\n            <span class=\"system-dir\">").concat(systemInfo.dir, "</span>&nbsp;\n            <span class=\"system-mark\">").concat(systemInfo.mark, "</span>&nbsp;");
    };
    UserLog.prototype.render = function () {
        return this.systemStr + this.value;
    };
    return UserLog;
}(widgetInter));
/* harmony default export */ const widget_userLog = (UserLog);

;// CONCATENATED MODULE: ./src/utils/cmdHistory.ts
var CmdHistory = /** @class */ (function () {
    function CmdHistory(maxLength) {
        this.history = [];
        this.maxLength = 20;
        this.cursor = 0;
        maxLength && (this.maxLength = maxLength);
    }
    CmdHistory.prototype.push = function (command) {
        this.history.push(command);
        if (this.history.length > 20) {
            this.history.shift();
        }
        this.cursor = this.history.length;
    };
    CmdHistory.prototype.getLast = function () {
        if (this.cursor > 0)
            this.cursor--;
        return this.history[this.cursor];
    };
    CmdHistory.prototype.getNext = function () {
        if (this.cursor >= this.history.length)
            return "";
        this.cursor++;
        return this.history[this.cursor] || "";
    };
    return CmdHistory;
}());
/* harmony default export */ const cmdHistory = (CmdHistory);

;// CONCATENATED MODULE: ./src/utils/userInputHandler.ts
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};


var UserInputHandler = /** @class */ (function () {
    function UserInputHandler(webTerminal, renderHandler) {
        this.webTerminal = webTerminal;
        this.renderHandler = renderHandler;
        this.inputTextArr = [];
        // 光标位置
        this.cursor = 0;
        this.onQuitFuncList = [];
        this.cmdHistory = new cmdHistory(this.webTerminal.options.historyLength);
        this.systemStr = widget_userLog.formatSystemInfo(this.webTerminal.systemInfo);
    }
    UserInputHandler.prototype.setSystemStr = function (systemInfo) {
        this.webTerminal.systemInfo = systemInfo;
        this.systemStr = widget_userLog.formatSystemInfo(systemInfo);
        this.renderHandler.updateSystemInfo(this.systemStr);
    };
    UserInputHandler.prototype.setUserRow = function (el) {
        var _this = this;
        var _a, _b, _c;
        this.renderHandler.setUserRow(this.systemStr);
        el.addEventListener("click", this.focus.bind(this));
        (_a = this.renderHandler.input) === null || _a === void 0 ? void 0 : _a.addEventListener("input", this.onInput.bind(this));
        var keydownHandler = this.onkeydown.bind(this);
        (_b = this.renderHandler.input) === null || _b === void 0 ? void 0 : _b.addEventListener("focus", function () {
            var _a;
            (_a = _this.renderHandler.webTerminal) === null || _a === void 0 ? void 0 : _a.addEventListener("keydown", keydownHandler);
            _this.webTerminal.emitter.emit("focus");
        });
        (_c = this.renderHandler.input) === null || _c === void 0 ? void 0 : _c.addEventListener("blur", function () {
            var _a;
            (_a = _this.renderHandler.webTerminal) === null || _a === void 0 ? void 0 : _a.removeEventListener("keydown", keydownHandler);
            _this.webTerminal.emitter.emit("blur");
        });
    };
    UserInputHandler.prototype.removeUserRow = function () {
        var _a;
        (_a = this.renderHandler.userInputRow) === null || _a === void 0 ? void 0 : _a.remove();
    };
    UserInputHandler.prototype.onInput = function (e) {
        var _a;
        var value = e.target.value;
        var inputs = value.split("");
        (_a = this.inputTextArr).splice.apply(_a, __spreadArray([this.cursor, 0], inputs, false));
        this.cursor += inputs.length;
        this.renderHandler.input.value = "";
        this.updateUserText();
        this.renderHandler.scrollBottom();
        this.webTerminal.emitter.emit("change", this.inputTextArr.join(""));
    };
    // 更新页面上用户输入的内容
    UserInputHandler.prototype.updateUserText = function () {
        var beforeText = this.inputTextArr.slice(0, this.cursor);
        var cursorText = this.inputTextArr.slice(this.cursor, this.cursor + 1);
        var afterText = this.inputTextArr.slice(this.cursor + 1, this.inputTextArr.length);
        this.renderHandler.beforeText.innerText = beforeText.join("");
        if (cursorText[0] === " ") {
            this.renderHandler.cursorChar.innerHTML = "&nbsp;";
        }
        else {
            this.renderHandler.cursorChar.innerText = cursorText.join("");
        }
        this.renderHandler.afterText.innerText = afterText.join("");
        // 当光标存在选中的字符时，将光标宽度设为字符宽度
        if (cursorText.length && cursorText[0] !== " " && this.renderHandler.cursorChar) {
            this.renderHandler.cursorChar.style.width = "auto";
        }
        else if (!cursorText.length && this.renderHandler.cursorChar) {
            this.renderHandler.cursorChar.style.width = "";
        }
    };
    UserInputHandler.prototype.onkeydown = function (e) {
        // console.log("onkeydown", e.keyCode, e)
        var stop = false;
        this.webTerminal.emitter.emit("keydown", {
            event: e,
            stop: function () { return (stop = true); }
        });
        if (stop)
            return;
        switch (e.keyCode) {
            case 13:
            case 100:
                // 回车
                this.enter();
                break;
            case 8:
                // 删除
                this.deleteText();
                break;
            case 46:
                // Delete
                this.deleteRightText();
                break;
            case 37:
                // Left Arrow
                this.leftArrow();
                break;
            case 38:
                // Up Arrow
                this.setUserInput(this.cmdHistory.getLast());
                break;
            case 39:
                // Right Arrow
                this.rightArrow();
                break;
            case 40:
                // Dw Arrow
                this.setUserInput(this.cmdHistory.getNext());
                break;
            case 76:
                // 清空日志
                if (e.ctrlKey)
                    this.clearLog();
                break;
            case 67:
                // 退出当前任务
                if (e.ctrlKey)
                    this.quitTask();
                break;
            case 9:
                // tab自动补齐
                e.preventDefault();
                this.webTerminal.emitter.emit("tabulator", this.inputTextArr.join(""));
                break;
        }
    };
    UserInputHandler.prototype.focus = function () {
        var _a;
        (_a = this.renderHandler.input) === null || _a === void 0 ? void 0 : _a.focus();
    };
    UserInputHandler.prototype.enter = function () {
        var _this = this;
        if (this.renderHandler.userRowHidden)
            return;
        var command = this.inputTextArr.join("");
        this.inputTextArr = [];
        this.cursor = 0;
        this.webTerminal.clearHelpWidget();
        this.updateUserText();
        this.renderHandler.hiddenUserRow();
        this.renderHandler.scrollBottom();
        if (command.length)
            this.cmdHistory.push(command);
        var userLog = new widget_userLog(this.webTerminal.systemInfo);
        userLog.set(command);
        this.renderHandler.appendUserHistory(userLog);
        this.webTerminal.emitter.emit("enter", {
            command: command,
            onQuit: function (cb) { return _this.onQuitFuncList.push(cb); },
            offQuit: function () { return (_this.onQuitFuncList = []); }
        });
    };
    UserInputHandler.prototype.deleteText = function () {
        if (this.cursor < 1)
            return;
        this.inputTextArr.splice(--this.cursor, 1);
        this.updateUserText();
        this.renderHandler.scrollBottom();
        this.webTerminal.emitter.emit("change", this.inputTextArr.join(""));
    };
    UserInputHandler.prototype.deleteRightText = function () {
        if (this.cursor > this.inputTextArr.length - 1)
            return;
        this.inputTextArr.splice(this.cursor, 1);
        this.updateUserText();
        this.renderHandler.scrollBottom();
        this.webTerminal.emitter.emit("change", this.inputTextArr.join(""));
    };
    UserInputHandler.prototype.leftArrow = function () {
        if (this.cursor < 1)
            return;
        this.cursor--;
        this.updateUserText();
        this.renderHandler.scrollBottom();
    };
    UserInputHandler.prototype.rightArrow = function () {
        if (this.cursor > this.inputTextArr.length - 1)
            return;
        this.cursor++;
        this.updateUserText();
        this.renderHandler.scrollBottom();
    };
    UserInputHandler.prototype.setUserInput = function (command) {
        this.inputTextArr = command.split("");
        this.cursor = this.inputTextArr.length;
        this.updateUserText();
    };
    UserInputHandler.prototype.clearLog = function () {
        this.renderHandler.clearLog();
    };
    UserInputHandler.prototype.quitTask = function () {
        this.onQuitFuncList.forEach(function (cb) { return cb(); });
        this.webTerminal.emitter.emit("quit");
    };
    return UserInputHandler;
}());
/* harmony default export */ const userInputHandler = (UserInputHandler);

;// CONCATENATED MODULE: ./src/widget/webLog.ts
var webLog_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var WebLog = /** @class */ (function (_super) {
    webLog_extends(WebLog, _super);
    function WebLog(id) {
        var _this = _super.call(this, id) || this;
        _this.type = WidgetType.weblog;
        _this.innerType = InnerType.text;
        return _this;
    }
    WebLog.prototype.render = function () {
        return this.value || "";
    };
    return WebLog;
}(widgetInter));
/* harmony default export */ const webLog = (WebLog);

;// CONCATENATED MODULE: ./src/utils/terminal.ts




var WebTerminal = /** @class */ (function () {
    function WebTerminal(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.emitter = mitt();
        this.on = this.emitter.on;
        this.systemInfo = {
            username: "user",
            host: "@localhost",
            dir: "~",
            mark: "#"
        };
        this.logs = [];
        this.helpWidgetList = [];
        this.renderHandler = new render(this.options);
        this.userHandler = new userInputHandler(this, this.renderHandler);
        this.options.systemInfo && this.setSystemInfo(this.options.systemInfo);
    }
    WebTerminal.prototype.render = function (el) {
        var _this = this;
        this.renderHandler.render(el);
        this.userHandler.setUserRow(el);
        this.logs.forEach(function (widget) {
            _this.renderHandler.appendRow(widget);
        });
    };
    // 写入并换行
    WebTerminal.prototype.writeln = function (text, id) {
        var weblog = new webLog(id);
        weblog.set(text);
        this.logs.push(weblog);
        this.renderHandler.appendRow(weblog);
        return weblog;
    };
    WebTerminal.prototype.writeWidget = function (widget) {
        this.logs.push(widget);
        this.renderHandler.appendRow(widget);
    };
    WebTerminal.prototype.writeHelp = function (widget) {
        this.helpWidgetList.push(widget);
        this.renderHandler.appendHelp(widget);
    };
    WebTerminal.prototype.clearHelpWidget = function () {
        this.helpWidgetList.forEach(function (widget) { return widget.rowEl.remove(); });
        this.helpWidgetList = [];
    };
    // 获取指定行文本对象
    WebTerminal.prototype.getRow = function (cursor) {
        if (typeof cursor === "number") {
            return this.logs[cursor] || null;
        }
        else {
            return this.logs.find(function (item) { return item.id === cursor; }) || null;
        }
    };
    WebTerminal.prototype.deleteRow = function (cursor) {
        var _a, _b;
        if (typeof cursor === "number") {
            var widget = this.logs[cursor];
            if (this.logs[cursor]) {
                this.logs.splice(cursor, 1);
                (_a = widget.rowEl) === null || _a === void 0 ? void 0 : _a.remove();
            }
        }
        else {
            var idx = this.logs.findIndex(function (item) { return item.id === cursor; });
            if (idx !== -1) {
                this.logs.splice(idx, 1);
                (_b = this.logs[idx].rowEl) === null || _b === void 0 ? void 0 : _b.remove();
            }
        }
    };
    WebTerminal.prototype.setSystemInfo = function (systemInfo) {
        this.systemInfo = Object.assign(this.systemInfo, systemInfo);
        this.userHandler.setSystemStr(this.systemInfo);
    };
    WebTerminal.prototype.setUserInput = function (command) {
        this.userHandler.setUserInput(command);
    };
    WebTerminal.prototype.hiddenUserRow = function () {
        this.renderHandler.hiddenUserRow();
    };
    WebTerminal.prototype.showUserRow = function () {
        this.renderHandler.showUserRow();
        this.userHandler.focus();
    };
    WebTerminal.prototype.focus = function () {
        this.userHandler.focus();
    };
    WebTerminal.prototype.setTheme = function (theme) {
        this.renderHandler.setTheme(theme);
    };
    return WebTerminal;
}());
/* harmony default export */ const terminal = (WebTerminal);

;// CONCATENATED MODULE: ./src/widget/tableLog.ts
var tableLog_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TableLog = /** @class */ (function (_super) {
    tableLog_extends(TableLog, _super);
    function TableLog(id) {
        var _this = _super.call(this, id) || this;
        _this.type = WidgetType.table;
        _this.innerType = InnerType.html;
        _this.columns = null;
        return _this;
    }
    TableLog.prototype.set = function (value, columns) {
        this.value = value;
        this.columns = columns || null;
        this.updateInner();
    };
    ;
    TableLog.prototype.render = function () {
        if (!this.value)
            return "";
        if (this.columns)
            return this.toHtmlByJson();
        return this.toHtmlByArray();
    };
    TableLog.prototype.toHtmlByArray = function () {
        var rows = this.value.map(function (row) {
            var cols = row.map(function (col) { return "<td class=\"log-table-td\">".concat(String(col), "</td>"); });
            return "<tr class=\"log-table-tr\">".concat(cols.join(""), "</tr>");
        });
        return "<table class=\"log-table\"><tbody>".concat(rows.join(""), "</tbody></table>");
    };
    TableLog.prototype.toHtmlByJson = function () {
        var _this = this;
        if (!this.columns)
            return "";
        var header = this.columns.map(function (col) {
            return "<td class=\"log-table-head-td\" style=\"width: ".concat(col.width, "; text-align: ").concat(col.align, "\">").concat(col.label, "</td>");
        });
        var headerStr = "<tr class=\"log-table-head-tr\">".concat(header.join(""), "</tr>");
        var rows = this.value.map(function (row) {
            var cols = _this.columns.map(function (col) {
                return "<td style=\"width: ".concat(col.width, "; text-align: ").concat(col.align, "\">").concat(String(row[col.prop]), "</td>");
            });
            return "<tr class=\"log-table-tr\">".concat(cols.join(""), "</tr>");
        });
        return "<table class=\"log-table\">\n              <thead>".concat(headerStr, "</thead>\n              <tbody>").concat(rows.join(""), "</tbody>\n            </table>");
    };
    return TableLog;
}(widgetInter));
/* harmony default export */ const tableLog = (TableLog);

;// CONCATENATED MODULE: ./src/utils/checkType.ts
var CheckType = /** @class */ (function () {
    function CheckType() {
    }
    CheckType.getType = function (v) {
        return Object.prototype.toString.call(v);
    };
    CheckType.isNumber = function (v) {
        return CheckType.getType(v) === '[object Number]';
    };
    CheckType.isString = function (v) {
        return CheckType.getType(v) === '[object String]';
    };
    CheckType.isBoolean = function (v) {
        return CheckType.getType(v) === '[object Boolean]';
    };
    CheckType.isObject = function (v) {
        return CheckType.getType(v) === '[object Object]';
    };
    CheckType.isArray = function (v) {
        return CheckType.getType(v) === '[object Array]';
    };
    CheckType.isEmptyObj = function (v) {
        return CheckType.isObject(v) && !Object.keys(v).length;
    };
    CheckType.isEmptyArr = function (v) {
        return CheckType.isArray(v) && !v.length;
    };
    CheckType.isFunction = function (v) {
        return CheckType.getType(v) === '[object Function]';
    };
    // 不为 undefined && null
    CheckType.isExist = function (v) {
        return v !== undefined && v !== null;
    };
    CheckType.isDate = function (v) {
        return CheckType.getType(v) === '[object Date]';
    };
    return CheckType;
}());


;// CONCATENATED MODULE: ./src/widget/listLog.ts
var listLog_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var ListLog = /** @class */ (function (_super) {
    listLog_extends(ListLog, _super);
    function ListLog(id) {
        var _this = _super.call(this, id) || this;
        _this.type = WidgetType.list;
        _this.innerType = InnerType.html;
        return _this;
    }
    ListLog.prototype.render = function () {
        var list = this.value.map(function (item) {
            if (CheckType.isObject(item)) {
                return "<span class=\"".concat(item.class, "\" style=\"").concat(item.style, "\">").concat(item.value, "</span>");
            }
            else {
                return "<span>".concat(item, "</span>");
            }
        });
        return "<div class=\"list-log\">".concat(list.join(""), "</div>");
    };
    ListLog.prototype.onMount = function () {
        var spanList = this.rowEl.children[0].children;
        var maxWidth = 0;
        for (var idx = 0; idx < spanList.length; idx++) {
            var span = spanList.item(idx);
            var width = span.getBoundingClientRect().width;
            console.log(width);
            if (width > maxWidth)
                maxWidth = width;
        }
        if (maxWidth > 0) {
            for (var idx = 0; idx < spanList.length; idx++) {
                var span = spanList.item(idx);
                var style = span.getAttribute("style");
                span.setAttribute("style", "width: ".concat(Math.round(maxWidth), "px;") + style);
            }
        }
    };
    return ListLog;
}(widgetInter));
/* harmony default export */ const listLog = (ListLog);

;// CONCATENATED MODULE: ./src/index.ts







var WidgetType;
(function (WidgetType) {
    WidgetType[WidgetType["userInput"] = 0] = "userInput";
    WidgetType[WidgetType["weblog"] = 1] = "weblog";
    WidgetType[WidgetType["table"] = 2] = "table";
    WidgetType[WidgetType["list"] = 3] = "list";
})(WidgetType || (WidgetType = {}));
var InnerType;
(function (InnerType) {
    InnerType[InnerType["text"] = 0] = "text";
    InnerType[InnerType["html"] = 1] = "html";
})(InnerType || (InnerType = {}));

window.webterminal = __webpack_exports__;
/******/ })()
;
