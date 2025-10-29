import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../services/auth";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) {
        setError("Please login first");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/blogs",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to home page after successful post creation
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Error creating post");
    }
  };

  return (
    <div
      className="create-post"
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      <h1 style={{ color: "#4B0082", marginBottom: "20px" }}>
        Create New Blog Post
      </h1>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="10"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4B0082",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
