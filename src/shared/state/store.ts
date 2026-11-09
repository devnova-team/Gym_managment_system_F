import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api/baseApi';

export const makeStore = () => configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});
