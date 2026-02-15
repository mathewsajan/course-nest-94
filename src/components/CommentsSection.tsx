import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Comment } from "@/data/mockData";

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className={isReply ? "ml-10 mt-3" : ""}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{comment.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{comment.date}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{comment.text}</p>
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );
}

interface CommentsSectionProps {
  comments?: Comment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="mt-8">
      <Separator />
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </h3>
        <div className="mt-4 space-y-5">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
