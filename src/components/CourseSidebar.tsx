import { Link, useParams } from "react-router-dom";
import { CheckCircle2, FileText, Video, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CourseWithSections, LessonType } from "@/types/course";
import { getCompletedCount, getTotalCount } from "@/hooks/useCourses";

const typeIcons: Record<LessonType, React.ElementType> = {
  text: FileText,
  video: Video,
  link: Link2,
};

interface CourseSidebarProps {
  course: CourseWithSections;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { lessonId } = useParams();
  const completed = getCompletedCount(course);
  const total = getTotalCount(course);
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const activeSection = course.sections.find((s) =>
    s.lessons.some((l) => l.id === lessonId)
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <p className="mb-2 text-sm font-medium text-foreground">
          {completed}/{total} completed
        </p>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <Accordion
          type="multiple"
          defaultValue={activeSection ? [activeSection.id] : [course.sections[0]?.id]}
        >
          {course.sections.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border-b-0">
              <AccordionTrigger className="px-2 py-3 text-sm font-medium hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <ul className="space-y-0.5">
                  {section.lessons.map((lesson) => {
                    const Icon = typeIcons[lesson.type];
                    const isActive = lesson.id === lessonId;
                    return (
                      <li key={lesson.id}>
                        <Link
                          to={`/course/${course.id}/lesson/${lesson.id}`}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <Icon className="h-4 w-4 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
