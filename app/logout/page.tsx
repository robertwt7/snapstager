"use client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { supabase } from "src/services";

const LogoutPage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    const logout = async () => {
      try {
        const response = await supabase.auth.signOut();
        // TODO: Notify with snackbar
        if (response) {
          router.push("/");
        }
      } catch (error) {
        // TODO: Notify with snackbar
      }
    };
    logout();
  }, [router]);

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <main className="mx-8 w-full items-center text-center md:w-1/2">
        <h1 className="text-3xl">Please wait while we log you out...</h1>
      </main>
    </div>
  );
};

export default LogoutPage;
