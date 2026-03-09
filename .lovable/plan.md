
## Wiring Up CommentsSection

### What's happening now

`CommentsSection.tsx` exists but:
- It still reads from the `mockData` `Comment` type (static, fake data)
- It is never imported or rendered anywhere
- There is no `lesson_comments` table in the database

The component needs to be fully rebuilt to work with real data: students post comments on a lesson, instructors can reply, all stored in Supabase.

### Plan

**1. Database migration** — new `lesson_comments` table:
```text
lesson_comments
  id           uuid  PK
  lesson_id    uuid  FK → lessons.id (cascade delete)
  user_id      uuid  FK → auth.users (cascade delete)
  parent_id    uuid  FK → lesson_comments.id  (null = top-level, non-null = reply)
  content      text  NOT NULL
  created_at   timestamptz
```
RLS policies:
- SELECT: authenticated users can read all comments
- INSERT: authenticated users, `user_id = auth.uid()`
- DELETE: own comments only (`user_id = auth.uid()`)
- No UPDATE (keep it simple)

**2. Update Supabase types** — add `lesson_comments` to `src/integrations/supabase/types.ts`

**3. Rewrite `CommentsSection.tsx`** — replace mock `Comment` import with:
- `useComments(lessonId)` hook → fetches comments + replies + author display names from `profiles`
- `usePostComment()` mutation → inserts a new top-level comment
- `usePostReply()` mutation → inserts a reply (with `parent_id`)
- UI: list of comments, each with a "Reply" toggle that reveals an inline reply input
- Post box at the top for new top-level comments (textarea + Submit button)
- Shows author display name + relative date

**4. Wire into `LessonViewer.tsx`** — import and render `<CommentsSection lessonId={lesson.id} />` below the prev/next navigation bar

### Files touched
- `supabase/migrations/[new].sql` — create `lesson_comments` table + RLS
- `src/integrations/supabase/types.ts` — add `lesson_comments` table types
- `src/components/CommentsSection.tsx` — full rewrite with real data + post form
- `src/pages/LessonViewer.tsx` — add `<CommentsSection lessonId={lesson.id} />`
