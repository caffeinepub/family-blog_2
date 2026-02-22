import { useGetAllPosts } from '../hooks/useQueries';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { data: posts, isLoading, error } = useGetAllPosts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Error loading posts. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/generated/family-placeholder.dim_400x400.png"
            alt="Placeholder illustration of family gathering"
            className="w-48 h-48 rounded-full shadow-lg"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Welcome to Our Family Blog</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A place to share our memories, stories, and moments that matter most. Join us as we document our journey
          together.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground text-lg mb-4">No posts yet. Be the first to share a story!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id.toString()} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
