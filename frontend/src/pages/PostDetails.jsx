import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchComments,
  createComment,
  fetchReactions,
  addReaction,
} from "../services/api";
import "./PostDetails.css";

const emojiTypes = [
  { key: "like", label: "👍" },
  { key: "love", label: "❤️" },
  { key: "fire", label: "🔥" },
  { key: "laugh", label: "😂" },
];

const PostDetails = ({ posts }) => {
  const { id } = useParams();
  const post = posts.find((p) => p.id.toString() === id);

  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [username, setUsername] = useState("Anonymous"); // you can replace with logged-in user
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!post) return;
    setLoading(true);
    async function load() {
      const [c, r] = await Promise.all([
        fetchComments(post.id),
        fetchReactions(post.id),
      ]);
      setComments(c || []);
      setReactions(r || []);
      setLoading(false);
    }
    load();
  }, [post]);

  if (!post) {
    return (
      <div className="post-not-found neon-card">
        <h2>Post not found</h2>
        <Link to="/posts" className="neon-btn">
          ← Back to posts
        </Link>
      </div>
    );
  }

  // reaction counts helper
  const reactionCounts = emojiTypes.reduce((acc, e) => {
    acc[e.key] = reactions.filter((r) => r.type === e.key).length;
    return acc;
  }, {});

  const handleReact = async (type) => {
    // For demo, userId is localStorage token or random
    const userId =
      localStorage.getItem("token") || `anon-${Date.now().toString()}`;
    const payload = { postId: post._id ? post._id : post.id, type, userId };

    const res = await addReaction(payload);
    if (res) {
      // Optimistic refresh: fetch reactions again
      const r = await fetchReactions(post._id ? post._id : post.id);
      setReactions(r || []);
    } else {
      alert("Could not add reaction right now.");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.slice(0, 120),
          url,
        });
      } catch (err) {
        console.error("share error", err);
      }
    } else {
      // fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch {
        alert("Copy failed — please copy the URL manually.");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);

    const body = {
      postId: post._id ? post._id : post.id,
      username,
      text: commentText.trim(),
    };

    const res = await createComment(body);
    if (res) {
      // append comment to UI
      setComments((prev) => [res, ...prev]);
      setCommentText("");
    } else {
      alert("Could not post comment right now.");
    }

    setPosting(false);
  };

  return (
    <div className="post-details-wrapper">
      <article className="neon-card post-details">
        <h1 className="neon-title">{post.title}</h1>
        <p className="neon-date">Published: {post.date}</p>

        {post.image && (
          <img src={post.image} className="post-hero" alt="cover" />
        )}

        <div className="post-body">
          <p>{post.content}</p>
        </div>

        <div className="post-actions">
          <div className="reactions">
            {emojiTypes.map((e) => (
              <button
                key={e.key}
                className="reaction-btn"
                onClick={() => handleReact(e.key)}
                title={e.key}
              >
                <span className="emoji">{e.label}</span>
                <span className="count">{reactionCounts[e.key] || 0}</span>
              </button>
            ))}
          </div>

          <div className="share-group">
            <button className="neon-btn" onClick={handleShare}>
              🔗 Share
            </button>
            <a
              className="neon-btn green"
              href={`https://wa.me/2347032962346?text=${encodeURIComponent(
                post.title + " - " + window.location.href
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              💬 WhatsApp
            </a>
            <button
              className="neon-btn outline"
              onClick={() => {
                navigator.clipboard
                  ?.writeText(window.location.href)
                  .then(() => alert("Copied link!"));
              }}
            >
              📋 Copy Link
            </button>
          </div>
        </div>

        <div className="comments-section">
          <h3>Comments</h3>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="comment-input name"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a thoughtful comment..."
              className="comment-input"
              rows="3"
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="neon-btn" disabled={posting}>
                {posting ? "Posting..." : "Post Comment"}
              </button>
              <button
                type="button"
                className="neon-btn outline"
                onClick={() => {
                  setCommentText("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="comments-list">
            {loading ? (
              <p>Loading comments…</p>
            ) : comments.length === 0 ? (
              <p className="muted">No comments yet — be the first.</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id || c.id}
                  className="comment-item neon-card-small"
                >
                  <div className="comment-header">
                    <strong>{c.username}</strong>
                    <span className="comment-date">
                      {new Date(
                        c.createdAt || c.date || c._createdAt || Date.now()
                      ).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <Link to="/posts" className="neon-btn back">
          ← Back to posts
        </Link>
      </article>
    </div>
  );
};

export default PostDetails;
