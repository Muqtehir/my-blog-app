import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import Posts from "./pages/Posts";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import "./CreateBlog.css";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "./components/Toast";

function App() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash || "#/";
    return hash.replace(/^#/, "");
  });

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#/, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  let Page = null;
  if (route === "/" || route === "") Page = <Home />;
  else if (route === "/create") Page = <CreateBlog />;
  else if (route.startsWith("/posts/")) {
    const id = route.replace("/posts/", "");
    Page = <PostDetails id={id} />;
  } else if (route.startsWith("/profile/")) {
    const username = route.replace("/profile/", "");
    Page = <Profile username={username} />;
  } else if (route === "/posts") Page = <Posts />;
  else if (route.startsWith("/edit/")) {
    const id = route.replace("/edit/", "");
    Page = <EditPost id={id} />;
  } else if (route === "/login") Page = <Login />;
  else if (route === "/signup") Page = <Signup />;
  else
    Page = (
      <main style={{ padding: 48 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", color: "#fff" }}>
          <h1>Not Found</h1>
          <p>Page "{route}" not found. Use navigation to pick a page.</p>
        </div>
      </main>
    );

  return (
    <div>
      <Toaster position="top-right" />
      <Nav />
      <AnimatePresence mode="wait">
        <motion.div
          key={route}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          {Page}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
