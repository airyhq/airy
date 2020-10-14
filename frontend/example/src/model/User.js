"use strict";
exports.__esModule = true;
var AUTH_STATE;
(function(AUTH_STATE) {
  AUTH_STATE[(AUTH_STATE["NOT_AUTHENTICATED"] = 0)] = "NOT_AUTHENTICATED";
  AUTH_STATE[(AUTH_STATE["REFRESHING"] = 1)] = "REFRESHING";
  AUTH_STATE[(AUTH_STATE["AUTHENTICATED_AND_LOADED"] = 2)] =
    "AUTHENTICATED_AND_LOADED";
})((AUTH_STATE = exports.AUTH_STATE || (exports.AUTH_STATE = {})));
exports.authState = function(state) {
  if (!!state.refresh_token) {
    if (!state.id || !state.organizations) {
      return AUTH_STATE.REFRESHING;
    }
    return AUTH_STATE.AUTHENTICATED_AND_LOADED;
  }
  return AUTH_STATE.NOT_AUTHENTICATED;
};
function userInitials(user) {
  if (user.display_name) {
    return user.display_name.substring(0, 2);
  }
  var result = "";
  if (user.first_name) {
    result += user.first_name.substring(0, 1);
  }
  if (user.last_name) {
    result += user.last_name.substring(0, 1);
  }
  return result;
}
exports.userInitials = userInitials;
function displayName(user) {
  return user.display_name || user.first_name || user.last_name || "";
}
exports.displayName = displayName;
//# sourceMappingURL=User.js.map
