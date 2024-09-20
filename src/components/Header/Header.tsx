"use client";
import Image from "next/image";
import { supabase } from "src/services";
import Link from "next/link";
import { FunctionComponent, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Route } from "src/constants/navigation";

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
    <header
      itemScope
      itemType="http://schema.org/Organization"
      className="mt-3 flex w-full flex-row items-center justify-between gap-2 px-2 pb-7 xs:flex-row sm:px-4"
    >
      <div className="relative h-[60px] w-[200px] md:h-[90px] md:w-[300px]">
        <Link href="/" itemProp="url">
          <Image
            alt="logo text"
            src="/main.png"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw"
          />
        </Link>
      </div>
      <Link
        className="flex max-w-fit items-center justify-center space-x-2 rounded-xl border border-primary bg-blue-700 px-5 py-2 text-sm font-medium text-white shadow-md transition hover:bg-primary/90"
        href={user !== null ? Route.DASHBOARD : Route.LOGIN}
        rel="noopener noreferrer"
      >
        {user !== null ? "Dashboard" : "Login"}
      </Link>
    </header>
  );
};
