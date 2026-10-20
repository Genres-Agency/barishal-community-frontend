import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { logout, setUser } from "../features/auth/authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
  responseHandler: async (response) => {
    const text = await response.text();
    console.log("text", text);

    try {
      return JSON.parse(text); // Try to parse as JSON
    } catch (e) {
      return { token: text }; // Return as plain text if JSON parsing fails
    }
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = (await baseQuery(args, api, extraOptions)) as any;

  console.log("result", result);
  if (result?.error?.status === 400) {
    toast.error(result?.error?.data?.message);
  }
  if (result?.error?.status === 404) {
    toast.error(result?.error?.data?.message);
  }
  if (result?.error?.status === 403) {
    toast.error(result?.error?.data?.message);
  }
  if (result?.error?.status === 401) {
    // Skip refresh token attempt for /users/me if not logged in
    if (args.url === "/users/me") {
      return result;
    }

    // Skip refresh token attempt for /auth/refresh endpoint
    if (args.url === "/auth/refresh") {
      return result;
    }

    // Check if there's a token before attempting refresh
    const token = (api.getState() as RootState).auth.token;
    if (!token) {
      return result;
    }
    //* Send Refresh
    console.log("Sending refresh token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();
    console.log("data==>", data);

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          token: data.data.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["Admin", "User", "Post", "Category", "Hashtag", "Like", "Comment", "Transit", "Healthcare", "Services"],
  endpoints: () => ({}),
});
