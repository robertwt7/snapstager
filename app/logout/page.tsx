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
    <div className="flex min-h-screen justify-center items-center mx-auto">
      <main className="md:w-1/2 w-full mx-8 items-center text-center">
        <h1 className="text-3xl">Please wait while we log you out</h1>
      </main>
    </div>
  );
};

export default LogoutPage;
