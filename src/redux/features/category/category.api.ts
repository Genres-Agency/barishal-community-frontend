import { TQueryParam } from "@/types/global";
import { baseApi } from "../../api/baseApi";

type TCategorory = {
  title: string;
};

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllCategory: builder.query({
    //   query: (args) => {
    //     const params = new URLSearchParams();

    //     if (args) {
    //       args.forEach((item: TQueryParam) => {
    //         params.append(item.name, item.value as string);
    //       });
    //     }

    //     return {
    //       url: "/category",
    //       method: "GET",
    //       params: params,
    //     };
    //   },
    //   transformResponse: (response: TResponseRedux<TCategorory[]>) => {
    //     return {
    //       data: response.data,
    //       meta: response.meta,
    //     };
    //   },
    //   providesTags: ["Category"],
    // }),

    getAllCategory: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/category",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["Category"],
    }),

    // Create a new Category
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // Update existing category
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    // Delete a category
    deleteCategory: builder.mutation({
      query: (id: number) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
} = categoriesApi;
