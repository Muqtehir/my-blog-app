import React from "react";

export default function Posts() {
  // Placeholder posts list
  const sample = [
    { id: 1, title: "First post", excerpt: "This is the first sample post." },
    { id: 2, title: "Another post", excerpt: "More example content here." },
  ];

  return (
    <main style={{ padding: 48 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", color: "#fff" }}>
        <h1>Posts</h1>
        <p>List of sample posts (placeholder).</p>
        <ul>
          {sample.map((p) => (
            <li key={p.id} style={{ marginBottom: 12 }}>
              <strong>{p.title}</strong>
              <p style={{ margin: 6 }}>{p.excerpt}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
