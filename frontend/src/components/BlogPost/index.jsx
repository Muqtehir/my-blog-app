import React from "react";

function BlogPost({ post }) {
  return (
    <article className="post-card fade-in">
      <h2 className="post-title">{post.title}</h2>
      <p style={{ color: "#444", lineHeight: 1.6 }}>{post.content}</p>
      {post.user && <div className="post-meta">By {post.user.username}</div>}
    </article>
  );
}

export default BlogPost;
