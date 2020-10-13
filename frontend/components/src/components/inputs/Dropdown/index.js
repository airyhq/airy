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
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
var AccessibleSVG_1 = require("../../labels/AccessibleSVG");
var chevron_down_svg_1 = __importDefault(require("assets/images/icons/chevron-down.svg"));
exports.Dropdown = function (_a) {
    var text = _a.text, options = _a.options, variant = _a.variant, onClick = _a.onClick;
    var _b = react_1.useState(false), dropdownVisible = _b[0], setDropdownVisible = _b[1];
    var componentEl = react_1.useRef(null);
    var buttonEl = react_1.useRef(null);
    var styleFor = function (variant) {
        switch (variant) {
            case 'borderless':
                return style_module_scss_1["default"].borderlessButton;
            default:
                return style_module_scss_1["default"].button;
        }
    };
    var showDropdown = react_1.useCallback(function (dropdownVisible) {
        setDropdownVisible(dropdownVisible);
    }, [dropdownVisible, setDropdownVisible, buttonEl]);
    var itemSelected = react_1.useCallback(function (option) {
        showDropdown(false);
        onClick(option);
    }, [onClick, showDropdown]);
    var keyDownHandler = react_1.useCallback(function (e) {
        if (e.key === 'Escape') {
            showDropdown(false);
        }
    }, [showDropdown]);
    var eventHandler = react_1.useCallback(function (e) {
        if (componentEl.current && !componentEl.current.contains(e.target)) {
            showDropdown(false);
        }
    }, [showDropdown]);
    react_1.useEffect(function () {
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('click', eventHandler, true);
        document.addEventListener('focus', eventHandler, true);
        return function () {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('click', eventHandler);
            document.removeEventListener('focus', eventHandler);
        };
    }, [document, eventHandler, keyDownHandler]);
    return (react_1["default"].createElement("div", { className: style_module_scss_1["default"].component, ref: componentEl },
        react_1["default"].createElement("button", { ref: buttonEl, className: styleFor(variant), type: "button", onClick: function () { return showDropdown(!dropdownVisible); } },
            react_1["default"].createElement("div", null, text),
            react_1["default"].createElement(AccessibleSVG_1.AccessibleSVG, { src: chevron_down_svg_1["default"], className: style_module_scss_1["default"].chevron + " " + (dropdownVisible ? style_module_scss_1["default"].chevronRotated : '') })),
        dropdownVisible && (react_1["default"].createElement("div", { className: style_module_scss_1["default"].dropDown }, options.map(function (option) { return (react_1["default"].createElement("button", { type: "button", key: option, className: style_module_scss_1["default"].item, onClick: function () { return itemSelected(option); } }, option)); })))));
};
//# sourceMappingURL=index.js.map