import { Navigate, useParams } from "react-router-dom";
import { useCourse, getFirstIncompleteLesson } from "@/hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseRedirect() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!course) return <Navigate to="/" replace />;

  const lesson = getFirstIncompleteLesson(course);
  return <Navigate to={`/course/${course.id}/lesson/${lesson?.id}`} replace />;
}
