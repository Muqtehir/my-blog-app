import React from "react";

function PostCard({ post }) {
  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>By {post.author || "Anonymous"}</small>
    </div>
  );
}

export default PostCard;
