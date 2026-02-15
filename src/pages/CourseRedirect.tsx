import { Navigate, useParams } from "react-router-dom";
import { getCourse, getFirstIncompleteLesson } from "@/data/mockData";

export default function CourseRedirect() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = getCourse(courseId || "");

  if (!course) return <Navigate to="/" replace />;

  const lesson = getFirstIncompleteLesson(course);
  return <Navigate to={`/course/${course.id}/lesson/${lesson?.id}`} replace />;
}
