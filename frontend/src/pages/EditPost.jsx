import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "../services/api";

export default function EditPost({ id }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.hash = "#/login";
  }, []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError(null);
      try {
        const data = await apiGet(`/blogs/${id}`);
        if (!mounted) return;
        setTitle(data.title || "");
        setContent(data.content || "");
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load post");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await apiPut(`/blogs/${id}`, { title, content });
      window.location.hash = "#/posts";
    } catch (err) {
      setError(err.message || "Update failed");
    }
  };

  if (loading)
    return (
      <main style={{ padding: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>Loading...</div>
      </main>
    );

  return (
    <main style={{ padding: 48 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1>Edit Post</h1>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div>
            <button type="submit" style={{ marginRight: 8 }}>
              Save
            </button>
            <button
              type="button"
              onClick={() => (window.location.hash = "#/posts")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
