import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CourseRedirect from "./pages/CourseRedirect";
import LessonViewer from "./pages/LessonViewer";
import CreatorDashboard from "./pages/CreatorDashboard";
import CourseEditor from "./pages/CourseEditor";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/course/:courseId" element={<ProtectedRoute><CourseRedirect /></ProtectedRoute>} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
            <Route path="/creator" element={<ProtectedRoute><CreatorDashboard /></ProtectedRoute>} />
            <Route path="/creator/course/:courseId" element={<ProtectedRoute><CourseEditor /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
