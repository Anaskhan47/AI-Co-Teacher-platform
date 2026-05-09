import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import QuizPage from "./pages/QuizPage";
import PricingPage from "./pages/PricingPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ForTeachers from "./pages/ForTeachers";

const queryClient = new QueryClient();

import AppLayout from "./components/layout/AppLayout";

// PART 2: Block UI until Auth Resolves & PART 3: Routing Logic
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 flex-col gap-6">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initializing Environment...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/for-teachers" element={<ForTeachers />} />

      {/* Auth Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/app/dashboard" replace />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/app/dashboard" replace />} />

      {/* Protected Routes */}
      <Route path="/app" element={user ? <AppLayout /> : <Navigate to="/login" replace />}>
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
