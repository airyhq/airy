"use strict";
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
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
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var Input_1 = require("../Input");
exports.UrlInputField = function(_a) {
  var onKeyDown = _a.onKeyDown,
    onChange = _a.onChange,
    props = __rest(_a, ["onKeyDown", "onChange"]);
  var inputRef = react_1.useRef(null);
  var _b = react_1.useState(props.value),
    value = _b[0],
    setValue = _b[1];
  var updateUrl = function(event) {
    var element = event.target;
    if (element.value.length > 0 && !element.value.match(/http(s)?:\/\//)) {
      element.value = "http://" + element.value;
      if (onChange) {
        onChange(event);
      }
      setValue(element.value);
    }
  };
  var keyDown = function(event) {
    if (event.key === "Enter") {
      updateUrl(event);
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };
  return react_1["default"].createElement(
    Input_1.Input,
    __assign(
      {
        inputRef: inputRef,
        type: "url",
        onKeyDown: keyDown,
        onChange: onChange,
        onBlur: updateUrl,
        value: value
      },
      props
    )
  );
};
//# sourceMappingURL=index.js.map
