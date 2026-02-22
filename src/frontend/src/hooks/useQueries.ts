import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Post, Comment } from '../backend';

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllPosts();
      // Sort by created_at descending (newest first)
      return posts.sort((a, b) => Number(b.created_at - a.created_at));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Post | null>({
    queryKey: ['post', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPost(id);
      } catch (error) {
        console.error('Error fetching post:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommentsForPost(postId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['comments', postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getCommentsForPost(postId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string; author: string; featured_image: string | null }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.createPost(data.title, data.content, data.author, data.featured_image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      content: string;
      author: string;
      featured_image: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updatePost(data.id, data.title, data.content, data.author, data.featured_image);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id.toString()] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { post_id: bigint; author: string; text: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.addComment(data.post_id, data.author, data.text);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id.toString()] });
    },
  });
}
