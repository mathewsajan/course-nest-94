import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, CheckCircle2 } from "lucide-react";
import { useCatalogCourses } from "@/hooks/useCourses";
import { useEnroll } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";

const Catalog = () => {
  const { data: courses, isLoading } = useCatalogCourses();
  const enroll = useEnroll();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const filtered = (courses || []).filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = async (courseId: string) => {
    try {
      await enroll.mutateAsync(courseId);
      toast({ title: "Enrolled!", description: "You've been enrolled in the course." });
      navigate(`/course/${courseId}`);
    } catch {
      toast({ title: "Error", description: "Could not enroll. You may already be enrolled.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">Course Catalog</h1>
          <p className="text-sm text-muted-foreground">Browse all available courses and enroll to start learning</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center text-muted-foreground">
            <BookOpen className="h-10 w-10 opacity-30" />
            <p className="text-lg font-medium">{search ? "No courses match your search" : "No courses available yet"}</p>
            {search && (
              <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <Card key={course.id} className="overflow-hidden flex flex-col transition-shadow hover:shadow-md">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground opacity-40" />
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col p-4">
                  <div className="flex-1">
                    <h2 className="font-semibold text-foreground leading-snug">{course.title}</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">by {course.instructor_name || "Unknown"}</p>
                    {course.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
                      </Badge>
                      {course.enrolled && (
                        <Badge variant="outline" className="text-xs gap-1 border-primary/40 text-primary">
                          <CheckCircle2 className="h-3 w-3" />
                          Enrolled
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    {course.enrolled ? (
                      <Button
                        className="w-full"
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        Go to Course
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleEnroll(course.id)}
                        disabled={enroll.isPending}
                      >
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
