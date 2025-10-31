import React, { useEffect, useState } from "react";
import { apiGet, apiPut, apiDelete, apiPost } from "../services/api";
import { useUser } from "../context/coreUserContext";

export default function PostDetails({ id }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
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
              {/* Tags & image */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {post.tags.map((t) => (
                    <span key={t} style={{ marginRight: 8, color: "#666" }}>
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              {post.image && (
                <div style={{ marginTop: 12 }}>
                  <img src={post.image} alt="post" style={{ maxWidth: 640 }} />
                </div>
              )}
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
        {/* Comments */}
        <section style={{ marginTop: 32 }}>
          <h3>Comments</h3>
          {post.comments && post.comments.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {post.comments.map((c) => (
                <li key={c._id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#777" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                    {c.content}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#666" }}>No comments yet — be the first!</div>
          )}

          <div style={{ marginTop: 16 }}>
            <h4>Leave a comment</h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const name =
                    commentName || (user && user.username) || "Anonymous";
                  const res = await apiPost(`/blogs/${id}/comments`, {
                    name,
                    content: commentContent,
                  });
                  // append comment locally
                  setCommentContent("");
                  setCommentName("");
                  setPost((p) => ({
                    ...p,
                    comments: [...(p.comments || []), res],
                  }));
                } catch (err) {
                  alert(err.message || "Failed to add comment");
                }
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <input
                  placeholder="Your name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  style={{ padding: 8, width: "100%" }}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <textarea
                  placeholder="Write a comment"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  style={{ padding: 8, width: "100%" }}
                  required
                />
              </div>
              <div>
                <button type="submit">Post comment</button>
              </div>
            </form>
          </div>
        </section>
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
