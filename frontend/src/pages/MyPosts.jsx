import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { createBlog, deleteBlog } from "../services/api";
import "./MyPosts.css";

const MyPosts = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create blog form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [creating, setCreating] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [token, navigate]);

  // Fetch user's posts
  useEffect(() => {
    if (!user) return;

    const fetchMyPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allBlogs = res.data.blogs || res.data || [];
        // Filter posts created by this user
        const userPosts = allBlogs.filter(
          (blog) =>
            (blog.user?._id || blog.user) === user._id ||
            blog.user?.username === user.username
        );

        setMyPosts(userPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user, token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in title and content.");
      return;
    }

    setCreating(true);

    const payload = {
      title,
      content,
      image: preview || null,
    };

    try {
      const res = await createBlog(payload);

      if (res && (res._id || res.blog)) {
        // Add to UI
        setMyPosts((prev) => [res, ...prev]);
        // Reset form
        setTitle("");
        setContent("");
        setImage(null);
        setPreview(null);
        alert("Blog published successfully!");
      } else {
        alert(res?.message || "Failed to create blog");
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("An error occurred. Check console for details.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const ok = await deleteBlog(postId);
      if (ok) {
        setMyPosts((prev) => prev.filter((p) => p._id !== postId));
        alert("Post deleted successfully!");
      } else {
        alert("Failed to delete post.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error deleting post.");
    }
  };

  if (!token) return null; // Redirect guard

  if (loading) return <div className="my-posts-container">Loading...</div>;

  return (
    <div className="my-posts-container">
      <div className="my-posts-header">
        <h1>My Posts</h1>
        <p className="greeting">Welcome back, {user?.username}!</p>
      </div>

      <div className="my-posts-layout">
        {/* Create Blog Section */}
        <div className="create-blog-card">
          <h2>Create a New Post</h2>
          <form onSubmit={handleCreateBlog} className="create-blog-form">
            <input
              type="text"
              placeholder="Enter your blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Write your blog content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              required
            />

            <label className="file-label">
              Upload a cover image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="remove-image-btn"
                >
                  ✕ Remove
                </button>
              </div>
            )}

            <button type="submit" className="publish-btn" disabled={creating}>
              {creating ? "Publishing..." : "Publish Blog"}
            </button>
          </form>
        </div>

        {/* My Posts List */}
        <div className="my-posts-list">
          <h2>Your Posts ({myPosts.length})</h2>

          {myPosts.length === 0 ? (
            <div className="no-posts">
              <p>
                You haven't published any posts yet. Start writing above! 📝
              </p>
            </div>
          ) : (
            <div className="posts-grid">
              {myPosts.map((post) => (
                <div key={post._id} className="post-card">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="post-img"
                    />
                  )}
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p className="post-excerpt">
                      {post.content.slice(0, 100)}...
                    </p>
                    <p className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <div className="post-actions">
                      <Link to={`/posts/${post._id}`} className="view-btn">
                        View
                      </Link>
                      <Link to={`/edit/${post._id}`} className="edit-btn">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
