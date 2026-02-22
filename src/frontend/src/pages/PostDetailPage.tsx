import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPost, useGetCommentsForPost, useDeletePost } from '../hooks/useQueries';
import { Calendar, User, Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { useState } from 'react';

export default function PostDetailPage() {
  const { id } = useParams({ from: '/post/$id' });
  const navigate = useNavigate();
  const postId = BigInt(id);
  const { data: post, isLoading: postLoading } = useGetPost(postId);
  const { data: comments, isLoading: commentsLoading } = useGetCommentsForPost(postId);
  const deletePost = useDeletePost();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(postId);
      navigate({ to: '/' });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-card rounded-lg border border-border shadow-sm overflow-hidden mb-8">
        {post.featured_image && (
          <div className="w-full h-64 md:h-96 overflow-hidden">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
          </div>
          <div className="prose prose-lg max-w-none text-foreground whitespace-pre-wrap mb-8">{post.content}</div>
          <div className="flex gap-2 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate({ to: '/post/$id/edit', params: { id: id } })}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Post
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Post
            </Button>
          </div>
        </div>
      </article>

      <div className="bg-card rounded-lg border border-border shadow-sm p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Add a Comment</h2>
        <CommentForm postId={postId} />
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Comments {comments && comments.length > 0 && `(${comments.length})`}
        </h2>
        {commentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <CommentList comments={comments || []} />
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        isLoading={deletePost.isPending}
      />
    </div>
  );
}
