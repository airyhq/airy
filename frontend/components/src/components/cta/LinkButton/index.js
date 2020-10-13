"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
exports.LinkButton = function(_a) {
  var children = _a.children,
    onClick = _a.onClick,
    type = _a.type;
  return react_1["default"].createElement(
    "button",
    {
      type: type,
      className: style_module_scss_1["default"].button,
      onClick: onClick
    },
    children
  );
};
exports.LinkButton.propTypes = {
  /** button text */
  children: prop_types_1["default"].node.isRequired,
  /** button clicked callback */
  onClick: prop_types_1["default"].func,
  /** the button type */
  type: prop_types_1["default"].string
};
//# sourceMappingURL=index.js.map
