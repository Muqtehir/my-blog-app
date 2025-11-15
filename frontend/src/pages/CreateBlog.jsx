import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateBlog.css";
import { createBlog } from "../services/api";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // handle form submit
  const [loading, setLoading] = useState(false);

  // handle form submit with better error handling and logging
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in all fields before publishing.");
      return;
    }

    setLoading(true);

    // Build payload for backend. Backend `createBlog` accepts: title, content, image, tags
    const payload = {
      title,
      content,
      image: preview || null,
    };

    try {
      const res = await createBlog(payload);
      console.log("createBlog response:", res);

      if (res && (res._id || res.blog)) {
        // Success -> navigate to posts
        navigate("/posts");
      } else {
        const msg = (res && res.message) || "Failed to create blog";
        alert(msg);
      }
    } catch (err) {
      console.error("Error calling createBlog:", err);
      alert("An unexpected error occurred. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create a New Blog</h2>
      <form onSubmit={handleSubmit} className="create-blog-form">
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
          rows="8"
          required
        />

        <label className="file-label">
          Upload a cover image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button type="submit" className="publish-btn" disabled={loading}>
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
