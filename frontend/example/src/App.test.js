"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var App_1 = __importDefault(require("./App"));
it("renders without crashing", function() {
  var div = document.createElement("div");
  react_dom_1["default"].render(
    react_1["default"].createElement(App_1["default"], null),
    div
  );
  react_dom_1["default"].unmountComponentAtNode(div);
});
//# sourceMappingURL=App.test.js.map
