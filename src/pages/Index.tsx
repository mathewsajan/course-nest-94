import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrolledCourses, getCompletedCount, getTotalCount, getFirstIncompleteLesson } from "@/hooks/useCourses";

const Index = () => {
  const { data: courses, isLoading } = useEnrolledCourses();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off</p>

        {isLoading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !courses || courses.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">No courses yet</p>
            <p className="mt-1 text-sm">Enroll in a course to get started.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const completed = getCompletedCount(course);
              const total = getTotalCount(course);
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              const resumeLesson = getFirstIncompleteLesson(course);

              return (
                <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <CardContent className="p-4">
                    <h2 className="font-semibold text-foreground leading-snug">{course.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      by {course.instructor_name || "Unknown"}
                    </p>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{completed}/{total} lessons</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                    <Button asChild className="mt-4 w-full" size="sm">
                      <Link to={resumeLesson ? `/course/${course.id}/lesson/${resumeLesson.id}` : `/course/${course.id}`}>
                        {completed > 0 ? "Resume" : "Start"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
