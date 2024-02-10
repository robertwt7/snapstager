"use client";
import { supabase } from "src/services";
import { FunctionComponent, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}
export const AuthGuard: FunctionComponent<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session?.data?.session) {
          router.push("/dashboard");
        } else {
          //TODO: Handle feedback with snackbar
          router.push("/");
        }
      } catch (error) {
        //TODO: Handle feedback with snackbar
        router.push("/");
      }
    };

    getSession();
  }, [router]);

  return <>{children}</>;
};
