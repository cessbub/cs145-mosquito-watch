
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/layout/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import Sensors from "./pages/Sensors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
