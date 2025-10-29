import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/blogs/${id}`, { title, content });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
      <h2>Edit Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        />
        <button
          type="submit"
          style={{
            padding: 10,
            background: "#4B0082",
            color: "white",
            border: "none",
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditPost;
