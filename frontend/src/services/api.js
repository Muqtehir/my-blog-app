// src/services/api.js
const API_BASE_URL = "http://localhost:5000";
const API_BASE = API_BASE_URL;

// COMMENTS
export async function fetchComments(postId) {
  try {
    const res = await fetch(`${API_BASE}/api/comments/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch comments");
    return await res.json();
  } catch (err) {
    console.error("fetchComments error:", err);
    return [];
  }
}

export async function createComment(comment) {
  try {
    const res = await fetch(`${API_BASE}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error("Failed to post comment");
    return await res.json();
  } catch (err) {
    console.error("createComment error:", err);
    return null;
  }
}

// REACTIONS
export async function fetchReactions(postId) {
  try {
    const res = await fetch(`${API_BASE}/api/reactions/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch reactions");
    return await res.json();
  } catch (err) {
    console.error("fetchReactions error:", err);
    return [];
  }
}

export async function addReaction(reaction) {
  try {
    const res = await fetch(`${API_BASE}/api/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reaction),
    });
    if (!res.ok) throw new Error("Failed to add reaction");
    return await res.json();
  } catch (err) {
    console.error("addReaction error:", err);
    return null;
  }
}

// 🧠 BLOG ROUTES (use backend /api/blogs)
export async function getPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs`);
    const data = await response.json();
    // backend returns { blogs, page, pages, total } — return the blogs array when present
    if (data && Array.isArray(data)) return data;
    if (data && Array.isArray(data.blogs)) return data.blogs;
    return [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function createBlog(blogData) {
  try {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: "POST",
      headers,
      body: JSON.stringify(blogData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error creating blog:", error);
    return null;
  }
}

// 🧩 AUTH ROUTES
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
  }
}

export async function loginUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
  }
}
