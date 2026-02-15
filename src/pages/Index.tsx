import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses, getCompletedCount, getTotalCount, getFirstIncompleteLesson } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const completed = getCompletedCount(course);
            const total = getTotalCount(course);
            const progress = Math.round((completed / total) * 100);
            const resumeLesson = getFirstIncompleteLesson(course);

            return (
              <Card key={course.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
                <CardContent className="p-4">
                  <h2 className="font-semibold text-foreground leading-snug">{course.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">by {course.instructor}</p>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{completed}/{total} lessons</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <Button asChild className="mt-4 w-full" size="sm">
                    <Link to={`/course/${course.id}/lesson/${resumeLesson?.id}`}>
                      {completed > 0 ? "Resume" : "Start"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;
