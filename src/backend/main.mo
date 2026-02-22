import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";

actor {
  type Post = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    created_at : Time.Time;
    featured_image : ?Text;
  };

  type Comment = {
    id : Nat;
    post_id : Nat;
    author : Text;
    text : Text;
    created_at : Time.Time;
  };

  module Post {
    public func compare(p1 : Post, p2 : Post) : Order.Order {
      switch (Int.compare(p1.created_at, p2.created_at)) {
        case (#equal) { Nat.compare(p1.id, p2.id) };
        case (order) { order };
      };
    };
  };

  let posts = Map.empty<Nat, Post>();
  let comments = Map.empty<Nat, Comment>();

  var nextPostId = 1;
  var nextCommentId = 1;

  // Post CRUD operations
  public shared ({ caller }) func createPost(title : Text, content : Text, author : Text, featured_image : ?Text) : async Nat {
    let post : Post = {
      id = nextPostId;
      title;
      content;
      author;
      created_at = Time.now();
      featured_image;
    };
    posts.add(nextPostId, post);
    nextPostId += 1;
    post.id;
  };

  public query ({ caller }) func getPost(id : Nat) : async Post {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray().sort();
  };

  public shared ({ caller }) func updatePost(id : Nat, title : Text, content : Text, author : Text, featured_image : ?Text) : async () {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?_) {
        let updatedPost : Post = {
          id;
          title;
          content;
          author;
          created_at = Time.now();
          featured_image;
        };
        posts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not posts.containsKey(id)) {
      Runtime.trap("Post not found");
    };
    posts.remove(id);
  };

  // Comment operations
  public shared ({ caller }) func addComment(post_id : Nat, author : Text, text : Text) : async Nat {
    if (not posts.containsKey(post_id)) {
      Runtime.trap("Post not found");
    };
    let comment : Comment = {
      id = nextCommentId;
      post_id;
      author;
      text;
      created_at = Time.now();
    };
    comments.add(nextCommentId, comment);
    nextCommentId += 1;
    comment.id;
  };

  public query ({ caller }) func getCommentsForPost(post_id : Nat) : async [Comment] {
    comments.values().toArray().filter(func(c) { c.post_id == post_id });
  };
};
