import _, {configureStore, getDefaultMiddleware} from 'redux-starter-kit';

import rootReducer from 'httpclient/payload';

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});

declare const module: any;

if (module.hot) {
  module.hot.accept('httpclient/payload', () => {
    const newRootReducer = require('httpclient/payload').default;
    store.replaceReducer(newRootReducer);
  });
}
