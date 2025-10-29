import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavigationBar from "./components/Navigation";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { isAuthenticated } from "./services/auth";
import "./index.css";

function AppRoutes({ authed }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={authed ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={authed ? <Home /> : <Navigate to="/" />} />
        <Route
          path="/create"
          element={authed ? <CreatePost /> : <Navigate to="/" />}
        />
        <Route
          path="/edit/:id"
          element={authed ? <EditPost /> : <Navigate to="/" />}
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const authed = isAuthenticated();

  return (
    <Router>
      <NavigationBar />
      <div className="content">
        <AppRoutes authed={authed} />
      </div>
    </Router>
  );
}

export default App;
