import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./../Sidebar";
import Header from "./../Header";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="h-screen flex overflow-hidden relative">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div
        className={`
                flex-1 flex flex-col transition-all duration-300 ease-in-out
                ${isSidebarOpen ? "lg:ml-64 ml-0" : "ml-0"}
            `}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
