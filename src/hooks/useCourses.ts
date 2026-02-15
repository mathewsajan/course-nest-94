import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type {
  DbCourse,
  DbSection,
  DbLesson,
  DbEnrollment,
  DbLessonProgress,
  CourseWithSections,
  SectionWithLessons,
  LessonWithProgress,
} from "@/types/course";

// Cast helper for untyped tables
const db = (table: string) => supabase.from(table as any);

// ─── Fetch enrolled courses with sections, lessons, progress ───

async function fetchEnrolledCourses(userId: string): Promise<CourseWithSections[]> {
  const { data: enrollments, error: eErr } = await db("enrollments")
    .select("course_id")
    .eq("user_id", userId);
  if (eErr) throw eErr;
  const enrs = (enrollments as unknown as DbEnrollment[]) || [];
  if (enrs.length === 0) return [];

  const courseIds = enrs.map((e) => e.course_id);

  const { data: rawCourses, error: cErr } = await db("courses").select("*").in("id", courseIds);
  if (cErr) throw cErr;
  const courses = (rawCourses as unknown as DbCourse[]) || [];

  // Instructor profiles
  const instructorIds = courses.map((c) => c.instructor_id).filter(Boolean) as string[];
  let profilesMap: Record<string, string> = {};
  if (instructorIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", instructorIds);
    if (profiles) for (const p of profiles) profilesMap[p.id] = p.display_name || "Instructor";
  }

  const { data: rawSections, error: sErr } = await db("sections").select("*").in("course_id", courseIds).order("sort_order");
  if (sErr) throw sErr;
  const sections = (rawSections as unknown as DbSection[]) || [];
  const sectionIds = sections.map((s) => s.id);

  let lessons: DbLesson[] = [];
  if (sectionIds.length > 0) {
    const { data: rawLessons, error: lErr } = await db("lessons").select("*").in("section_id", sectionIds).order("sort_order");
    if (lErr) throw lErr;
    lessons = (rawLessons as unknown as DbLesson[]) || [];
  }

  let progressMap: Record<string, boolean> = {};
  const lessonIds = lessons.map((l) => l.id);
  if (lessonIds.length > 0) {
    const { data: rawProgress } = await db("lesson_progress").select("lesson_id, completed").eq("user_id", userId).in("lesson_id", lessonIds);
    if (rawProgress) for (const p of rawProgress as unknown as DbLessonProgress[]) progressMap[p.lesson_id] = p.completed;
  }

  // Assemble
  const lessonsMap = new Map<string, LessonWithProgress[]>();
  for (const l of lessons) {
    const arr = lessonsMap.get(l.section_id) || [];
    arr.push({ ...l, completed: progressMap[l.id] || false });
    lessonsMap.set(l.section_id, arr);
  }

  const sectionsMap = new Map<string, SectionWithLessons[]>();
  for (const s of sections) {
    const arr = sectionsMap.get(s.course_id) || [];
    arr.push({ ...s, lessons: lessonsMap.get(s.id) || [] });
    sectionsMap.set(s.course_id, arr);
  }

  return courses.map((c) => ({
    ...c,
    sections: sectionsMap.get(c.id) || [],
    instructor_name: c.instructor_id ? profilesMap[c.instructor_id] : null,
  }));
}

export function useEnrolledCourses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["enrolled-courses", user?.id],
    queryFn: () => fetchEnrolledCourses(user!.id),
    enabled: !!user,
  });
}

// ─── Fetch single course ───

async function fetchCourse(courseId: string, userId: string): Promise<CourseWithSections | null> {
  const { data: rawCourse, error } = await db("courses").select("*").eq("id", courseId).maybeSingle();
  if (error) throw error;
  if (!rawCourse) return null;
  const c = rawCourse as unknown as DbCourse;

  let instructorName: string | null = null;
  if (c.instructor_id) {
    const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", c.instructor_id).maybeSingle();
    instructorName = profile?.display_name || "Instructor";
  }

  const { data: rawSections } = await db("sections").select("*").eq("course_id", courseId).order("sort_order");
  const sections = (rawSections as unknown as DbSection[]) || [];
  const sectionIds = sections.map((s) => s.id);

  let lessons: DbLesson[] = [];
  if (sectionIds.length > 0) {
    const { data: rawLessons } = await db("lessons").select("*").in("section_id", sectionIds).order("sort_order");
    lessons = (rawLessons as unknown as DbLesson[]) || [];
  }

  let progressMap: Record<string, boolean> = {};
  const lessonIds = lessons.map((l) => l.id);
  if (lessonIds.length > 0) {
    const { data: rawProgress } = await db("lesson_progress").select("lesson_id, completed").eq("user_id", userId).in("lesson_id", lessonIds);
    if (rawProgress) for (const p of rawProgress as unknown as DbLessonProgress[]) progressMap[p.lesson_id] = p.completed;
  }

  const lessonsMap = new Map<string, LessonWithProgress[]>();
  for (const l of lessons) {
    const arr = lessonsMap.get(l.section_id) || [];
    arr.push({ ...l, completed: progressMap[l.id] || false });
    lessonsMap.set(l.section_id, arr);
  }

  const builtSections: SectionWithLessons[] = sections.map((s) => ({
    ...s,
    lessons: lessonsMap.get(s.id) || [],
  }));

  return { ...c, sections: builtSections, instructor_name: instructorName };
}

export function useCourse(courseId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["course", courseId, user?.id],
    queryFn: () => fetchCourse(courseId!, user!.id),
    enabled: !!courseId && !!user,
  });
}

// ─── Complete lesson ───

export function useCompleteLesson() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await db("lesson_progress").upsert(
        { user_id: user.id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
        { onConflict: "user_id,lesson_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
    },
  });
}

// ─── Enroll in course ───

export function useEnroll() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await db("enrollments").insert({ user_id: user.id, course_id: courseId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
    },
  });
}

// ─── Creator: fetch courses by instructor ───

export function useCreatorCourses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["creator-courses", user?.id],
    queryFn: async () => {
      const { data: rawCourses, error } = await db("courses").select("*").eq("instructor_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      const courses = (rawCourses as unknown as DbCourse[]) || [];

      const courseIds = courses.map((c) => c.id);
      let sectionsData: DbSection[] = [];
      let lessonsData: DbLesson[] = [];

      if (courseIds.length > 0) {
        const { data: s } = await db("sections").select("*").in("course_id", courseIds);
        sectionsData = (s as unknown as DbSection[]) || [];
        const sIds = sectionsData.map((s) => s.id);
        if (sIds.length > 0) {
          const { data: l } = await db("lessons").select("*").in("section_id", sIds);
          lessonsData = (l as unknown as DbLesson[]) || [];
        }
      }

      // Enrollment counts
      let enrollmentCounts: Record<string, number> = {};
      for (const cId of courseIds) {
        const { count } = await db("enrollments").select("*", { count: "exact", head: true }).eq("course_id", cId);
        enrollmentCounts[cId] = count || 0;
      }

      // Assemble
      const lessonsMap = new Map<string, LessonWithProgress[]>();
      for (const l of lessonsData) {
        const arr = lessonsMap.get(l.section_id) || [];
        arr.push({ ...l, completed: false });
        lessonsMap.set(l.section_id, arr);
      }

      const sectionsMap = new Map<string, SectionWithLessons[]>();
      for (const s of sectionsData) {
        const arr = sectionsMap.get(s.course_id) || [];
        arr.push({ ...s, lessons: lessonsMap.get(s.id) || [] });
        sectionsMap.set(s.course_id, arr);
      }

      return courses.map((c) => ({
        ...c,
        sections: sectionsMap.get(c.id) || [],
        instructor_name: null as string | null,
        enrolledStudents: enrollmentCounts[c.id] || 0,
      }));
    },
    enabled: !!user,
  });
}

// ─── Creator: save course ───

export function useSaveCourse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      title,
      description,
      thumbnail,
      sections,
    }: {
      courseId?: string;
      title: string;
      description: string;
      thumbnail: string;
      sections: { title: string; lessons: { title: string; type: string; content?: string; video_url?: string; link_url?: string; duration?: string }[] }[];
    }) => {
      if (!user) throw new Error("Not authenticated");

      let finalCourseId = courseId;

      if (courseId) {
        const { error } = await db("courses").update({ title, description, thumbnail }).eq("id", courseId);
        if (error) throw error;
      } else {
        const { data, error } = await db("courses").insert({ title, description, thumbnail, instructor_id: user.id }).select("id").single();
        if (error) throw error;
        finalCourseId = (data as any).id;
      }

      // Delete existing sections (cascade deletes lessons)
      if (courseId) {
        await db("sections").delete().eq("course_id", courseId);
      }

      // Insert sections & lessons
      for (let si = 0; si < sections.length; si++) {
        const sec = sections[si];
        const { data: secData, error: secErr } = await db("sections").insert({ course_id: finalCourseId, title: sec.title, sort_order: si }).select("id").single();
        if (secErr) throw secErr;
        const sectionId = (secData as any).id;

        if (sec.lessons.length > 0) {
          const lessonRows = sec.lessons.map((l, li) => ({
            section_id: sectionId,
            title: l.title,
            type: l.type,
            content: l.content || null,
            video_url: l.video_url || null,
            link_url: l.link_url || null,
            duration: l.duration || null,
            sort_order: li,
          }));
          const { error: lErr } = await db("lessons").insert(lessonRows);
          if (lErr) throw lErr;
        }
      }

      return finalCourseId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-courses"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
}

// ─── Helpers ───

export function getAllLessons(course: CourseWithSections): LessonWithProgress[] {
  return course.sections.flatMap((s) => s.lessons);
}

export function getCompletedCount(course: CourseWithSections): number {
  return getAllLessons(course).filter((l) => l.completed).length;
}

export function getTotalCount(course: CourseWithSections): number {
  return getAllLessons(course).length;
}

export function getFirstIncompleteLesson(course: CourseWithSections): LessonWithProgress | undefined {
  const all = getAllLessons(course);
  return all.find((l) => !l.completed) || all[0];
}

export function getAdjacentLessons(course: CourseWithSections, lessonId: string) {
  const all = getAllLessons(course);
  const idx = all.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? all[idx - 1] : undefined,
    next: idx < all.length - 1 ? all[idx + 1] : undefined,
  };
}

export function getLessonWithSection(course: CourseWithSections, lessonId: string) {
  for (const section of course.sections) {
    const lesson = section.lessons.find((l) => l.id === lessonId);
    if (lesson) return { section, lesson };
  }
  return undefined;
}
