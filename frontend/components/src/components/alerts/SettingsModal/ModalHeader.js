"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_i18next_1 = require("react-i18next");
var AccessibleSVG_1 = require("../../labels/AccessibleSVG");
var ModalHeader_module_scss_1 = __importDefault(
  require("./ModalHeader.module.scss")
);
var close_svg_1 = __importDefault(
  require("../../../assets/images/icons/close.svg")
);
var ModalHeader = function(_a) {
  var t = _a.t,
    title = _a.title,
    close = _a.close;
  return react_1["default"].createElement(
    "div",
    { className: ModalHeader_module_scss_1["default"].modalHeader },
    react_1["default"].createElement(
      "button",
      {
        className: ModalHeader_module_scss_1["default"].closeButton,
        onClick: close
      },
      react_1["default"].createElement(AccessibleSVG_1.AccessibleSVG, {
        src: close_svg_1["default"],
        className: ModalHeader_module_scss_1["default"].closeIcon,
        title: t("common.close")
      })
    ),
    react_1["default"].createElement(
      "div",
      { className: ModalHeader_module_scss_1["default"].headline },
      title
    )
  );
};
exports["default"] = react_i18next_1.withTranslation()(ModalHeader);
//# sourceMappingURL=ModalHeader.js.map
