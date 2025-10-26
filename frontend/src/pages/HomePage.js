import React, { useEffect, useState } from "react";
import API from "../services/api";

function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Blog</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#fff",
            }}
          >
            <h2 style={{ color: "#4B0082" }}>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>Asalamu Alaykum...</p>
      )}
    </div>
  );
}

export default HomePage;
