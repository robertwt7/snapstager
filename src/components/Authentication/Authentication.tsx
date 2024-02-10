"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React, { FunctionComponent } from "react";
import { supabase } from "src/services";

export const Authentication: FunctionComponent = () => {
  return (
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
  );
};
