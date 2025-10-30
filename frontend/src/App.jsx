import React, { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./CreateBlog.css";

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
  else if (route === "/posts") Page = <Posts />;
  else if (route === "/login") Page = <Login />;
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
      <Nav />
      {Page}
    </div>
  );
}

export default App;
