import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Video,
  Link2,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCourse, useSaveCourse } from "@/hooks/useCourses";
import { toast } from "@/hooks/use-toast";


interface EditableLesson {
  tempId: string;
  title: string;
  content: string;
  video_url: string;
  link_url: string;
  duration: string;
}

interface EditableSection {
  tempId: string;
  title: string;
  lessons: EditableLesson[];
}

function LessonEditor({ lesson, onUpdate, onDelete }: { lesson: EditableLesson; onUpdate: (l: EditableLesson) => void; onDelete: () => void }) {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-background p-3">
      <GripVertical className="mt-2.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input value={lesson.title} onChange={(e) => onUpdate({ ...lesson, title: e.target.value })} className="h-8 text-sm flex-1" placeholder="Lesson title" />
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Video className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <Input value={lesson.video_url} onChange={(e) => onUpdate({ ...lesson, video_url: e.target.value })} placeholder="Video embed URL (optional)" className="h-8 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <Input value={lesson.link_url} onChange={(e) => onUpdate({ ...lesson, link_url: e.target.value })} placeholder="External link URL (optional)" className="h-8 text-sm" />
          </div>
        </div>
        <Textarea
          value={lesson.content.replace(/<[^>]*>/g, "")}
          onChange={(e) => onUpdate({ ...lesson, content: `<p>${e.target.value}</p>` })}
          placeholder="Lesson text content (optional)..."
          className="min-h-[60px] text-sm"
          rows={2}
        />
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Duration</Label>
          <Input value={lesson.duration} onChange={(e) => onUpdate({ ...lesson, duration: e.target.value })} placeholder="e.g. 10 min" className="h-7 w-24 text-xs" />
        </div>
      </div>
    </div>
  );
}

function SectionEditor({
  section, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast,
}: {
  section: EditableSection; onUpdate: (s: EditableSection) => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void; isFirst: boolean; isLast: boolean;
}) {
  const [open, setOpen] = useState(true);

  const addLesson = () => {
    onUpdate({
      ...section,
      lessons: [...section.lessons, { tempId: `tmp-${Date.now()}`, title: "New Lesson", content: "", video_url: "", link_url: "", duration: "" }],
    });
  };

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="py-3">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
            <Input value={section.title} onChange={(e) => onUpdate({ ...section, title: e.target.value })} className="h-8 flex-1 font-semibold" placeholder="Section title" />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isFirst} onClick={onMoveUp}><ChevronUp className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isLast} onClick={onMoveDown}><ChevronDown className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">{open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <p className="ml-6 text-xs text-muted-foreground">{section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}</p>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-2 pt-0">
            {section.lessons.map((lesson, idx) => (
              <LessonEditor
                key={lesson.tempId}
                lesson={lesson}
                onUpdate={(l) => { const ls = [...section.lessons]; ls[idx] = l; onUpdate({ ...section, lessons: ls }); }}
                onDelete={() => onUpdate({ ...section, lessons: section.lessons.filter((_, i) => i !== idx) })}
              />
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={addLesson}>
              <Plus className="mr-2 h-3.5 w-3.5" /> Add Lesson
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isNew = courseId === "new";

  const { data: existingCourse, isLoading } = useCourse(isNew ? undefined : courseId);
  const saveCourse = useSaveCourse();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [initialized, setInitialized] = useState(isNew);

  useEffect(() => {
    if (existingCourse && !initialized) {
      setTitle(existingCourse.title);
      setDescription(existingCourse.description || "");
      setThumbnail(existingCourse.thumbnail || "");
      setSections(
        existingCourse.sections.map((s) => ({
          tempId: s.id,
          title: s.title,
          lessons: s.lessons.map((l) => ({
            tempId: l.id,
            title: l.title,
            content: l.content || "",
            video_url: l.video_url || "",
            link_url: l.link_url || "",
            duration: l.duration || "",
          })),
        }))
      );
      setInitialized(true);
    }
  }, [existingCourse, initialized]);

  const handleSave = () => {
    saveCourse.mutate(
      {
        courseId: isNew ? undefined : courseId,
        title,
        description,
        thumbnail,
        sections: sections.map((s) => ({
          title: s.title,
          lessons: s.lessons.map((l) => ({
            title: l.title,
            type: "text",
            content: l.content,
            video_url: l.video_url,
            link_url: l.link_url,
            duration: l.duration,
          })),
        })),
      },
      {
        onSuccess: (newId) => {
          toast({ title: "Course saved!" });
          if (isNew && newId) navigate(`/creator/course/${newId}`, { replace: true });
        },
        onError: (err) => {
          toast({ title: "Error saving", description: (err as Error).message, variant: "destructive" });
        },
      }
    );
  };

  if (!isNew && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const addSection = () => {
    setSections([...sections, { tempId: `tmp-${Date.now()}`, title: "New Section", lessons: [] }]);
  };

  const totalLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/creator")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{isNew ? "Create Course" : "Edit Course"}</h1>
            <p className="text-sm text-muted-foreground">{totalLessons} lesson{totalLessons !== 1 ? "s" : ""} across {sections.length} section{sections.length !== 1 ? "s" : ""}</p>
          </div>
          <Button className="gap-2" onClick={handleSave} disabled={saveCourse.isPending}>
            <Save className="h-4 w-4" />
            {saveCourse.isPending ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Curriculum</h2>
              <Button variant="outline" size="sm" onClick={addSection}>
                <Plus className="mr-2 h-3.5 w-3.5" /> Add Section
              </Button>
            </div>

            {sections.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-muted-foreground">No sections yet. Add your first section to start building your course.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={addSection}>
                    <Plus className="mr-2 h-3.5 w-3.5" /> Add Section
                  </Button>
                </CardContent>
              </Card>
            ) : (
              sections.map((section, idx) => (
                <SectionEditor
                  key={section.tempId}
                  section={section}
                  onUpdate={(s) => { const u = [...sections]; u[idx] = s; setSections(u); }}
                  onDelete={() => setSections(sections.filter((_, i) => i !== idx))}
                  onMoveUp={() => { const u = [...sections]; [u[idx], u[idx - 1]] = [u[idx - 1], u[idx]]; setSections(u); }}
                  onMoveDown={() => { const u = [...sections]; [u[idx], u[idx + 1]] = [u[idx + 1], u[idx]]; setSections(u); }}
                  isFirst={idx === 0}
                  isLast={idx === sections.length - 1}
                />
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Course Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will students learn?" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input id="thumbnail" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://..." />
                  {thumbnail && <img src={thumbnail} alt="Thumbnail preview" className="mt-2 aspect-video w-full rounded-md border object-cover" />}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
