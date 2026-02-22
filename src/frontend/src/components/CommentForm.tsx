import { useState } from 'react';
import { useAddComment } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  postId: bigint;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const addComment = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !text.trim()) {
      return;
    }

    try {
      await addComment.mutateAsync({
        post_id: postId,
        author: author.trim(),
        text: text.trim(),
      });
      setAuthor('');
      setText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="author">Your Name</Label>
        <Input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter your name"
          required
          disabled={addComment.isPending}
        />
      </div>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          required
          disabled={addComment.isPending}
        />
      </div>
      <Button type="submit" disabled={addComment.isPending || !author.trim() || !text.trim()}>
        {addComment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Post Comment
      </Button>
    </form>
  );
}
