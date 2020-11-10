import _, { configureStore, getDefaultMiddleware } from "redux-starter-kit";

import rootReducer from "./reducers";

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false
    })
  ]
});

declare const module: any;

if (module.hot) {
  module.hot.accept("./reducers", () => {
    const newRootReducer = require("./reducers").default;
    store.replaceReducer(newRootReducer);
  });
}
