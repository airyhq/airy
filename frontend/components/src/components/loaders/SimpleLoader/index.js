"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
exports.SimpleLoader = function (props) { return (react_1["default"].createElement("div", { className: "" + (props.isWhite ? style_module_scss_1["default"].loaderWhite : style_module_scss_1["default"].loader) },
    react_1["default"].createElement("div", null),
    react_1["default"].createElement("div", null),
    react_1["default"].createElement("div", null),
    react_1["default"].createElement("div", null))); };
//# sourceMappingURL=index.js.map