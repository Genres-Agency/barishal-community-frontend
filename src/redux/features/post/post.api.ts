import { TQueryParam } from "@/types/global";
import { baseApi } from "../../api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          if (Array.isArray(args)) {
            args.forEach((item: TQueryParam) => {
              params.append(item.name, item.value as string);
            });
          } else if (typeof args === "object") {
            Object.entries(args).forEach(([k, v]) => {
              if (v !== undefined && v !== null && v !== "") {
                params.append(k, String(v));
              }
            });
          }
        }

        return {
          url: "/posts",
          method: "GET",
          params: params,
        };
      },
      //  transformResponse: (response: TResponseRedux<TPost[]>) => {
      // transformResponse: (response: any) => {
      //   return {
      //     data: response.data,
      //     meta: response.meta,
      //   };
      // },
      providesTags: ["Post"],
    }),
    // Get Single post
    getSinglePost: builder.query({
      query: (postId: number) => ({
        url: `/posts/${postId}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),
    // Create a new post
    addPost: builder.mutation({
      query: (data) => ({
        url: "/posts",
        method: "POST",
        body: data,
        // Don't manually set Content-Type when using FormData
        // The browser will set it with the correct boundary
        formData: true,
        // Include credentials if your API requires authentication
        credentials: "include",
      }),
      invalidatesTags: ["Post"],
    }),

    // Update exesting post
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        params: id,
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),
    // Delete a post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        params: id,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { useGetAllPostQuery, useGetSinglePostQuery, useAddPostMutation } =
  postApi;
