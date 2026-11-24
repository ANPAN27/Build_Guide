"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children, roles }: { children: React.ReactNode; roles?: Array<"HOMEOWNER" | "PROVIDER" | "ADMIN"> }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/provider/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [isLoading, user, roles, router, pathname]);

  if (isLoading) return <div className="section"><div className="container">Loading...</div></div>;
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return <>{children}</>;
}
