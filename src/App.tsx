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
      {/* NUCLEAR BYPASS: Redirect Root to Dashboard */}
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      
      {/* Public Pages */}
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/for-teachers" element={<ForTeachers />} />

      {/* Auth Pages (Kept for routing but accessible) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* UNGUARDED DASHBOARD ACCESS */}
      <Route path="/app" element={<AppLayout />}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/quiz/:id" element={<QuizPage />} />
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

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
