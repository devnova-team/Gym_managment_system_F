import { baseApi } from '../baseApi';

export const equipmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /api/equipment - List gym equipment and maintenance schedules
        getEquipment: builder.query({
            query: () => ({
                url: '/equipment',
                method: 'GET',
            }),
            providesTags: ['Equipment'],
        }),
        // POST /api/equipment - Add new machine/equipment
        createEquipment: builder.mutation({
            query: (equipmentData) => ({
                url: '/equipment',
                method: 'POST',
                body: equipmentData,
            }),
            invalidatesTags: ['Equipment'],
        }),
        // PUT /api/equipment/{id} - Update equipment or service records
        updateEquipment: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/equipment/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Equipment'],
        }),
    }),
});

export const {
    useGetEquipmentQuery,
    useCreateEquipmentMutation,
    useUpdateEquipmentMutation,
} = equipmentApi;
