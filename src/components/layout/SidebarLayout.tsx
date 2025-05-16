
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bug, LayoutDashboard, Map, Menu, X } from "lucide-react";

type SidebarItemProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
};

const SidebarItem = ({ to, label, icon, isActive }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md transition-colors",
      isActive
        ? "bg-mosquito-300/10 text-mosquito-300"
        : "text-gray-600 hover:bg-mosquito-200/10 hover:text-mosquito-300"
    )}
  >
    <div className="flex-shrink-0 w-5 h-5">{icon}</div>
    <span>{label}</span>
  </Link>
);

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="lg:hidden fixed z-20 top-4 left-4 bg-white shadow-md"
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header - removed the text for the logo */}
          <div className="flex items-center justify-center px-4 py-6">
            <Bug className="h-8 w-8 text-mosquito-300" />
          </div>

          {/* Sidebar links */}
          <nav className="flex-1 px-4 space-y-2 mt-6">
            <SidebarItem
              to="/"
              label="Dashboard"
              icon={<LayoutDashboard size={20} />}
              isActive={pathname === "/"}
            />
            <SidebarItem
              to="/sensors"
              label="Sensors"
              icon={<Map size={20} />}
              isActive={pathname === "/sensors"}
            />
          </nav>

          {/* Sidebar footer - removed the logout button */}
          <div className="p-4 border-t border-gray-200">
            {/* Logout button removed */}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-grow transition-all duration-300 ease-in-out bg-gray-50",
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        )}
      >
        <div className="container mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
};

export default SidebarLayout;
