import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;
  if (posts.length === 0) return <p>No posts yet...</p>;

  return (
    <div className="home">
      <h1>My Blog</h1>
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
