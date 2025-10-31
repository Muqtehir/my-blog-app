import React, { useEffect, useState } from "react";
import { apiGet, apiPut, apiDelete } from "../services/api";
import { useUser } from "../context/coreUserContext";

export default function PostDetails({ id }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError(null);
      try {
        const data = await apiGet(`/blogs/${id}`);
        if (!mounted) return;
        setPost(data);
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

  const onSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiPut(`/blogs/${id}`, { title, content });
      setPost(updated);
      setEditing(false);
    } catch (err) {
      alert(err.message || "Update failed");
    }
  };

  const onDelete = async () => {
    try {
      await apiDelete(`/blogs/${id}`);
      // go back to posts list
      window.location.hash = "#/posts";
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  if (loading)
    return (
      <main style={{ padding: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>Loading...</div>
      </main>
    );

  if (error)
    return (
      <main style={{ padding: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", color: "crimson" }}>
          {error}
        </div>
      </main>
    );

  if (!post)
    return (
      <main style={{ padding: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>Post not found</div>
      </main>
    );

  const isOwner = user && post.user && user._id === post.user._id;

  return (
    <main className="page-fade" style={{ padding: 48 }}>
      <div
        style={{ maxWidth: 900, margin: "0 auto", color: "var(--text-gray)" }}
      >
        <article className="post-details">
          {!editing ? (
            <>
              <h1>{post.title}</h1>
              <div style={{ fontSize: 13, color: "#777", marginBottom: 12 }}>
                By{" "}
                {post.user && post.user.username
                  ? post.user.username
                  : "Unknown"}{" "}
                • {new Date(post.createdAt).toLocaleString()}
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                {post.content}
              </div>
              <div style={{ marginTop: 18 }}>
                {isOwner && (
                  <>
                    <button
                      style={{ marginRight: 8 }}
                      onClick={() => setEditing(true)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(true)}
                      style={{
                        background: "#fff",
                        color: "#b00",
                        boxShadow: "none",
                        border: "1px solid #f3c2c2",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  style={{ marginLeft: 12 }}
                  onClick={() => (window.location.hash = "#/posts")}
                >
                  Back to posts
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={onSave}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ width: "100%", padding: 8 }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Content
                </label>
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
                <button type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </article>

        {deleting && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Delete post?</h3>
              <p>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={onDelete}
                  style={{
                    marginRight: 8,
                    background: "#fff",
                    color: "#b00",
                    boxShadow: "none",
                    border: "1px solid #f3c2c2",
                  }}
                >
                  Yes, delete
                </button>
                <button onClick={() => setDeleting(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
