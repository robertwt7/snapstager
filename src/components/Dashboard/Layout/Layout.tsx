"use client";
import { FunctionComponent, useState } from "react";
import { Header } from "../Header/Header";
import { Navigation } from "../Navigation";
import { UserContextProvider } from "./UserContext";

export const Layout: FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-72">
        <UserContextProvider>
          <Header handleSidebarOpen={(open) => setSidebarOpen(open)} />
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </UserContextProvider>
      </div>
    </div>
  );
};
