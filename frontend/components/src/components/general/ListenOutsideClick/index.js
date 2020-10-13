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
exports.__esModule = true;
var react_1 = __importStar(require("react"));
var ListenOutsideClick = function(_a) {
  var children = _a.children,
    className = _a.className,
    onOuterClick = _a.onOuterClick;
  var innerRef = react_1.useRef(null);
  react_1.useEffect(
    function() {
      var handleClick = function(event) {
        innerRef.current &&
          !innerRef.current.contains(event.target) &&
          onOuterClick(event);
      };
      // only add listener, if the element exists
      if (innerRef.current) {
        document.addEventListener("click", handleClick);
      }
      // unmount previous first in case inputs have changed
      return function() {
        return document.removeEventListener("click", handleClick);
      };
    },
    [onOuterClick, innerRef]
  );
  return react_1["default"].createElement(
    "div",
    { className: className, ref: innerRef },
    children
  );
};
exports["default"] = ListenOutsideClick;
//# sourceMappingURL=index.js.map
