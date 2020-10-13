"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_svg_1 = require("react-svg");
var exclamation_triangle_svg_1 = __importDefault(require("../../../assets/images/icons/exclamation-triangle.svg"));
var fogg_waiting_png_1 = __importDefault(require("../../../assets/images/pictures/fogg-waiting.png"));
var airy_primary_rgb_svg_1 = __importDefault(require("../../../assets/images/logo/airy_primary_rgb.svg"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
var react_i18next_1 = require("react-i18next");
var ErrorMessageComponent = function (_a) {
    var t = _a.t, text = _a.text;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: style_module_scss_1["default"].headerError },
            react_1["default"].createElement("img", { src: airy_primary_rgb_svg_1["default"], alt: "Airy Logo", width: 128 }),
            react_1["default"].createElement("div", { className: style_module_scss_1["default"].errorContainer },
                react_1["default"].createElement(react_svg_1.ReactSVG, { src: exclamation_triangle_svg_1["default"] }),
                react_1["default"].createElement("p", null, text || t('alerts.linkExpired')))),
        react_1["default"].createElement("img", { src: fogg_waiting_png_1["default"], className: style_module_scss_1["default"].errorImage, alt: "Airy Waiting" })));
};
exports.ErrorMessage = react_i18next_1.withTranslation()(ErrorMessageComponent);
//# sourceMappingURL=index.js.map