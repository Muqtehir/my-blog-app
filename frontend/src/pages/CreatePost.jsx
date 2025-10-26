import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/posts", { title, content });
      setMessage("Post added successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      setMessage("Error creating post.");
    }
  };

  return (
    <div className="create-post">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Add Post</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePost;
