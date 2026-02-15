import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lesson } from "@/data/mockData";

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="space-y-6">
      {/* Video embed */}
      {lesson.type === "video" && lesson.videoUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Link lesson */}
      {lesson.type === "link" && lesson.linkUrl && (
        <a
          href={lesson.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Resource
          </Button>
        </a>
      )}

      {/* Rich text content */}
      {lesson.content && (
        <div
          className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}
    </div>
  );
}
