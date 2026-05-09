import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import QuizPage from "./pages/QuizPage";
import PricingPage from "./pages/PricingPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ForTeachers from "./pages/ForTeachers";
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* FLAT ROUTING: Dashboard is the Root */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="app/*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Public / Auth Pages (Accessible but not forced) */}
      <Route path="/home" element={<Index />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/for-teachers" element={<ForTeachers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/quiz/:id" element={<QuizPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
