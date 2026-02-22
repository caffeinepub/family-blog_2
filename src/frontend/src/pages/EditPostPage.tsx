import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetPost, useUpdatePost } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function EditPostPage() {
  const { id } = useParams({ from: '/post/$id/edit' });
  const navigate = useNavigate();
  const postId = BigInt(id);
  const { data: post, isLoading } = useGetPost(postId);
  const updatePost = useUpdatePost();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setAuthor(post.author);
      setContent(post.content);
      setFeaturedImage(post.featured_image || '');
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !author.trim() || !content.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await updatePost.mutateAsync({
        id: postId,
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        featured_image: featuredImage.trim() || null,
      });
      navigate({ to: '/post/$id', params: { id: id } });
    } catch (err) {
      setError('Failed to update post. Please try again.');
      console.error('Error updating post:', err);
    }
  };

  if (isLoading) {
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
        <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate({ to: '/post/$id', params: { id: id } })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Post
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
                disabled={updatePost.isPending}
              />
            </div>

            <div>
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                required
                disabled={updatePost.isPending}
              />
            </div>

            <div>
              <Label htmlFor="featuredImage">Featured Image URL (optional)</Label>
              <Input
                id="featuredImage"
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={updatePost.isPending}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your story..."
                rows={12}
                required
                disabled={updatePost.isPending}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={updatePost.isPending}>
                {updatePost.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Post
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/post/$id', params: { id: id } })}
                disabled={updatePost.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
