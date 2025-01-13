import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import stocksSlice from "./stocksSlice"; // Import stocksSlice (or your stock reducer)

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Configuration for redux-persist
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

// Combine all reducers into one root reducer
const rootReducer = combineReducers({
    auth: authSlice,
    stocks: stocksSlice, // Add your stocks slice here
});

// Apply redux-persist to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with persistedReducer
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore redux-persist actions
            },
        }),
});

export const persistor = persistStore(store); // Export persistor to use with PersistGate

export default store;
