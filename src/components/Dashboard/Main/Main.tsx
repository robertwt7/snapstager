"use client";
import { FunctionComponent, useState } from "react";
import { Header } from "../Header/Header";
import { Navigation } from "../Navigation";

export const Main: FunctionComponent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Navigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-72">
        <Header handleSidebarOpen={(open) => setSidebarOpen(open)} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>
      </div>
    </div>
  );
};
