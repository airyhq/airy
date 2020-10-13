"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
exports.HrefButton = function (_a) {
    var children = _a.children, href = _a.href;
    return (react_1["default"].createElement(react_router_dom_1.Link, { to: href },
        react_1["default"].createElement("div", { className: style_module_scss_1["default"].button },
            react_1["default"].createElement("span", { className: style_module_scss_1["default"].buttonLabel }, children))));
};
//# sourceMappingURL=index.js.map