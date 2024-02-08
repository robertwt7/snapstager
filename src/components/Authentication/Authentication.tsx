"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import React, { FunctionComponent } from "react";
import { supabase } from "src/services";

export const Authentication: FunctionComponent = () => {
  return (
    <Auth
      appearance={{ theme: ThemeSupa }}
      supabaseClient={supabase}
      providers={["github", "facebook", "google"]}
    />
  );
};
