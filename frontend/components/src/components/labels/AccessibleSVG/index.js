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
var react_svg_1 = require("react-svg");
exports.AccessibleSVG = react_1.memo(function(_a) {
  var src = _a.src,
    title = _a.title,
    description = _a.description,
    ariaHidden = _a.ariaHidden,
    wrapper = _a.wrapper,
    className = _a.className;
  var updateOrCreateNode = react_1.useCallback(function(
    svg,
    nodeName,
    content
  ) {
    var node = svg.getElementsByTagName(nodeName)[0];
    if (node) {
      if (!content) {
        node.remove();
      } else {
        node.innerHTML = content;
      }
    } else if (content) {
      node = document.createElement(nodeName);
      node.appendChild(document.createTextNode(content));
      svg.insertBefore(node, svg.firstChild);
    }
  },
  []);
  return react_1["default"].createElement(react_svg_1.ReactSVG, {
    src: src,
    wrapper: wrapper,
    className: className,
    beforeInjection: function(svg) {
      svg.setAttribute("role", "img");
      if (ariaHidden && typeof ariaHidden == "string") {
        svg.setAttribute("aria-hidden", ariaHidden);
      }
      updateOrCreateNode(svg, "desc", description);
      updateOrCreateNode(svg, "title", title);
    }
  });
});
//# sourceMappingURL=index.js.map
