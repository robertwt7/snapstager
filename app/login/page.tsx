import { NextPage } from "next";
import React from "react";
import { Authentication } from "src/components/Authentication/Authentication";

const LoginPage: NextPage = () => {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <main className="mx-8 w-3/4 flex-col items-center justify-center md:w-1/3">
        <Authentication />
      </main>
    </div>
  );
};

export default LoginPage;
