"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
exports.Toggle = function(_a) {
  var value = _a.value,
    text = _a.text,
    updateValue = _a.updateValue;
  var onCheckboxChange = function(event) {
    updateValue(event.target.checked);
  };
  return react_1["default"].createElement(
    "label",
    null,
    react_1["default"].createElement(
      "span",
      { className: style_module_scss_1["default"]["switch"] },
      react_1["default"].createElement("input", {
        type: "checkbox",
        onChange: onCheckboxChange,
        checked: value
      }),
      react_1["default"].createElement("span", {
        className: style_module_scss_1["default"].slider
      })
    ),
    react_1["default"].createElement("span", null, text)
  );
};
//# sourceMappingURL=index.js.map
