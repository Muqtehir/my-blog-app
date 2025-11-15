import React, { useEffect, useState } from "react";
import "./EditProfile.css";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setImagePreview(data.profileImage);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    loadUser();
  }, [token]);

  if (!user) return <p>Loading...</p>;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));

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
        setUser({ ...user, profileImage: data.url });
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  const handleSave = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          bio: user.bio,
          phone: user.phone,
          location: user.location,
          profileImage: user.profileImage,
        }),
      });
      if (res.ok) {
        alert("Profile updated!");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Error saving profile");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      <div className="image-upload">
        <img src={imagePreview} alt="profile" className="profile-preview" />
        <input type="file" onChange={handleImageUpload} />
      </div>

      <input
        type="text"
        placeholder="Username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />

      <textarea
        placeholder="Bio"
        value={user.bio}
        onChange={(e) => setUser({ ...user, bio: e.target.value })}
      ></textarea>

      <input
        type="text"
        placeholder="Phone"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />

      <input
        type="text"
        placeholder="Location"
        value={user.location}
        onChange={(e) => setUser({ ...user, location: e.target.value })}
      />

      <button onClick={handleSave} className="save-btn">
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
