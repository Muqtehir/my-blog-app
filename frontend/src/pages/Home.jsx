import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    async function load() {
      setError(null);
      try {
        const q = searchQuery
          ? `&search=${encodeURIComponent(searchQuery)}`
          : "";
        const data = await apiGet(`/blogs?page=${page}&limit=6${q}`);
        const items = Array.isArray(data) ? data : data.blogs || [];
        if (mounted) setBlogs(items);
        if (mounted) setPages(data.pages || 1);
        if (mounted) setLoading(false);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load");
        if (mounted) setLoading(false);
      }
    }
    load();
    const onSearch = (e) => {
      const q = (e && e.detail && e.detail.q) || "";
      setSearchQuery(q);
      setPage(1);
    };
    window.addEventListener("search:query", onSearch);
    return () => {
      mounted = false;
      window.removeEventListener("search:query", onSearch);
    };
  }, [page, searchQuery]);

  const next = () => setPage((p) => Math.min(p + 1, pages));
  const prev = () => setPage((p) => Math.max(1, p - 1));

  return (
    <main style={{ padding: 48 }}>
      <div
        style={{ maxWidth: 900, margin: "0 auto", color: "var(--text-gray)" }}
      >
        <h1 style={{ marginTop: 0 }}>Latest posts</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {!loading && !error && (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {blogs.map((b) => (
                <li key={b._id} style={{ marginBottom: 18 }}>
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
                  {b.image && (
                    <div style={{ marginTop: 8 }}>
                      <img
                        src={b.image}
                        alt="thumb"
                        style={{ maxWidth: 320 }}
                      />
                    </div>
                  )}
                  <div style={{ color: "#666", marginTop: 6 }}>
                    {b.content.slice(0, 180)}
                    {b.content.length > 180 ? "..." : ""}
                  </div>
                  <div style={{ fontSize: 13, color: "#999", marginTop: 6 }}>
                    By {b.user && b.user.username ? b.user.username : "Unknown"}
                  </div>
                </li>
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
