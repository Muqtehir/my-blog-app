import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ posts = [], deletePost }) => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Dashboard</h1>

      {posts.length === 0 ? (
        <p className="no-posts">You have not created any posts yet.</p>
      ) : (
        <div className="dashboard-grid">
          {posts.map((post) => (
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
