"use strict";
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var react_i18next_1 = require("react-i18next");
var emoji_mart_1 = require("emoji-mart");
var AccessibleSVG_1 = require("../../labels/AccessibleSVG");
var style_module_scss_1 = __importDefault(require("./style.module.scss"));
var checkmark_svg_1 = __importDefault(
  require("assets/images/icons/checkmark.svg")
);
var close_svg_1 = __importDefault(require("assets/images/icons/close.svg"));
var smiley_svg_1 = __importDefault(require("assets/images/icons/smiley.svg"));
var InputComponent = /** @class */ (function(_super) {
  __extends(InputComponent, _super);
  function InputComponent(props) {
    var _this = _super.call(this, props) || this;
    _this.componentDidMount = function() {
      var _a = _this.props,
        inputRef = _a.inputRef,
        value = _a.value;
      if (!!value) {
        _this.validateInput((inputRef || _this.inputRef).current);
      }
    };
    _this.componentDidUpdate = function(prevProps) {
      var inputRef = _this.props.inputRef || _this.inputRef;
      if (
        (inputRef.current && !prevProps.showErrors && _this.props.showErrors) ||
        _this.props.value !== prevProps.value
      ) {
        _this.validateInput(inputRef.current);
      }
    };
    _this.translateResult = function(type, validity) {
      if (validity.valueMissing) {
        return _this.props.t("input.valueMissing");
      } else if (type === "url" && validity.typeMismatch) {
        return _this.props.t("input.urlWrongFormat");
      } else {
        return validity.valid;
      }
    };
    _this.checkWithHTML5Validation = function(inputElement) {
      if (inputElement === null || !_this.hasValidations()) {
        return;
      }
      inputElement.checkValidity();
      _this.setState({ validationResult: inputElement.validity.valid });
      if (inputElement.type === "email") {
        if (!inputElement.validity.valid) {
          _this.setState({
            validationResult: _this.props.t("input.wrongEmail")
          });
        } else {
          _this.setState({ validationResult: true });
        }
      } else {
        _this.setState({
          validationResult: _this.translateResult(
            inputElement.type,
            inputElement.validity
          )
        });
      }
    };
    _this.hasValidations = function() {
      return (
        _this.props.required ||
        _this.props.minLength ||
        _this.props.maxLength ||
        _this.props.validation
      );
    };
    _this.checkWithValidationFunction = function(inputElement) {
      var validation = _this.props.validation;
      var validationResult = validation(inputElement.value);
      _this.setState({ validationResult: validationResult });
      if (validationResult === true) {
        inputElement.setCustomValidity("");
      } else {
        inputElement.setCustomValidity(validationResult);
      }
    };
    _this.checkWithURLValidation = function(inputElement) {
      _this.checkWithHTML5Validation(inputElement);
      /**
       * In #1106 Thomas described that he also wants to prevent
       * People to enter urls like http://example , which in itself
       * is a valid url based on the specs, but we want to make sure
       * the users also enter at least a domain + tld, so we check here
       * if there is a dot inside of the field just to be save.
       */
      if (!inputElement.value.match(/.*\w\.\w.*/)) {
        _this.setState({
          validationResult: _this.props.t("input.urlWrongFormat")
        });
        inputElement.setCustomValidity(_this.props.t("input.urlWrongFormat"));
      } else {
        inputElement.setCustomValidity("");
      }
    };
    _this.validateInput = function(inputElement) {
      var _a = _this.props,
        validation = _a.validation,
        type = _a.type;
      if (validation) {
        _this.checkWithValidationFunction(inputElement);
      } else if (type === "url") {
        _this.checkWithURLValidation(inputElement);
      } else {
        _this.checkWithHTML5Validation(inputElement);
      }
    };
    _this.onChange = function(event) {
      var onChange = _this.props.onChange;
      _this.validateInput(event.target);
      if (onChange) {
        onChange(event);
      }
    };
    _this.onBlur = function(event) {
      var onBlur = _this.props.onBlur;
      _this.setState({ wasBlurred: true });
      _this.validateInput(event.target);
      if (onBlur) {
        onBlur(event);
      }
    };
    _this.getCurrentValidationState = function() {
      if (_this.state.validationResult === true) {
        return "inputValid";
      } else if (_this.state.validationResult === undefined) {
        return null;
      }
      if (!_this.state.wasBlurred && !_this.props.showErrors) {
        return null;
      }
      return "inputInvalid";
    };
    _this.classForState = function() {
      switch (_this.getCurrentValidationState()) {
        case "inputInvalid":
          return style_module_scss_1["default"].inputInvalid;
        case "inputValid":
          return style_module_scss_1["default"].inputValid;
        default:
          return "";
      }
    };
    _this.iconForState = function() {
      if (_this.state.validationResult === true) {
        return react_1["default"].createElement(
          "div",
          { className: style_module_scss_1["default"].icon },
          react_1["default"].createElement(AccessibleSVG_1.AccessibleSVG, {
            ariaHidden: "true",
            src: checkmark_svg_1["default"]
          })
        );
      } else if (_this.state.validationResult === undefined) {
        return null;
      }
      if (!_this.state.wasBlurred && !_this.props.showErrors) {
        return null;
      }
      return react_1["default"].createElement(
        "div",
        { className: style_module_scss_1["default"].icon },
        react_1["default"].createElement(AccessibleSVG_1.AccessibleSVG, {
          ariaHidden: "true",
          src: close_svg_1["default"]
        })
      );
    };
    _this.addListeners = function() {
      document.addEventListener("keydown", _this.handleEmojiKeyEvent);
      document.addEventListener("click", _this.handleEmojiOutsideClick);
    };
    _this.removeListeners = function() {
      document.removeEventListener("keydown", _this.handleEmojiKeyEvent);
      document.removeEventListener("click", _this.handleEmojiOutsideClick);
    };
    _this.handleEmojiDrawer = function() {
      if (!_this.state.isShowingEmojiDrawer) {
        _this.addListeners();
      } else {
        _this.removeListeners();
        _this.inputRef.current && _this.inputRef.current.focus();
      }
      _this.setState(function(prevState) {
        return {
          isShowingEmojiDrawer: !prevState.isShowingEmojiDrawer
        };
      });
    };
    _this.handleEmojiKeyEvent = function(e) {
      if (e.key === "Escape") {
        _this.handleEmojiDrawer();
      }
    };
    _this.handleEmojiOutsideClick = function(e) {
      if (_this.node && _this.node.contains(e.target)) {
        return;
      }
      _this.handleEmojiDrawer();
    };
    _this.addEmoji = function(emoji) {
      var message = emoji.native;
      var inputRef = _this.props.inputRef || _this.inputRef;
      if (_this.props.value) {
        message = _this.props.value + " " + message;
      }
      inputRef.current.value = message;
      _this.onChange({
        persist: function() {},
        target: inputRef.current
      });
      _this.handleEmojiDrawer();
    };
    _this.emojiDrawer = react_1["default"].createElement(
      "div",
      {
        ref: function(node) {
          _this.node = node;
        },
        className: style_module_scss_1["default"].emojiDrawer
      },
      react_1["default"].createElement(emoji_mart_1.Picker, {
        showPreview: false,
        onSelect: _this.addEmoji,
        title: "Emoji",
        style: { right: "50px", position: "absolute", bottom: "48px" }
      })
    );
    _this.state = {
      validationResult: undefined,
      wasBlurred: false,
      isShowingEmojiDrawer: false
    };
    _this.inputRef = react_1["default"].createRef();
    return _this;
  }
  InputComponent.prototype.render = function() {
    var _a = this.props,
      id = _a.id,
      label = _a.label,
      hideLabel = _a.hideLabel,
      name = _a.name,
      value = _a.value,
      checked = _a.checked,
      placeholder = _a.placeholder,
      hint = _a.hint,
      height = _a.height,
      type = _a.type,
      inputRef = _a.inputRef,
      inputmode = _a.inputmode,
      minLength = _a.minLength,
      maxLength = _a.maxLength,
      showErrors = _a.showErrors,
      children = _a.children,
      fontClass = _a.fontClass,
      inputComponent = _a.inputComponent,
      autoFocus = _a.autoFocus,
      required = _a.required,
      autoComplete = _a.autoComplete,
      disabled = _a.disabled,
      onKeyDown = _a.onKeyDown,
      pattern = _a.pattern,
      t = _a.t,
      showCounter = _a.showCounter,
      onFocus = _a.onFocus;
    var _b = this.state,
      validationResult = _b.validationResult,
      wasBlurred = _b.wasBlurred;
    var labelClass =
      this.classForState() + " " + style_module_scss_1["default"].label;
    var inputClass =
      style_module_scss_1["default"][fontClass] +
      " " +
      style_module_scss_1["default"].inputInner +
      " ";
    return react_1["default"].createElement(
      "label",
      { className: labelClass },
      react_1["default"].createElement(
        "div",
        { className: style_module_scss_1["default"].inputTitleRow },
        !hideLabel &&
          react_1["default"].createElement(
            "div",
            { className: style_module_scss_1["default"].inputTitle },
            children
              ? children(this.iconForState())
              : react_1["default"].createElement(
                  react_1.Fragment,
                  null,
                  label,
                  " ",
                  this.iconForState()
                )
          ),
        this.props.maxLength > 0 && this.props.showCounter
          ? react_1["default"].createElement(
              "div",
              { className: style_module_scss_1["default"].inputMaxLength },
              react_1["default"].createElement(
                "span",
                {
                  className:
                    value.length > this.props.maxLength
                      ? style_module_scss_1["default"].inputMaxLengthError
                      : ""
                },
                Math.max(0, this.props.maxLength - value.length)
              )
            )
          : ""
      ),
      inputComponent
        ? inputComponent({
            id: id,
            inputRef: inputRef || this.inputRef,
            placeholder: placeholder,
            onChange: this.onChange,
            onBlur: this.onBlur,
            onKeyDown: onKeyDown,
            type: type,
            value: value,
            checked: checked,
            autoFocus: autoFocus,
            name: name,
            minLength: minLength,
            maxLength: maxLength,
            required: required,
            fontClass: fontClass,
            pattern: pattern,
            currentValidationState: this.getCurrentValidationState(),
            showCounter: showCounter
          })
        : react_1["default"].createElement(
            "div",
            { className: style_module_scss_1["default"].input },
            react_1["default"].createElement("input", {
              id: id,
              ref: inputRef || this.inputRef,
              className: inputClass,
              checked: checked,
              placeholder: placeholder,
              onChange: this.onChange,
              onKeyDown: onKeyDown,
              onFocus: onFocus,
              onBlur: this.onBlur,
              style: {
                height: height + "px"
              },
              type: type,
              value: value,
              autoFocus: autoFocus,
              name: name,
              minLength: minLength,
              maxLength: maxLength,
              required: required,
              autoComplete: autoComplete,
              disabled: disabled,
              pattern: pattern,
              inputMode: inputmode
            }),
            this.state.isShowingEmojiDrawer && this.emojiDrawer,
            this.props.emoji
              ? react_1["default"].createElement(
                  "button",
                  {
                    type: "button",
                    onClick: this.handleEmojiDrawer,
                    disabled: this.props.maxLength - value.length <= 0,
                    className:
                      style_module_scss_1["default"].emojiIcon +
                      " " +
                      (this.state.isShowingEmojiDrawer &&
                        style_module_scss_1["default"].emojiIconActive)
                  },
                  react_1[
                    "default"
                  ].createElement(AccessibleSVG_1.AccessibleSVG, {
                    title: t("input.emoji"),
                    src: smiley_svg_1["default"]
                  })
                )
              : null
          ),
      react_1["default"].createElement(
        "div",
        { className: style_module_scss_1["default"].inputHint },
        typeof validationResult === "string" && (wasBlurred || showErrors)
          ? validationResult
          : hint
      )
    );
  };
  InputComponent.defaultProps = {
    height: 48,
    fontClass: "font-l",
    label: "",
    autoFocus: false,
    hideLabel: false,
    showCounter: true
  };
  return InputComponent;
})(react_1.Component);
exports.Input = react_i18next_1.withTranslation()(InputComponent);
//# sourceMappingURL=index.js.map
