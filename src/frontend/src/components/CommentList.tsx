import { Calendar, User } from 'lucide-react';
import type { Comment } from '../backend';

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (comments.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id.toString()} className="border-l-4 border-primary/30 pl-4 py-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <User className="w-3 h-3" />
              {comment.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p className="text-foreground">{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
