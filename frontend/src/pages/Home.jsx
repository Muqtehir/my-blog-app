import React, { useEffect, useState } from "react";
import API from "../services/api";
import BlogPost from "../components/BlogPost";
import ScrollTop from "../components/ScrollTop";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 6 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, when: "beforeChildren" },
  },
  exit: { opacity: 0, y: -6 },
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      try {
        const res = await API.get("/blogs");
        if (!mounted) return;
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to load posts");
        setLoading(false);
      }
    };

    fetchPosts();
    return () => (mounted = false);
  }, []);

  return (
    <motion.main
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={containerVariants}
      className="app-container"
    >
      <motion.h1
        className="fade-in"
        style={{
          textAlign: "center",
          color: "var(--deep-purple)",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        My Blog
      </motion.h1>

      {loading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          Loading posts...
        </div>
      )}
      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <section className="posts-grid" style={{ marginTop: 18 }}>
          {posts.length === 0 && (
            <div style={{ textAlign: "center" }}>No posts yet...</div>
          )}
          {posts.map((post) => (
            <BlogPost key={post._id} post={post} />
          ))}
        </section>
      )}

      <ScrollTop />
    </motion.main>
  );
};

export default Home;
