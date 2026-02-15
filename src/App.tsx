import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CourseRedirect from "./pages/CourseRedirect";
import LessonViewer from "./pages/LessonViewer";
import CreatorDashboard from "./pages/CreatorDashboard";
import CourseEditor from "./pages/CourseEditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/course/:courseId" element={<CourseRedirect />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonViewer />} />
          <Route path="/creator" element={<CreatorDashboard />} />
          <Route path="/creator/course/:courseId" element={<CourseEditor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
