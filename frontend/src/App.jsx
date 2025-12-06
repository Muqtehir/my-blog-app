import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateBlog from "./pages/CreateBlog";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PostDetails from "./pages/PostDetails";
import EditBlog from "./pages/EditBlog";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyPosts from "./pages/MyPosts";
import DarkModeToggle from "./components/DarkModeToggle";

// API
import { getPosts, updateBlog, deleteBlog } from "./services/api";
// AppLayout: shows Navbar on all pages except login/register
const AppLayout = ({ posts, addPost, deletePost, updatePost }) => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home posts={posts} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/create-blog" element={<CreateBlog addPost={addPost} />} />
        <Route path="/create" element={<CreateBlog addPost={addPost} />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/posts/:id" element={<PostDetails posts={posts} />} />
        <Route path="/posts" element={<Posts posts={posts} />} />
        <Route
          path="/dashboard"
          element={<Dashboard posts={posts} deletePost={deletePost} />}
        />
        <Route
          path="/edit/:id"
          element={<EditBlog posts={posts} updatePost={updatePost} />}
        />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </>
  );
};

const App = () => {
  // State to hold all blog posts
  const [posts, setPosts] = useState([]);

  // Fetch blogs from backend on mount and convert format
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await getPosts();
        // Transform backend format { _id, createdAt } to frontend format { id, date }
        const transformed = (blogs || []).map((blog) => ({
          id: blog._id,
          title: blog.title,
          content: blog.content,
          image: blog.image,
          date: blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString()
            : "Unknown",
          user: blog.user, // <-- Add this line
        }));
        setPosts(transformed);
        // Debugging: show posts and stored user to help diagnose dashboard filtering
        try {
          console.log("[App] fetched posts:", transformed);
          console.log(
            "[App] stored user:",
            JSON.parse(localStorage.getItem("user"))
          );
        } catch (e) {
          console.log("[App] debug log error", e);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // Function to add new post (called after successful create)
  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Function to delete a post
  const deletePost = async (id) => {
    try {
      // call backend to delete
      const ok = await deleteBlog(id);
      if (ok) {
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== id));
      } else {
        alert("Could not delete post on server.");
      }
    } catch (err) {
      console.error("deletePost error:", err);
      alert("Error deleting post. Check console for details.");
    }
  };

  // Function to update a post (sends update to backend)
  const updatePost = async (id, updatedData) => {
    try {
      const res = await updateBlog(id, updatedData);
      if (res) {
        // reflect server response (or optimistic merge)
        const updated = {
          id: res._id || id,
          title: res.title || updatedData.title,
          content: res.content || updatedData.content,
          image: res.image || updatedData.image,
          date: res.createdAt || updatedData.date,
        };

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id.toString() === id.toString() ? { ...p, ...updated } : p
          )
        );
        return true;
      }
      alert("Could not update post on server.");
      return false;
    } catch (err) {
      console.error("updatePost error:", err);
      alert("Error updating post. Check console for details.");
      return false;
    }
  };

  return (
    <>
      <Router>
        <AppLayout
          posts={posts}
          addPost={addPost}
          deletePost={deletePost}
          updatePost={updatePost}
        />
      </Router>
      <DarkModeToggle />
    </>
  );
};

export default App;
