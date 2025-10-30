import React, { useEffect, useState } from "react";
import { apiGet, apiDelete } from "../services/api";

export default function Posts() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const data = await apiGet('/blogs');
      setBlogs(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await apiDelete(`/blogs/${id}`);
      load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <main style={{ padding: 48 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", color: "var(--text-gray)" }}>
        <h1>Posts</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {blogs.map((b) => (
              <li key={b._id} style={{ marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--deep-purple)' }}>{b.title}</strong>
                  <div>
                    <button onClick={() => (window.location.hash = '#/create')} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => onDelete(b._id)}>Delete</button>
                  </div>
                </div>
                <div style={{ color: '#666', marginTop: 6 }}>{b.content}</div>
                <div style={{ fontSize: 13, color: '#999', marginTop: 6 }}>By {b.user && b.user.username ? b.user.username : 'Unknown'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
