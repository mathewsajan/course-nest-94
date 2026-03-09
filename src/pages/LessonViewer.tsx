import { useState } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CourseSidebar } from "@/components/CourseSidebar";
import { LessonContent } from "@/components/LessonContent";
import { CommentsSection } from "@/components/CommentsSection";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCourse, useCompleteLesson, getAdjacentLessons, getLessonWithSection } from "@/hooks/useCourses";

export default function LessonViewer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: course, isLoading } = useCourse(courseId);
  const completeLesson = useCompleteLesson();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-8 w-96" />
          <Skeleton className="aspect-video w-full max-w-3xl" />
        </div>
      </div>
    );
  }

  if (!course) return <Navigate to="/" replace />;

  const result = getLessonWithSection(course, lessonId || "");
  if (!result) return <Navigate to={`/course/${courseId}`} replace />;

  const { section, lesson } = result;
  const { prev, next } = getAdjacentLessons(course, lesson.id);

  const handleComplete = () => {
    completeLesson.mutate(lesson.id, {
      onSuccess: () => {
        if (next) navigate(`/course/${course.id}/lesson/${next.id}`);
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        {!isMobile && (
          <aside className="w-72 shrink-0 border-r bg-background">
            <CourseSidebar course={course} />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Mobile sidebar trigger + breadcrumb */}
            <div className="mb-4 flex items-center gap-3">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 p-0">
                    <CourseSidebar course={course} />
                  </SheetContent>
                </Sheet>
              )}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Courses</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/course/${course.id}`}>{course.title}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{section.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Lesson title */}
            <h1 className="text-2xl font-bold text-foreground">{lesson.title}</h1>
            {lesson.duration && (
              <p className="mt-1 text-sm text-muted-foreground">{lesson.duration}</p>
            )}

            {/* Lesson content */}
            <div className="mt-6">
              <LessonContent lesson={lesson} />
            </div>

            {/* Complete & Continue */}
            <div className="mt-8">
              {lesson.completed ? (
                next ? (
                  <Button asChild className="gap-2" variant="outline">
                    <Link to={`/course/${course.id}/lesson/${next.id}`}>
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Course Complete!
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={completeLesson.isPending}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  {completeLesson.isPending ? "Saving..." : "Complete & Continue"}
                </Button>
              )}
            </div>

            {/* Prev / Next nav */}
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              {prev ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/course/${course.id}/lesson/${prev.id}`} className="gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    {prev.title}
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              {next ? (
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/course/${course.id}/lesson/${next.id}`} className="gap-1">
                    {next.title}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div />
              )}
            </div>

            {/* Comments */}
            <CommentsSection lessonId={lesson.id} />
          </div>
        </main>
      </div>
    </div>
  );
}
