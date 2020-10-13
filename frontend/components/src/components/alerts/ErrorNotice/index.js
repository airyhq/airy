"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var AccessibleSVG_1 = require("../../labels/AccessibleSVG");
var exclamation_svg_1 = __importDefault(require("../../../assets/images/icons/exclamation.svg"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
var ErrorNoticeComponent = function (_a) {
    var children = _a.children, theme = _a.theme;
    return (react_1["default"].createElement("div", { className: style_module_scss_1["default"].container + " " + style_module_scss_1["default"][theme] },
        react_1["default"].createElement("div", { className: style_module_scss_1["default"].iconWrapper },
            react_1["default"].createElement(AccessibleSVG_1.AccessibleSVG, { ariaHidden: "true", src: exclamation_svg_1["default"] })),
        children));
};
exports.ErrorNotice = (ErrorNoticeComponent);
//# sourceMappingURL=index.js.map