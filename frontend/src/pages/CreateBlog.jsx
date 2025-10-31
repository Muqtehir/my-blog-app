import React, { useState, useEffect } from "react";
import { apiPost } from "../services/api";
import { useUser } from "../context/coreUserContext";

export default function CreateBlog() {
  const [title, setTitle] = useState("");

  const { user, loading } = useUser();
  useEffect(() => {
    // wait for user verification, then redirect if not logged in
    if (!loading && !user) {
      window.location.hash = "#/login";
    }
  }, [loading, user]);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiPost("/blogs", { title, content });
      window.location.hash = "#/posts";
    } catch (err) {
      setError(err.message || "Create failed");
    } finally {
      setSubmitting(false);
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
          <button type="submit" className="cta-button" disabled={submitting}>
            {submitting ? "Posting..." : "Publish"}
          </button>
        </form>
      </div>
    </main>
  );
}
