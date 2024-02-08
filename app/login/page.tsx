import { NextPage } from "next";
import React from "react";
import { Authentication } from "src/components/Authentication/Authentication";

const LoginPage: NextPage = () => {
  return (
    <div className="flex min-h-screen justify-center items-center mx-auto">
      <main className="w-3/4 md:w-1/3 mx-8 flex-col items-center justify-center">
        <Authentication />
      </main>
    </div>
  );
};

export default LoginPage;
