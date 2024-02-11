"use client";
import Image from "next/image";
import { supabase } from "src/services";
import Link from "next/link";
import { FunctionComponent, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const Header: FunctionComponent = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (user?.data !== null) {
          setUser(user.data.user);
        }
      } catch (error) {
        // TODO: handle error with snackbar
      }
    };
    getUser();
  }, []);

  return (
    <header className="flex flex-row xs:flex-row justify-between items-center w-full mt-3 pb-7 sm:px-4 px-2 gap-2">
      <div className="relative md:h-[90px] md:w-[300px] w-[200px] h-[60px] ">
        <Link href="/">
          <Image alt="logo text" src="/logo.png" fill />
        </Link>
      </div>
      <Link
        className="flex max-w-fit items-center justify-center space-x-2 rounded-xl border border-primary text-white px-5 py-2 text-sm shadow-md hover:bg-primary/90 bg-primary font-medium transition"
        href={user !== null ? "/dashboard" : "/login"}
        rel="noopener noreferrer"
      >
        {user !== null ? "Dashboard" : "Login"}
      </Link>
    </header>
  );
};
