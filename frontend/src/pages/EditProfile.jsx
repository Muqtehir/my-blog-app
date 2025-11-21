import React, { useEffect, useState } from "react";
import "./EditProfile.css";
import Toast from "../components/Toast";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers,
        });
        const data = await res.json();
        setUser(data);
        setImagePreview(data.profilePic || data.profileImage || "");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [token]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setUploadError("");
      const formData = new FormData();
      formData.append("image", file);

      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://localhost:5000/api/uploads", {
          method: "POST",
          headers,
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          setImagePreview(data.url);
          setUser({ ...user, profilePic: data.url });
          setToast({
            message: "Image uploaded successfully!",
            type: "success",
          });
        } else {
          const errorMsg = "Failed to upload image. Please try again.";
          setUploadError(errorMsg);
          setToast({ message: errorMsg, type: "error" });
        }
      } catch (err) {
        console.error("Failed to upload image:", err);
        const errorMsg = err.message || "Upload failed. Check your connection.";
        setUploadError(errorMsg);
        setToast({ message: errorMsg, type: "error" });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        username: user.username,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        profilePic: user.profilePic,
      };

      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setToast({ message: "Profile updated successfully!", type: "success" });
      } else {
        const errorData = await res.json();
        const errorMsg = errorData.message || "Failed to update profile";
        setError(errorMsg);
        setToast({ message: errorMsg, type: "error" });
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      const errorMsg =
        err.message || "Error saving profile. Check your connection.";
      setError(errorMsg);
      setToast({ message: errorMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
      <div className="edit-profile-container">
        <div className="edit-header">
          <h2>Edit Profile</h2>
          <p className="sub">Change your public info and profile picture</p>
        </div>

        <div className="edit-card">
          <div className="left">
            <div className="image-upload">
              <img
                src={imagePreview}
                alt="profile"
                className="profile-preview"
              />
              <label className="upload-label">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <span
                  className="upload-btn"
                  style={{ opacity: uploading ? 0.6 : 1 }}
                >
                  {uploading ? "Uploading..." : "Change Photo"}
                </span>
              </label>
              {uploadError && <p className="error-text">{uploadError}</p>}
              <p className="image-hint">Recommended: 400x400px • JPG or PNG</p>
            </div>
          </div>

          <div className="right">
            <div className="edit-profile-form">
              <div className="form-row">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <label>Bio</label>
                <textarea
                  placeholder="Bio"
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                ></textarea>
              </div>

              <div className="two-col">
                <div className="form-row">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="Phone"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                  />
                </div>

                <div className="form-row">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={user.location}
                    onChange={(e) =>
                      setUser({ ...user, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                {error && <p className="error-text">{error}</p>}
                <button
                  onClick={handleSave}
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => window.location.assign("/profile")}
                  className="cancel-btn"
                  type="button"
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
