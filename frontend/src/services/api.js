// src/services/api.js
const API_BASE_URL = "http://localhost:5000";
const API_BASE = API_BASE_URL;

// COMMENTS
// Backend exposes comments as part of blog details: GET /api/blogs/:id
export async function fetchComments(postId) {
  try {
    const res = await fetch(`${API_BASE}/api/blogs/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch blog details");
    const data = await res.json();
    // backend returns blog object; comments field may be present
    return data.comments || data.blog?.comments || [];
  } catch (err) {
    console.error("fetchComments error:", err);
    return [];
  }
}

export async function createComment(payload) {
  try {
    // payload may be { postId, username, text } or similar
    const postId = payload.postId || payload.blogId || payload.id;
    if (!postId) throw new Error("Missing postId for comment");

    const body = {
      name: payload.username || payload.name || "Anonymous",
      content: payload.text || payload.content || "",
    };

    const res = await fetch(`${API_BASE}/api/blogs/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
    const res = await fetch(`${API_BASE}/api/blogs/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch blog details");
    const data = await res.json();
    return data.reactions || data.blog?.reactions || [];
  } catch (err) {
    console.error("fetchReactions error:", err);
    return [];
  }
}

export async function addReaction(payload) {
  try {
    // payload should include postId and type
    const postId = payload.postId || payload.blogId || payload.id;
    if (!postId) throw new Error("Missing postId for reaction");

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/api/blogs/${postId}/reactions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ type: payload.type }),
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

// Update a blog post
export async function updateBlog(postId, blogData) {
  try {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/blogs/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(blogData),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to update blog");
    }

    return await res.json();
  } catch (err) {
    console.error("updateBlog error:", err);
    return null;
  }
}

// Delete a blog post
export async function deleteBlog(postId) {
  try {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/blogs/${postId}`, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to delete blog");
    }

    return true;
  } catch (err) {
    console.error("deleteBlog error:", err);
    return false;
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
