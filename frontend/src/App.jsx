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
import DarkModeToggle from "./components/DarkModeToggle";

// API
import { getPosts } from "./services/api";
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
        <Route path="/register" element={<Register />} />
        <Route path="/create-blog" element={<CreateBlog addPost={addPost} />} />
        <Route path="/create" element={<CreateBlog addPost={addPost} />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
        }));
        setPosts(transformed);
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
  const deletePost = (id) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== id));
  };

  // Function to update a post
  const updatePost = (id, updatedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id.toString() === id.toString() ? { ...p, ...updatedData } : p
      )
    );
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
