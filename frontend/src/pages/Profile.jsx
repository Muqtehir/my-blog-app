import React, { useEffect, useState } from "react";
import { apiGet } from "../services/api";

export default function Profile({ username }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError(null);
      try {
        const data = await apiGet(`/users/${username}`);
        if (!mounted) return;
        setProfile(data.user || null);
        setPosts(data.posts || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [username]);

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

  return (
    <main style={{ padding: 48 }}>
      <div
        style={{ maxWidth: 900, margin: "0 auto", color: "var(--text-gray)" }}
      >
        <h1>{profile.username}</h1>
        <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>

        <h2 style={{ marginTop: 24 }}>Posts</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {posts.map((p) => (
            <li key={p._id} style={{ marginBottom: 18 }}>
              <a
                href={`#/posts/${p._id}`}
                style={{ color: "var(--deep-purple)", fontWeight: 700 }}
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
