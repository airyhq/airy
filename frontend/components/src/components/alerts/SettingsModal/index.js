"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_modal_1 = __importDefault(require("react-modal"));
var ModalHeader_1 = __importDefault(require("./ModalHeader"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
var SettingsModal = function (_a) {
    var close = _a.close, title = _a.title, children = _a.children, style = _a.style;
    return (react_1["default"].createElement(react_modal_1["default"], { className: style_module_scss_1["default"].content, ariaHideApp: false, overlayClassName: style_module_scss_1["default"].overlay, contentLabel: title, isOpen: true, shouldCloseOnOverlayClick: true, onRequestClose: close },
        react_1["default"].createElement("div", { style: style },
            react_1["default"].createElement(ModalHeader_1["default"], { title: title, close: close }),
            react_1["default"].createElement("div", { className: style_module_scss_1["default"].container }, children))));
};
exports["default"] = SettingsModal;
//# sourceMappingURL=index.js.map