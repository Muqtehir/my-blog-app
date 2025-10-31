import React, { useEffect, useState } from "react";
import { apiGet, apiPut, apiUpload } from "../services/api";
import { useUser } from "../context/coreUserContext";

export default function EditPost({ id }) {
  const { user, loading: userLoading } = useUser();
  useEffect(() => {
    if (!userLoading && !user) window.location.hash = "#/login";
  }, [userLoading, user]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
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
        setTags((data.tags || []).join(", "));
        setPreview(data.image || null);
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
      let imageUrl = preview || null;
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const up = await apiUpload("/uploads", fd);
        imageUrl = up && up.url ? up.url : imageUrl;
      }
      const tagsArr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await apiPut(`/blogs/${id}`, {
        title,
        content,
        image: imageUrl,
        tags: tagsArr,
      });
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
            <label style={{ display: "block", marginBottom: 6 }}>Tags</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma separated"
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                setFile(f || null);
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
            {preview && (
              <div style={{ marginTop: 8 }}>
                <img src={preview} alt="preview" style={{ maxWidth: 320 }} />
              </div>
            )}
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
