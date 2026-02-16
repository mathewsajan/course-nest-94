export type LessonType = "text" | "video" | "link";

export interface DbCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  instructor_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSection {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface DbLesson {
  id: string;
  section_id: string;
  title: string;
  type: LessonType;
  content: string | null;
  video_url: string | null;
  link_url: string | null;
  duration: string | null;
  sort_order: number;
  created_at: string;
}

export interface DbEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface DbLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

// Composed types for UI
export interface SectionWithLessons extends DbSection {
  lessons: LessonWithProgress[];
}

export interface LessonWithProgress extends DbLesson {
  completed: boolean;
}

export interface CourseWithSections extends DbCourse {
  sections: SectionWithLessons[];
  instructor_name?: string | null;
}
