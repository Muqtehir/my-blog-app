import React, { useState, useEffect } from "react";
import { apiPost, apiUpload } from "../services/api";
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
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let imageUrl = null;
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const up = await apiUpload("/uploads", fd);
        imageUrl = up && up.url ? up.url : null;
      }
      const tagsArr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await apiPost("/blogs", {
        title,
        content,
        image: imageUrl,
        tags: tagsArr,
      });
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
          <label>
            Tags (comma separated)
            <input value={tags} onChange={(e) => setTags(e.target.value)} />
          </label>
          <label>
            Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                setFile(f || null);
                if (f) setPreview(URL.createObjectURL(f));
                else setPreview(null);
              }}
            />
          </label>
          {preview && (
            <div style={{ marginBottom: 12 }}>
              <img src={preview} alt="preview" style={{ maxWidth: 320 }} />
            </div>
          )}
          <button type="submit" className="cta-button" disabled={submitting}>
            {submitting ? "Posting..." : "Publish"}
          </button>
        </form>
      </div>
    </main>
  );
}
