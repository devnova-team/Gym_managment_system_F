import { baseApi } from '../baseApi';

export const storeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/store/products - List products with stock quantity and unit price
        getStoreProducts: builder.query({
            query: () => ({
                url: '/store/products',
                method: 'GET',
            }),
            providesTags: ['Store'],
        }),
        // POST /api/store/products - Add product to inventory
        createStoreProduct: builder.mutation({
            query: (productData) => ({
                url: '/store/products',
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['Store'],
        }),
        // POST /api/store/sales - Quick sale with automatic stock decrement
        createStoreSale: builder.mutation({
            query: (saleData) => ({
                url: '/store/sales',
                method: 'POST',
                body: saleData,
            }),
            invalidatesTags: ['Store', 'Reports', 'Dashboard'],
        }),
    }),
});

export const {
    useGetStoreProductsQuery,
    useCreateStoreProductMutation,
    useCreateStoreSaleMutation,
} = storeApi;
