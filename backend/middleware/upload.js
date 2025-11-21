const multer = require("multer");

// Use memoryStorage so uploaded files are available as `req.file.buffer`
// (required for streaming to Cloudinary in uploadController)
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
