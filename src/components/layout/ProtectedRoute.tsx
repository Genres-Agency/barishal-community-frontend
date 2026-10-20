"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, useCurrentToken } from "../../redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { verifyToken } from "../../utils/verifyToken";

interface DecodedUser {
  role?: string;
  userId?: number;
  email?: string;
  [key: string]: unknown;
}

type TProtectedRoute = {
  children: ReactNode;
  role?: string;
};

const ProtectedRoute = ({ children, role }: TProtectedRoute) => {
  const router = useRouter();
  const token = useAppSelector(useCurrentToken);
  const dispatch = useAppDispatch();

  let user: DecodedUser | null = null;
  if (token) {
    try {
      user = verifyToken(token) as DecodedUser;
    } catch {
      user = null;
    }
  }

  useEffect(() => {
    if (!token) {
      router.replace("/auth");
      return;
    }
    if (role !== undefined && role !== user?.role) {
      dispatch(logout());
      router.replace("/auth");
    }
  }, [token, role, user?.role, dispatch, router]);

  if (!token || (role !== undefined && role !== user?.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;