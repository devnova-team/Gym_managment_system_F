import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../Service/baseApi';

export const makeStore = () => configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});
