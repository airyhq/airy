"use strict";
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
require("react-dates/initialize");
var react_dates_1 = require("react-dates");
var moment_1 = __importDefault(require("moment"));
require("react-dates/lib/css/_datepicker.css");
// Sadly this needs to be imported without changing the classnames. That is
// the only way to override the default look of this component.
require("./react-date-override.scss");
exports.DateRange = function(_a) {
  var startDate = _a.startDate,
    endDate = _a.endDate,
    onDatesChange = _a.onDatesChange,
    minDate = _a.minDate,
    maxDate = _a.maxDate,
    variant = _a.variant,
    anchorDirection = _a.anchorDirection,
    openDirection = _a.openDirection;
  var _b = react_1.useState(null),
    focusedInput = _b[0],
    setFocusedInput = _b[1];
  return react_1["default"].createElement(
    "div",
    { className: "DateRangeWrapper--" + variant },
    react_1["default"].createElement(react_dates_1.DateRangePicker, {
      startDate: startDate,
      startDateId: "your_unique_start_date_id",
      endDate: endDate,
      endDateId: "your_unique_end_date_id",
      onDatesChange: onDatesChange,
      focusedInput: focusedInput,
      onFocusChange: function(focusedInput) {
        return setFocusedInput(focusedInput);
      },
      isOutsideRange: function(day) {
        return !moment_1["default"](day).isBetween(
          minDate,
          maxDate,
          null,
          "[]"
        );
      },
      minDate: minDate,
      maxDate: maxDate,
      minimumNights: 0,
      anchorDirection: anchorDirection,
      openDirection: openDirection
    })
  );
};
exports.DateRange.defaultProps = {
  variant: "default"
};
//# sourceMappingURL=index.js.map
