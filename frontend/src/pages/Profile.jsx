import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { deleteBlog } from "../services/api";
import "./Profile.css";

function Profile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");

        console.log("BLOG RESPONSE:", res.data);

        // Support any backend shape
        const blogList = Array.isArray(res.data)
          ? res.data
          : res.data.blogs || res.data.allBlogs || [];

        const yourPosts = blogList.filter(
          (p) => (p.user?._id || p.user) === user?._id
        );

        setPosts(yourPosts);
      } catch (err) {
        console.log(err);
      }
    };

    if (user) loadPosts();
  }, [user]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);

        setFormData({
          username: res.data.username || "",
          bio: res.data.bio || "",
          location: res.data.location || "",
          facebook: res.data.facebook || "",
          instagram: res.data.instagram || "",
          twitter: res.data.twitter || "",
        });
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        // Handle both populated user objects and user IDs
        const yourPosts = res.data.blogs.filter(
          (p) =>
            (typeof p.user === "object" ? p.user._id : p.user) === user?._id
        );
        setPosts(yourPosts);
      } catch (err) {
        console.log(err);
      }
    };

    if (user) loadPosts();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const ok = await deleteBlog(postId);
      if (ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        alert("Post deleted.");
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting post.");
    }
  };

  const handleUpdate = async () => {
    try {
      // Build payload with form data
      const payload = { ...formData };

      // If there's a new profile picture, upload it first
      if (profilePic) {
        try {
          const uploadForm = new FormData();
          uploadForm.append("image", profilePic);

          const uploadRes = await axios.post(
            "http://localhost:5000/api/uploads",
            uploadForm,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Use the returned URL
          if (uploadRes.data?.url) {
            payload.profilePic = uploadRes.data.url;
          }
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          alert("Image upload failed. Profile will be updated without image.");
        }
      }

      // Now update the profile with the payload
      const res = await axios.put(
        "http://localhost:5000/api/profile/update",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      alert("Profile Updated!");
    } catch (err) {
      console.log(err);
      alert("Error updating profile. Check console for details.");
    }
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <img
          src={
            user?.profilePic
              ? `http://localhost:5000${user.profilePic}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="profile-img"
        />
        <h2>{user?.username}</h2>
        <p>{user?.bio || "No bio yet."}</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/dashboard" className="manage-posts-btn">
            Manage Posts
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="profile-edit">
        <h2>Edit Profile</h2>

        <label>Profile Picture</label>
        <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />

        <label>Username</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Bio</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} />

        <label>Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        <h3>Social Links</h3>
        <input
          name="facebook"
          placeholder="Facebook URL"
          value={formData.facebook}
          onChange={handleChange}
        />
        <input
          name="instagram"
          placeholder="Instagram URL"
          value={formData.instagram}
          onChange={handleChange}
        />
        <input
          name="twitter"
          placeholder="Twitter URL"
          value={formData.twitter}
          onChange={handleChange}
        />

        <button onClick={handleUpdate}>Save Changes</button>
      </div>

      {/* Posts */}
      <div className="profile-posts">
        <h2>Your Posts</h2>

        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <h3>{post.title}</h3>
                <p>
                  {(post.content && post.content.substring(0, 120) + "...") ||
                    "No content available"}
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button
                    onClick={() => navigate(`/edit/${post._id}`)}
                    style={{
                      flex: 1,
                      padding: "6px 12px",
                      background: "#6a0dad",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    style={{
                      flex: 1,
                      padding: "6px 12px",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
