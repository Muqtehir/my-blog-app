import React from "react";
import { Link } from "react-router-dom";
import "./Posts.css";

const Posts = ({ posts = [] }) => {
  return (
    <div className="posts-page-container">
      <h1 className="posts-title">All Blog Posts</h1>

      {posts.length === 0 ? (
        <p className="no-posts">No blog posts available.</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.image && (
                <img src={post.image} alt="cover" className="post-image" />
              )}

              <div className="post-content">
                <h2 className="post-title">{post.title}</h2>

                <p className="post-excerpt">
                  {post.content && post.content.length > 150
                    ? post.content.substring(0, 150) + "..."
                    : post.content || "No content available"}
                </p>

                <p className="post-date">Published: {post.date}</p>

                <Link to={`/posts/${post.id}`} className="read-more">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
