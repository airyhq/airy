"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var AccessibleSVG_1 = require("../../labels/AccessibleSVG");
var close_svg_1 = __importDefault(require("assets/images/icons/close.svg"));
var search_svg_1 = __importDefault(require("assets/images/icons/search.svg"));
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
exports.SearchField = function (_a) {
    var id = _a.id, placeholder = _a.placeholder, value = _a.value, setValue = _a.setValue, resetClicked = _a.resetClicked, autoFocus = _a.autoFocus;
    var inputRef = react_1.createRef();
    var resetButton = react_1.useCallback(function () {
        setValue('');
        if (resetClicked) {
            resetClicked();
        }
    }, [value, setValue]);
    return (react_1["default"].createElement("div", { className: style_module_scss_1["default"].component },
        react_1["default"].createElement(AccessibleSVG_1.AccessibleSVG, { ariaHidden: "true", src: search_svg_1["default"], className: style_module_scss_1["default"].searchIcon }),
        react_1["default"].createElement("input", { ref: inputRef, id: id, placeholder: placeholder, value: value, onChange: function (event) { return setValue(event.target.value); }, type: "search", autoFocus: autoFocus }),
        value !== '' && (react_1["default"].createElement("button", { className: style_module_scss_1["default"].resetButton, onClick: resetButton, title: "Reset Search" },
            react_1["default"].createElement(AccessibleSVG_1.AccessibleSVG, { ariaHidden: "true", src: close_svg_1["default"], className: style_module_scss_1["default"].closeIcon })))));
};
//# sourceMappingURL=index.js.map