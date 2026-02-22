import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Comment {
    id: bigint;
    post_id: bigint;
    text: string;
    created_at: Time;
    author: string;
}
export type Time = bigint;
export interface Post {
    id: bigint;
    title: string;
    content: string;
    created_at: Time;
    author: string;
    featured_image?: string;
}
export interface backendInterface {
    addComment(post_id: bigint, author: string, text: string): Promise<bigint>;
    createPost(title: string, content: string, author: string, featured_image: string | null): Promise<bigint>;
    deletePost(id: bigint): Promise<void>;
    getAllPosts(): Promise<Array<Post>>;
    getCommentsForPost(post_id: bigint): Promise<Array<Comment>>;
    getPost(id: bigint): Promise<Post>;
    updatePost(id: bigint, title: string, content: string, author: string, featured_image: string | null): Promise<void>;
}
