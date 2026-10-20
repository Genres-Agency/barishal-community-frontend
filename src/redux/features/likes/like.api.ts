import { baseApi } from "../../api/baseApi";

const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Single post
    getSingleLike: builder.query({
      query: (postId: number) => ({
        url: `/likes/${postId}`,
        method: "GET",
      }),
      providesTags: ["Like"],
    }),

    // Toggle like on post
    toggleLike: builder.mutation({
      query: ({ postId }: { postId: number }) => ({
        url: `/likes/${postId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Like"],
    }),
  }),
});

export const { useGetSingleLikeQuery, useToggleLikeMutation } = likeApi;
