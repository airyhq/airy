"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_svg_1 = require("react-svg");
var exclamation_triangle_svg_1 = __importDefault(
  require("../../../assets/images/icons/exclamation-triangle.svg")
);
var close_svg_1 = __importDefault(
  require("../../../assets/images/icons/close.svg")
);
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
exports.ErrorPopUp = function(props) {
  var message = props.message,
    closeHandler = props.closeHandler;
  return react_1["default"].createElement(
    "div",
    { className: style_module_scss_1["default"].main },
    react_1["default"].createElement(
      "div",
      { className: style_module_scss_1["default"].errorContainer },
      react_1["default"].createElement(react_svg_1.ReactSVG, {
        src: exclamation_triangle_svg_1["default"]
      }),
      react_1["default"].createElement("p", null, message),
      react_1["default"].createElement(
        "button",
        {
          onClick: function() {
            return closeHandler();
          }
        },
        react_1["default"].createElement(react_svg_1.ReactSVG, {
          src: close_svg_1["default"]
        })
      )
    )
  );
};
//# sourceMappingURL=index.js.map
