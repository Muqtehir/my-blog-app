import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditBlog.css";

const EditBlog = ({ posts, updatePost }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = posts.find((p) => p.id.toString() === id);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = (e) => {
    e.preventDefault();

    updatePost(id, { title, content });
    navigate("/dashboard");
  };

  return (
    <div className="edit-container">
      <h2>Edit Post</h2>

      <form onSubmit={handleSubmit} className="edit-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditBlog;
