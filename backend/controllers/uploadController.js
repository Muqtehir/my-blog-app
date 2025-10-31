let cloudinary;
let streamifier;
try {
  cloudinary = require("cloudinary").v2;
  streamifier = require("streamifier");

  // Configure Cloudinary via env vars in .env
  if (cloudinary && cloudinary.config) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
} catch (err) {
  // Don't crash the server if optional upload dependencies are missing.
  // The upload endpoint will return a clear error message instead.
  cloudinary = null;
  streamifier = null;
  console.warn(
    "Optional upload dependencies not installed: upload endpoint disabled.",
    err && err.message
  );
}

exports.uploadImage = async (req, res) => {
  try {
    if (!cloudinary || !streamifier)
      return res
        .status(501)
        .json({
          message:
            "Image upload not available. Install cloudinary and streamifier.",
        });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const buffer = req.file.buffer;

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blogs" },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.status(200).json({ url: result.secure_url });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
