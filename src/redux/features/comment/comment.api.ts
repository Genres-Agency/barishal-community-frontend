import { baseApi } from "../../api/baseApi";

const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new comment
    addComment: builder.mutation({
      query: ({ postId, content }) => (
        console.log("postId", postId),
        console.log("content", content),
        {
          url: `/comments/${postId}`,
          method: "POST",
          body: { content },
        }
      ),
      invalidatesTags: ["Comment"],
    }),
    // Get Single post
    getSingleComment: builder.query({
      query: (postId: number) => ({
        url: `/comments/${postId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),

    // Update existing comment
    updateComment: builder.mutation({
      query: ({ postId, commentId, content }: { postId: number; commentId: number; content: string }) => ({
        url: `/comments/${postId}/${commentId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Comment"],
    }),

    // Delete a comment
    deleteComment: builder.mutation({
      query: ({ postId, commentId }: { postId: number; commentId: number }) => ({
        url: `/comments/${postId}/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetSingleCommentQuery,
  useUpdateCommentMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
