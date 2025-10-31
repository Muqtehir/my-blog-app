import React, { useEffect, useState, useCallback } from "react";
import { motion as Motion } from "framer-motion";
import { apiGet, apiDelete, apiPost } from "../services/api";
import { useUser } from "../context/coreUserContext";
import toast from "../components/Toast";

export default function Posts() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [reacting, setReacting] = useState({});

  const load = useCallback(
    async (opts = {}) => {
      setError(null);
      try {
        const q = opts.query ? `&search=${encodeURIComponent(opts.query)}` : "";
        const data = await apiGet(`/blogs?page=${page}&limit=8${q}`);
        const items = Array.isArray(data) ? data : data.blogs || [];
        setBlogs(items);
        setPages(data.pages || 1);
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    setLoading(true);
    load();

    const onSearch = (e) => {
      const q = (e && e.detail && e.detail.q) || "";
      setPage(1);
      setLoading(true);
      (async () => {
        try {
          const data = await apiGet(
            `/blogs?page=1&limit=8&search=${encodeURIComponent(q)}`
          );
          const items = Array.isArray(data) ? data : data.blogs || [];
          setBlogs(items);
          setPages(data.pages || 1);
        } catch (err) {
          setError(err.message || "Failed to load");
        } finally {
          setLoading(false);
        }
      })();
    };

    window.addEventListener("search:query", onSearch);
    return () => window.removeEventListener("search:query", onSearch);
  }, [load]);

  const next = () => setPage((p) => Math.min(p + 1, pages));
  const prev = () => setPage((p) => Math.max(1, p - 1));

  const onDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await apiDelete(`/blogs/${id}`);
      toast.success("Post deleted");
      load();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <main className="page-fade" style={{ padding: 48 }}>
      <div
        style={{ maxWidth: 900, margin: "0 auto", color: "var(--text-gray)" }}
      >
        <h1>Posts</h1>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {loading ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Array.from({ length: 6 }).map((_, si) => (
              <li
                key={`skeleton-${si}`}
                className="blog-card skeleton-card"
                style={{ marginBottom: 18, paddingBottom: 12 }}
              >
                <div
                  style={{
                    height: 18,
                    width: "60%",
                    background: "#eee",
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{
                    height: 12,
                    width: "40%",
                    background: "#eee",
                    borderRadius: 6,
                    marginBottom: 10,
                  }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <div
                    style={{
                      height: 10,
                      width: 80,
                      background: "#eee",
                      borderRadius: 6,
                    }}
                  />
                  <div
                    style={{
                      height: 10,
                      width: 80,
                      background: "#eee",
                      borderRadius: 6,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : !blogs || blogs.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#666" }}>
            <p style={{ fontSize: 18 }}>No posts yet</p>
            <p>
              Be the first to <a href="#/create">create a post</a>.
            </p>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {blogs.map((b, i) => (
                <Motion.li
                  key={b._id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.24 }}
                  style={{
                    marginBottom: 18,
                    borderBottom: "1px solid #eee",
                    paddingBottom: 12,
                    ["--delay"]: `${i * 70}ms`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href={`#/posts/${b._id}`}
                      style={{
                        color: "var(--deep-purple)",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {b.title}
                    </a>
                    <div>
                      {b.user &&
                        String(b.user._id || b.user) === String(user?._id) && (
                          <>
                            <button
                              onClick={() =>
                                (window.location.hash = `#/edit/${b._id}`)
                              }
                              style={{ marginRight: 8 }}
                            >
                              Edit
                            </button>
                            <button onClick={() => onDelete(b._id)}>
                              Delete
                            </button>
                          </>
                        )}
                      {user && user.isAdmin && (
                        <button
                          onClick={() => {
                            if (confirm("Delete this post as admin?"))
                              onDelete(b._id);
                          }}
                          style={{ marginLeft: 8 }}
                        >
                          Admin Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {b.image && (
                    <div style={{ marginTop: 8 }}>
                      <img
                        src={b.image}
                        alt="thumb"
                        style={{ maxWidth: 320 }}
                      />
                    </div>
                  )}

                  <div style={{ color: "#666", marginTop: 6 }}>{b.content}</div>

                  {b.tags && b.tags.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {b.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            marginRight: 8,
                            fontSize: 12,
                            color: "#666",
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: 13, color: "#999", marginTop: 6 }}>
                    By{" "}
                    {b.user && (b.user.username || b.user.name)
                      ? b.user.username || b.user.name
                      : "Unknown"}
                  </div>

                  {/* Reactions */}
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 14 }}>
                      {Array.isArray(b.reactions) ? (
                        <>
                          <span style={{ marginRight: 8 }}>
                            ❤️{" "}
                            {
                              b.reactions.filter((r) => r.type === "love")
                                .length
                            }
                          </span>
                          <span style={{ marginRight: 8 }}>
                            👍{" "}
                            {
                              b.reactions.filter((r) => r.type === "thumbs")
                                .length
                            }
                          </span>
                          <span style={{ marginRight: 8 }}>
                            💜{" "}
                            {
                              b.reactions.filter((r) => r.type === "like")
                                .length
                            }
                          </span>
                        </>
                      ) : null}
                    </div>

                    {user ? (
                      <div>
                        {(() => {
                          // determine current user's reaction (if any)
                          let userReaction = null;
                          if (Array.isArray(b.reactions) && user) {
                            const r = b.reactions.find((x) => {
                              const rid =
                                x &&
                                (x.user && x.user._id ? x.user._id : x.user);
                              return String(rid) === String(user._id);
                            });
                            if (r) userReaction = r.type;
                          }

                          const renderBtn = (emoji, type) => {
                            const isActive = userReaction === type;
                            const isLoading = !!reacting[b._id];
                            return (
                              <button
                                key={type}
                                disabled={isLoading}
                                onClick={async () => {
                                  try {
                                    setReacting((s) => ({
                                      ...s,
                                      [b._id]: true,
                                    }));
                                    await apiPost(`/blogs/${b._id}/reactions`, {
                                      type,
                                    });
                                    await load();
                                    toast.success("Reaction saved");
                                  } catch (e) {
                                    toast.error(e.message || "Failed to react");
                                  } finally {
                                    setReacting((s) => ({
                                      ...s,
                                      [b._id]: false,
                                    }));
                                  }
                                }}
                                style={{
                                  marginRight: 6,
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  border: isActive
                                    ? "1px solid var(--deep-purple)"
                                    : "1px solid #ddd",
                                  background: isActive
                                    ? "rgba(103,58,183,0.06)"
                                    : "transparent",
                                  cursor: isLoading ? "not-allowed" : "pointer",
                                }}
                              >
                                {emoji}
                              </button>
                            );
                          };

                          return (
                            <>
                              {renderBtn("💜", "like")}
                              {renderBtn("❤️", "love")}
                              {renderBtn("👍", "thumbs")}
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div style={{ color: "#666" }}>Login to react</div>
                    )}
                  </div>
                </Motion.li>
              ))}
            </ul>

            <div
              style={{
                marginTop: 18,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <button onClick={prev} disabled={page <= 1}>
                Previous
              </button>
              <div>
                Page {page} of {pages}
              </div>
              <button onClick={next} disabled={page >= pages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
