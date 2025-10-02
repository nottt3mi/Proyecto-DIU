import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RegisterType from "./pages/RegisterType";
import RegisterEmployer from "./pages/RegisterEmployer";
import RegisterWorker from "./pages/RegisterWorker";
import LoginType from "./pages/LoginType";
import LoginEmployer from "./pages/LoginEmployer";
import LoginWorker from "./pages/LoginWorker";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import { AuthProvider } from "./contexts/AuthContext";
import ServicesExplore from "./components/ServicesExplore";
import WorkerPublicProfileView from "./pages/WorkerPublicProfileView";
import SelectService from "./pages/SelectService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<SelectService />} />
            <Route path="/worker/:id" element={<WorkerPublicProfileView />} />
            <Route path="/register" element={<RegisterType />} />
            <Route path="/register/employer" element={<RegisterEmployer />} />
            <Route path="/register/worker" element={<RegisterWorker />} />
            <Route path="/login" element={<LoginType />} />
            <Route path="/login/employer" element={<LoginEmployer />} />
            <Route path="/login/worker" element={<LoginWorker />} />
            <Route path="/profile/employer" element={<EmployerProfilePage />} />
            <Route path="/profile/worker" element={<WorkerProfilePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
