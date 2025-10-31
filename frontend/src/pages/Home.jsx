import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError(null);
      try {
        const data = await apiGet("/blogs");
        if (mounted) setBlogs(data || []);
        if (mounted) setLoading(false);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load");
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main style={{ padding: 48 }}>
      <div
        style={{ maxWidth: 900, margin: "0 auto", color: "var(--text-gray)" }}
      >
        <h1 style={{ marginTop: 0 }}>Latest posts</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {!loading && !error && (
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
        )}
      </div>
    </main>
  );
}
