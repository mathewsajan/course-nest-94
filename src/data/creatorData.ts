import type { Course } from "./mockData";
import { courses, getCompletedCount, getTotalCount } from "./mockData";

export type CourseStatus = "published" | "draft";

export interface CreatorCourse {
  id: string;
  course: Course;
  status: CourseStatus;
  price: number;
  enrolledStudents: number;
  revenue: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorMetrics {
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  avgCompletionRate: number;
}

export const creatorCourses: CreatorCourse[] = [
  {
    id: "course-1",
    course: courses[0],
    status: "published",
    price: 49.99,
    enrolledStudents: 1247,
    revenue: 62325.53,
    completionRate: 68,
    createdAt: "2025-09-15",
    updatedAt: "2026-02-10",
  },
  {
    id: "course-2",
    course: courses[1],
    status: "published",
    price: 39.99,
    enrolledStudents: 834,
    revenue: 33351.66,
    completionRate: 72,
    createdAt: "2025-11-02",
    updatedAt: "2026-01-28",
  },
  {
    id: "course-3",
    course: {
      id: "course-3",
      title: "Advanced React Patterns",
      description: "Deep dive into advanced React patterns including render props, compound components, and hooks.",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop",
      instructor: "Sarah Chen",
      instructorAvatar: "SC",
      sections: [
        {
          id: "c3-s1",
          title: "Introduction",
          lessons: [
            { id: "c3-s1-l1", title: "Course Overview", type: "video", completed: false, duration: "8 min", content: "<p>Welcome to Advanced React Patterns.</p>" },
            { id: "c3-s1-l2", title: "Prerequisites", type: "text", completed: false, duration: "5 min", content: "<p>Before starting, make sure you know React basics.</p>" },
          ],
        },
      ],
    },
    status: "draft",
    price: 59.99,
    enrolledStudents: 0,
    revenue: 0,
    completionRate: 0,
    createdAt: "2026-02-01",
    updatedAt: "2026-02-14",
  },
];

export const creatorMetrics: CreatorMetrics = {
  totalStudents: 2081,
  totalRevenue: 95677.19,
  totalCourses: 3,
  avgCompletionRate: 70,
};

export function getCreatorCourse(courseId: string): CreatorCourse | undefined {
  return creatorCourses.find((c) => c.id === courseId);
}
