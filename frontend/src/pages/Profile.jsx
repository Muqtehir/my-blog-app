import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/blogs");
          if (res.ok) {
            const blogs = await res.json();
            const userBlogs = (blogs.blogs || blogs || []).filter(
              (b) => b.user === user._id
            );
            setPosts(userBlogs);
          }
        } catch (err) {
          console.error("Failed to fetch posts:", err);
        }
      };
      fetchPosts();
    }
  }, [user]);

  if (loading) return <p className="loading">Loading profile...</p>;

  if (!user)
    return (
      <h2 style={{ color: "red", textAlign: "center" }}>
        You are not logged in.
      </h2>
    );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profileImage || "/default-avatar.png"}
          alt="profile"
          className="profile-pic"
        />

        <div>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>{user.bio || "No bio yet."}</p>
        </div>
      </div>

      <h3>Your Posts</h3>
      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((p) => (
            <div key={p._id} className="post-card">
              <h4>{p.title}</h4>
              <p>{p.content.substring(0, 100)}...</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
