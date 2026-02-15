import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Plus,
  MoreHorizontal,
  Pencil,
  Eye,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreatorCourses, getTotalCount } from "@/hooks/useCourses";

export default function CreatorDashboard() {
  const { data: courses, isLoading } = useCreatorCourses();

  const totalStudents = courses?.reduce((sum, c) => sum + c.enrolledStudents, 0) || 0;
  const totalCourses = courses?.length || 0;

  const metrics = [
    { title: "Total Students", value: totalStudents.toLocaleString(), icon: Users },
    { title: "Total Courses", value: totalCourses.toString(), icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Creator Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your courses and track performance</p>
          </div>
          <Button asChild>
            <Link to="/creator/course/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{m.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : !courses || courses.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No courses yet. Create your first course!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead className="hidden md:table-cell">Students</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((cc) => (
                    <TableRow key={cc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {cc.thumbnail && (
                            <img src={cc.thumbnail} alt={cc.title} className="hidden h-10 w-16 rounded object-cover sm:block" />
                          )}
                          <div>
                            <p className="font-medium text-foreground leading-snug">{cc.title}</p>
                            <p className="text-xs text-muted-foreground">{getTotalCount(cc)} lessons</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{cc.enrolledStudents.toLocaleString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/creator/course/${cc.id}`}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/course/${cc.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> Preview
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
