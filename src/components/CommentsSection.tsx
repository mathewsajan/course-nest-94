import { useState } from "react";
import { MessageSquare, Reply, Trash2, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CommentRow {
  id: string;
  lesson_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles: { display_name: string | null } | null;
}

interface CommentWithReplies extends CommentRow {
  replies: CommentRow[];
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
function useComments(lessonId: string) {
  return useQuery<CommentWithReplies[]>({
    queryKey: ["comments", lessonId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("lesson_comments")
        .select("*, profiles(display_name)")
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const rows = (data ?? []) as CommentRow[];
      const topLevel = rows.filter((r) => !r.parent_id);
      const replies = rows.filter((r) => !!r.parent_id);

      return topLevel.map((comment) => ({
        ...comment,
        replies: replies.filter((r) => r.parent_id === comment.id),
      }));
    },
    enabled: !!lessonId,
  });
}

function usePostComment(lessonId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await (supabase as any).from("lesson_comments").insert({
        lesson_id: lessonId,
        user_id: user.id,
        parent_id: parentId ?? null,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lessonId] });
    },
    onError: () => {
      toast({ title: "Failed to post comment", variant: "destructive" });
    },
  });
}

function useDeleteComment(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await (supabase as any)
        .from("lesson_comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lessonId] });
    },
    onError: () => {
      toast({ title: "Failed to delete comment", variant: "destructive" });
    },
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function CommentItem({
  comment,
  lessonId,
  isReply = false,
}: {
  comment: CommentRow;
  lessonId: string;
  isReply?: boolean;
}) {
  const { user } = useAuth();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const postComment = usePostComment(lessonId);
  const deleteComment = useDeleteComment(lessonId);

  const displayName = comment.profiles?.display_name ?? "Unknown";

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await postComment.mutateAsync({ content: replyText.trim(), parentId: comment.id });
    setReplyText("");
    setReplyOpen(false);
  };

  return (
    <div className={isReply ? "ml-10 mt-3" : ""}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {initials(displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => setReplyOpen((v) => !v)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            {user?.id === comment.user_id && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
          </div>

          {replyOpen && (
            <div className="mt-2 flex gap-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply…"
                className="min-h-[60px] text-sm resize-none"
              />
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={postComment.isPending || !replyText.trim()}
                  className="h-8"
                >
                  <Send className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setReplyOpen(false); setReplyText(""); }}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
interface CommentsSectionProps {
  lessonId: string;
}

export function CommentsSection({ lessonId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const { data: comments = [], isLoading } = useComments(lessonId);
  const postComment = usePostComment(lessonId);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    await postComment.mutateAsync({ content: newComment.trim() });
    setNewComment("");
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  return (
    <div className="mt-8">
      <Separator />
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <MessageSquare className="h-5 w-5" />
          Discussion {totalCount > 0 && `(${totalCount})`}
        </h3>

        {/* New comment input */}
        {user && (
          <div className="mt-4 flex gap-3">
            <Avatar className="h-8 w-8 shrink-0 mt-0.5">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {initials(user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or leave a comment…"
                className="min-h-[80px] text-sm resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePost();
                }}
              />
              <Button
                onClick={handlePost}
                disabled={postComment.isPending || !newComment.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Comment list */}
        <div className="mt-5 space-y-5">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading comments…</p>
          )}
          {!isLoading && comments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first to ask a question!
            </p>
          )}
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem comment={comment} lessonId={lessonId} />
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} lessonId={lessonId} isReply />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
