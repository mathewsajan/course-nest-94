import { Link } from "react-router-dom";
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Pencil,
  Eye,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { creatorCourses, creatorMetrics } from "@/data/creatorData";
import { getTotalCount } from "@/data/mockData";

const metrics = [
  {
    title: "Total Students",
    value: creatorMetrics.totalStudents.toLocaleString(),
    icon: Users,
    subtitle: "+124 this month",
  },
  {
    title: "Total Revenue",
    value: `$${creatorMetrics.totalRevenue.toLocaleString()}`,
    icon: DollarSign,
    subtitle: "+$4,230 this month",
  },
  {
    title: "Total Courses",
    value: creatorMetrics.totalCourses.toString(),
    icon: BookOpen,
    subtitle: "1 draft",
  },
  {
    title: "Avg. Completion",
    value: `${creatorMetrics.avgCompletionRate}%`,
    icon: TrendingUp,
    subtitle: "+3% from last month",
  },
];

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Creator Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your courses and track performance
            </p>
          </div>
          <Button asChild>
            <Link to="/creator/course/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {m.title}
                </CardTitle>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{m.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{m.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Students</TableHead>
                  <TableHead className="hidden md:table-cell">Revenue</TableHead>
                  <TableHead className="hidden lg:table-cell">Completion</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {creatorCourses.map((cc) => (
                  <TableRow key={cc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={cc.course.thumbnail}
                          alt={cc.course.title}
                          className="hidden h-10 w-16 rounded object-cover sm:block"
                        />
                        <div>
                          <p className="font-medium text-foreground leading-snug">
                            {cc.course.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getTotalCount(cc.course)} lessons
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={cc.status === "published" ? "default" : "secondary"}
                      >
                        {cc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      ${cc.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {cc.enrolledStudents.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${cc.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Progress value={cc.completionRate} className="h-1.5 w-16" />
                        <span className="text-xs text-muted-foreground">
                          {cc.completionRate}%
                        </span>
                      </div>
                    </TableCell>
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
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/course/${cc.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
