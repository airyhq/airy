"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
exports.Button = function(_a) {
  var children = _a.children,
    onClick = _a.onClick,
    type = _a.type,
    styleVariant = _a.styleVariant,
    disabled = _a.disabled,
    tabIndex = _a.tabIndex;
  var styleFor = function(variant) {
    switch (variant) {
      case "small":
        return style_module_scss_1["default"].smallButton;
      case "outline":
        return style_module_scss_1["default"].outlineButton;
      case "outline-big":
        return style_module_scss_1["default"].outlineButtonBig;
      case "warning":
        return style_module_scss_1["default"].warningButton;
      case "link":
        return style_module_scss_1["default"].linkButton;
      case "text":
        return style_module_scss_1["default"].textButton;
      default:
        return style_module_scss_1["default"].button;
    }
  };
  return react_1["default"].createElement(
    "button",
    {
      type: type || "button",
      disabled: disabled || false,
      className: styleFor(styleVariant),
      onClick: onClick,
      //@ts-ignore
      tabIndex: tabIndex
    },
    children
  );
};
//# sourceMappingURL=index.js.map
