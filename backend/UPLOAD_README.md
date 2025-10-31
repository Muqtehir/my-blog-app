Image upload (Cloudinary) setup

This project supports image uploads via Cloudinary. The server exposes a protected endpoint:

POST /api/uploads

Request: multipart/form-data with field `image` (single file). The endpoint is protected by JWT; include `Authorization: Bearer <token>`.
Response: { url: "https://..." }

Setup steps:

1. Install new dependencies in the backend folder:

   npm install cloudinary multer streamifier

2. Add these environment variables to your `.env` in the backend folder:

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

3. Restart the backend server (dev):

   npm run dev

Notes:

- The upload route stores files in your Cloudinary account under the `blogs/` folder.
- Create/Edit pages in the frontend now upload selected images to this endpoint and attach the returned URL to the blog record.
- If you prefer client-side direct uploads (unsigned), that can be implemented instead; let me know and I can convert it.
