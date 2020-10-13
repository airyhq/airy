"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
//@ts-nocheck
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var components_1 = require("components");
require("components/dist/index.css");
var index_module_scss_1 = __importDefault(require("./index.module.scss"));
var App = function() {
  return react_1["default"].createElement(
    react_1["default"].Fragment,
    null,
    react_1["default"].createElement(
      "h1",
      { className: index_module_scss_1["default"].title },
      "Airy Components Library Showcase"
    ),
    react_1["default"].createElement(
      "div",
      { className: index_module_scss_1["default"].main },
      react_1["default"].createElement(
        "h2",
        { className: index_module_scss_1["default"].sectionTitle },
        "Alerts"
      ),
      react_1["default"].createElement(
        "div",
        { className: index_module_scss_1["default"].section },
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Error message"),
          react_1["default"].createElement(components_1.ErrorMessage, {
            text: "This in an error message"
          })
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Error notice warning"),
          react_1["default"].createElement(
            components_1.ErrorNotice,
            { theme: "warning" },
            react_1["default"].createElement(
              "p",
              null,
              "This in an warning message"
            )
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Error notice error"),
          react_1["default"].createElement(
            components_1.ErrorNotice,
            { theme: "error" },
            react_1["default"].createElement(
              "p",
              null,
              'This in an error message"'
            )
          )
        )
      ),
      react_1["default"].createElement(
        "h2",
        { className: index_module_scss_1["default"].sectionTitle },
        "Buttons"
      ),
      react_1["default"].createElement(
        "div",
        { className: index_module_scss_1["default"].section },
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Normal"),
          react_1["default"].createElement(
            components_1.Button,
            {
              styleVariant: "normal",
              type: "submit",
              onClick: function() {
                return alert("Button Pressed");
              }
            },
            "Button"
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Small"),
          react_1["default"].createElement(
            components_1.Button,
            {
              styleVariant: "small",
              type: "submit",
              onClick: function() {
                return alert("Button Pressed");
              }
            },
            "Button"
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Outline normal"),
          react_1["default"].createElement(
            components_1.Button,
            {
              styleVariant: "outline",
              type: "submit",
              onClick: function() {
                return alert("Button Pressed");
              }
            },
            "Button"
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Outline big"),
          react_1["default"].createElement(
            components_1.Button,
            {
              styleVariant: "outline-big",
              type: "submit",
              onClick: function() {
                return alert("Button Pressed");
              }
            },
            "Button"
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Warning"),
          react_1["default"].createElement(
            components_1.Button,
            {
              styleVariant: "warning",
              type: "submit",
              onClick: function() {
                return alert("Button Pressed");
              }
            },
            "Button"
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Text"),
          react_1["default"].createElement(
            components_1.Button,
            {
              styleVariant: "text",
              type: "submit",
              onClick: function() {
                return alert("Button Pressed");
              }
            },
            "Button"
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Link"),
          react_1["default"].createElement(
            components_1.LinkButton,
            {
              onClick: function() {
                return alert("Button Pressed");
              }
            },
            "Button"
          )
        ),
        react_1["default"].createElement(
          "div",
          { className: index_module_scss_1["default"].item },
          react_1["default"].createElement("h3", null, "Href"),
          react_1["default"].createElement(
            react_router_dom_1.BrowserRouter,
            null,
            react_1["default"].createElement(
              components_1.HrefButton,
              { href: "buttonTest" },
              "Button"
            )
          )
        )
      )
    )
  );
};
exports["default"] = App;
//# sourceMappingURL=App.js.map
