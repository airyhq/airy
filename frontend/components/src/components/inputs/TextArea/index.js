"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_i18next_1 = require("react-i18next");
var react_autosize_textarea_1 = __importDefault(require("react-autosize-textarea"));
var Input_1 = require("../Input");
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
var TextAreaComponent = /** @class */ (function (_super) {
    __extends(TextAreaComponent, _super);
    function TextAreaComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.classForState = function (currentValidationState) {
            switch (currentValidationState) {
                case 'inputInvalid':
                    return style_module_scss_1["default"].inputInvalid;
                case 'inputValid':
                    return style_module_scss_1["default"].inputValid;
                default:
                    return '';
            }
        };
        _this.renderComponent = function (props) {
            var id = props.id, inputRef = props.inputRef, placeholder = props.placeholder, onChange = props.onChange, onBlur = props.onBlur, type = props.type, value = props.value, autoFocus = props.autoFocus, name = props.name, minLength = props.minLength, maxLength = props.maxLength, required = props.required, fontClass = props.fontClass, currentValidationState = props.currentValidationState;
            var inputClass = style_module_scss_1["default"].textarea + " " + (fontClass || 'font-l') + " " + _this.classForState(currentValidationState);
            return (react_1["default"].createElement(react_autosize_textarea_1["default"], { id: id, ref: inputRef, className: inputClass, placeholder: placeholder, onChange: onChange, onBlur: onBlur, type: type, value: value, autoFocus: autoFocus, name: name, minLength: minLength, maxLength: maxLength, required: required, rows: _this.props.minRows, maxRows: _this.props.maxRows }));
        };
        return _this;
    }
    TextAreaComponent.prototype.render = function () {
        return (react_1["default"].createElement(Input_1.Input, __assign({}, this.props, { inputComponent: this.renderComponent }), this.props.children));
    };
    return TextAreaComponent;
}(react_1.Component));
exports.TextArea = react_i18next_1.withTranslation()(TextAreaComponent);
//# sourceMappingURL=index.js.map