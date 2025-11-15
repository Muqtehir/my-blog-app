// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // PROFILE DATA
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    location: { type: String, default: "" },
    profession: { type: String, default: "" },

    social: {
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
