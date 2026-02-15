
-- Lesson type enum
CREATE TYPE public.lesson_type AS ENUM ('text', 'video', 'link', 'quiz');

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sections table
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type public.lesson_type NOT NULL DEFAULT 'text',
  content TEXT,
  video_url TEXT,
  link_url TEXT,
  duration TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_sections_course ON public.sections(course_id);
CREATE INDEX idx_lessons_section ON public.lessons(section_id);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_progress_lesson ON public.lesson_progress(lesson_id);

-- Updated_at triggers
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== RLS POLICIES ====================

-- COURSES: anyone authenticated can read, only instructor can modify
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can insert courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can update their courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can delete their courses"
  ON public.courses FOR DELETE
  TO authenticated
  USING (instructor_id = auth.uid());

-- SECTIONS: anyone authenticated can read, course instructor can modify
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sections"
  ON public.sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Course instructors can insert sections"
  ON public.sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Course instructors can update sections"
  ON public.sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Course instructors can delete sections"
  ON public.sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
  );

-- LESSONS: anyone authenticated can read, course instructor can modify
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Course instructors can insert lessons"
  ON public.lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sections s
      JOIN public.courses c ON c.id = s.course_id
      WHERE s.id = section_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Course instructors can update lessons"
  ON public.lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sections s
      JOIN public.courses c ON c.id = s.course_id
      WHERE s.id = section_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Course instructors can delete lessons"
  ON public.lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sections s
      JOIN public.courses c ON c.id = s.course_id
      WHERE s.id = section_id AND c.instructor_id = auth.uid()
    )
  );

-- ENROLLMENTS: users can view/create their own
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their enrollments"
  ON public.enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can enroll themselves"
  ON public.enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unenroll themselves"
  ON public.enrollments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- LESSON PROGRESS: users can view/create/update their own
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their progress"
  ON public.lesson_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their progress"
  ON public.lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their progress"
  ON public.lesson_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
