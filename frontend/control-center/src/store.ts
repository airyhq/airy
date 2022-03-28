import {configureStore, getDefaultMiddleware, EnhancedStore} from '@reduxjs/toolkit';

import rootReducer from './reducers';

export const store: EnhancedStore = configureStore({
  reducer: rootReducer,
  middleware: [
    // This adds redux-thunk and development checks
    // https://redux-toolkit.js.org/api/getDefaultMiddleware
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});

declare const module: any;

if (module.hot) {
  module.hot.accept('./reducers', async () => {
    const newRootReducer = (await import('./reducers')).default;
    store.replaceReducer(newRootReducer);
  });
}
