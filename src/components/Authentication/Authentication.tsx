"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FunctionComponent, useEffect } from "react";
import { supabase } from "src/services";
import { AuthGuard } from "../AuthGuard";

export const Authentication: FunctionComponent = () => {
  const router = useRouter();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.refresh();
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  });
  return (
    <AuthGuard>
      <div className="flex flex-col items-center">
        <div className="relative md:h-[90px] md:w-[300px] w-[200px] h-[60px] ">
          <Image alt="logo text" src="/logo.png" fill />
        </div>
        <div className="w-full">
          <Auth
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#172D3F",
                    brandAccent: "#2d577a",
                  },
                },
              },
            }}
            supabaseClient={supabase}
            providers={["github", "facebook", "google"]}
            redirectTo="/dashboard"
          />
        </div>
      </div>
    </AuthGuard>
  );
};
