"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/provider/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoggedIn, router, pathname]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
