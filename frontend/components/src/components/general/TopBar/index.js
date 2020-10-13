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
// @ts-nocheck
var react_1 = __importStar(require("react"));
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var react_svg_1 = require("react-svg");
var ListenOutsideClick_1 = __importDefault(require("../ListenOutsideClick"));
var index_module_scss_1 = __importDefault(require("./index.module.scss"));
var cog_svg_1 = __importDefault(require("../../../assets/images/icons/cog.svg"));
var sign_out_svg_1 = __importDefault(require("../../../assets/images/icons/sign-out.svg"));
var shortcut_svg_1 = __importDefault(require("../../../assets/images/icons/shortcut.svg"));
var speak_bubble_svg_1 = __importDefault(require("../../../assets/images/icons/speak-bubble.svg"));
var airy_primary_rgb_svg_1 = __importDefault(require("../../../assets/images/logo/airy_primary_rgb.svg"));
var chevron_down_svg_1 = __importDefault(require("../../../assets/images/icons/chevron-down.svg"));
var LOGOUT_ROUTE = '/logout';
var TopBarComponent = function (props) {
    var _a = react_1.useState(false), isAccountDropdownOn = _a[0], setAccountDropdownOn = _a[1];
    var _b = react_1.useState(false), isFaqDropdownOn = _b[0], setFaqDropdownOn = _b[1];
    var accountClickHandler = react_1.useCallback(function () {
        setAccountDropdownOn(!isAccountDropdownOn);
    }, [setAccountDropdownOn, isAccountDropdownOn]);
    var hideAccountDropdown = react_1.useCallback(function () {
        setAccountDropdownOn(false);
    }, [setAccountDropdownOn]);
    var faqClickHandler = react_1.useCallback(function () {
        setFaqDropdownOn(!isFaqDropdownOn);
    }, [setFaqDropdownOn, isFaqDropdownOn]);
    var hideFaqDropdown = react_1.useCallback(function () {
        setFaqDropdownOn(false);
    }, [setFaqDropdownOn]);
    var redirectURL = props.isAdmin ? 'https://app.airy.co' : 'https://admin.airy.co';
    var redirectText = props.isAdmin ? 'Go to Inbox' : 'Go to Admin';
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: index_module_scss_1["default"].topBar }, props.isAuthSuccess && (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].airyLogo },
                react_1["default"].createElement(react_svg_1.ReactSVG, { src: airy_primary_rgb_svg_1["default"], className: index_module_scss_1["default"].airyLogoSvg })),
            react_1["default"].createElement("div", { className: index_module_scss_1["default"].menuArea },
                react_1["default"].createElement("div", { className: index_module_scss_1["default"].menuItem },
                    react_1["default"].createElement(ListenOutsideClick_1["default"], { onOuterClick: hideFaqDropdown },
                        react_1["default"].createElement("div", { className: index_module_scss_1["default"].help, onClick: faqClickHandler }, "?")),
                    isFaqDropdownOn && (react_1["default"].createElement("div", { className: index_module_scss_1["default"].dropdown },
                        react_1["default"].createElement("a", { href: "mailto:support@airy.co", className: index_module_scss_1["default"].dropdownLine },
                            react_1["default"].createElement(react_svg_1.ReactSVG, { src: shortcut_svg_1["default"], className: index_module_scss_1["default"].dropdownIcon, wrapper: "span" }),
                            react_1["default"].createElement("span", null, "Contact us")),
                        react_1["default"].createElement("a", { href: "https://airy.co/faq", target: "_blank", className: index_module_scss_1["default"].dropdownLine },
                            react_1["default"].createElement(react_svg_1.ReactSVG, { src: shortcut_svg_1["default"], className: index_module_scss_1["default"].dropdownIcon, wrapper: "span" }),
                            react_1["default"].createElement("span", null, "FAQ"))))),
                react_1["default"].createElement("div", { className: index_module_scss_1["default"].menuItem },
                    react_1["default"].createElement(ListenOutsideClick_1["default"], { onOuterClick: hideAccountDropdown },
                        react_1["default"].createElement("div", { className: index_module_scss_1["default"].dropDown, onClick: accountClickHandler },
                            react_1["default"].createElement("div", { className: index_module_scss_1["default"].accountDetails },
                                react_1["default"].createElement("div", { className: index_module_scss_1["default"].accountName }, props.first_name + ' ' + props.last_name),
                                react_1["default"].createElement("div", { className: index_module_scss_1["default"].accountHint }, props.organization_name)),
                            react_1["default"].createElement("div", { className: index_module_scss_1["default"].dropHint + " " + (isAccountDropdownOn ? index_module_scss_1["default"].dropHintOpen : '') },
                                react_1["default"].createElement(react_svg_1.ReactSVG, { src: chevron_down_svg_1["default"], className: index_module_scss_1["default"].chevronDown, wrapper: "span" })))),
                    isAccountDropdownOn && (react_1["default"].createElement("div", { className: index_module_scss_1["default"].dropdown },
                        props.isAdmin ? (react_1["default"].createElement("a", { href: "https://app.airy.co", target: "_blank", className: index_module_scss_1["default"].dropdownLine },
                            react_1["default"].createElement(react_svg_1.ReactSVG, { src: speak_bubble_svg_1["default"], className: index_module_scss_1["default"].dropdownIcon, wrapper: "span" }),
                            react_1["default"].createElement("span", null, "Go to Inbox"))) : (react_1["default"].createElement("a", { href: "https://admin.airy.co", target: "_blank", className: index_module_scss_1["default"].dropdownLine },
                            react_1["default"].createElement(react_svg_1.ReactSVG, { src: cog_svg_1["default"], className: index_module_scss_1["default"].dropdownIcon, wrapper: "span" }),
                            react_1["default"].createElement("span", null, "Go to Admin"))),
                        react_1["default"].createElement(react_router_dom_1.Link, { to: LOGOUT_ROUTE, className: index_module_scss_1["default"].dropdownLine },
                            react_1["default"].createElement(react_svg_1.ReactSVG, { src: sign_out_svg_1["default"], className: index_module_scss_1["default"].dropdownIcon, wrapper: "span" }),
                            react_1["default"].createElement("span", null, "Logout")),
                        react_1["default"].createElement("div", { className: index_module_scss_1["default"].dropdownLastLine },
                            react_1["default"].createElement("a", { className: index_module_scss_1["default"].dropdownLastLink, href: "https://airy.co/terms-of-service" }, "T&Cs"),
                            react_1["default"].createElement("a", { className: index_module_scss_1["default"].dropdownLastLink, href: "https://airy.co/privacy-policy" }, "Privacy Policy")))))))))));
};
function getOrganizationName(user) {
    return (user.organizations && user.organizations.length && user.organizations[0].name) || '';
}
exports.getOrganizationName = getOrganizationName;
var mapStateToProps = function (state) {
    return {
        user: state.data.user,
        first_name: state.data.user.first_name,
        last_name: state.data.user.last_name,
        organization_name: getOrganizationName(state.data.user),
        isAuthSuccess: state.data.user.refresh_token
    };
};
exports.TopBar = react_router_dom_1.withRouter(react_redux_1.connect(mapStateToProps)(TopBarComponent));
//# sourceMappingURL=index.js.map