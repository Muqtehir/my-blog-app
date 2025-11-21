import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ posts = [], deletePost }) => {
  // Get user id from localStorage (set after login)
  let userId = null;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    userId = user?._id || user?.id || null;
  } catch {
    userId = null;
  }
  // Fallback: try to decode from token if needed (not implemented here)

  // Only show posts created by the logged-in user
  const userPosts = userId
    ? posts.filter(
        (p) =>
          (typeof p.user === "object" ? String(p.user._id) : String(p.user)) ===
          String(userId)
      )
    : [];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Dashboard</h1>

      {userPosts.length === 0 ? (
        <p className="no-posts">You have not created any posts yet.</p>
      ) : (
        <div className="dashboard-grid">
          {userPosts.map((post) => (
            <div key={post.id} className="dashboard-card">
              {post.image && (
                <img src={post.image} alt="cover" className="dashboard-image" />
              )}

              <h3 className="dashboard-post-title">{post.title}</h3>

              <div className="dashboard-actions">
                <Link to={`/edit/${post.id}`} className="edit-btn">
                  Edit
                </Link>

                <button
                  onClick={() => deletePost(post.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
