"use client";
import { supabase } from "src/services";
import { FunctionComponent, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Route, nonAuthRoutes } from "src/constants/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: FunctionComponent<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();
  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await supabase.auth.getSession();

        if (session?.data?.session) {
          if (nonAuthRoutes.includes(pathName as Route)) {
            router.push(Route.DASHBOARD);
          }
        } else {
          //TODO: Handle feedback with snackbar
          router.push(Route.LOGIN);
        }
      } catch (error) {
        //TODO: Handle feedback with snackbar
        router.push(Route.LOGIN);
      }
    };

    getSession();
  }, [router, pathName]);

  return <>{children}</>;
};
