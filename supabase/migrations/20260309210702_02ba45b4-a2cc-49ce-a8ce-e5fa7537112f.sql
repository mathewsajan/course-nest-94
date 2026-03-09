CREATE TABLE public.lesson_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parent_id UUID REFERENCES public.lesson_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all comments"
  ON public.lesson_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can post comments"
  ON public.lesson_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON public.lesson_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_lesson_comments_lesson_id ON public.lesson_comments(lesson_id);
CREATE INDEX idx_lesson_comments_parent_id ON public.lesson_comments(parent_id);