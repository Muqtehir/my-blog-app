import React, { useState } from "react";
import { apiPost } from "../services/api";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiPost("/blogs", { title, content });
      window.location.hash = "#/posts";
    } catch (err) {
      setError(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-blog" id="create-blog" style={{ paddingTop: 24 }}>
      <div className="create-blog__inner">
        <h2 className="muted">CREATE A BLOG WEBSITE</h2>
        <h1 className="title">Create a new post</h1>

        {error && (
          <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>
        )}
        <form onSubmit={onSubmit} className="auth-form">
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </label>
          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? "Posting..." : "Publish"}
          </button>
        </form>
      </div>
    </main>
  );
}
