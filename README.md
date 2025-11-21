# My Blog App

A full-stack blog application built with **Node.js/Express** (backend) and **React/Vite** (frontend) with MongoDB, JWT authentication, and Cloudinary image uploads.

---

## Features

✅ **User Authentication**

- Register and login with JWT tokens
- Password hashing with bcryptjs
- Protected routes with authentication middleware

✅ **Blog Management**

- Create, read, update, and delete blog posts
- Add comments and reactions to posts
- View user's published posts

✅ **User Profiles**

- Edit profile information (username, bio, location, social links)
- Upload and store profile pictures on Cloudinary
- View public user profiles

✅ **Image Uploads**

- Stream images directly to Cloudinary (no local file storage)
- Secure upload endpoint with JWT authentication
- Profile picture support with Cloudinary URL storage

✅ **Modern UI**

- Responsive two-column layout for profile editing
- Dark mode support (DarkModeToggle component)
- Clean, modern styling with CSS

---

## Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for multipart form data (memory storage)
- **Cloudinary** for image hosting
- **Streamifier** for streaming file buffers

### Frontend

- **React** 18+ with Vite bundler
- **Axios** for HTTP requests
- **CSS3** with responsive design
- **ES6+ JavaScript**

---

## Project Structure

```
my blog app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js     # User auth & profile
│   │   ├── blogController.js     # Blog CRUD
│   │   ├── postController.js     # Post handling
│   │   ├── profileController.js  # Additional profile logic
│   │   └── uploadController.js   # Cloudinary uploads
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── upload.js             # Multer memory storage
│   ├── models/
│   │   ├── userModel.js          # User schema with auth
│   │   ├── blogModel.js          # Blog schema
│   │   └── postModel.js          # Post schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── blogRoutes.js         # Blog endpoints
│   │   ├── uploadRoutes.js       # Image upload endpoint
│   │   ├── profileRoutes.js      # Profile update endpoint
│   │   ├── postRoutes.js         # Post endpoints
│   │   └── profileRoutes.js      # Profile endpoints
│   ├── uploads/                  # (Optional) local file uploads
│   ├── package.json
│   └── server.js                 # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── AuthButton.jsx    # Login/logout button
│   │   │   └── DarkModeToggle.jsx # Theme switcher
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Home page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Profile.jsx       # User profile with edit
│   │   │   ├── EditProfile.jsx   # Profile editor (modern layout)
│   │   │   ├── Posts.jsx         # Posts listing
│   │   │   ├── PostDetails.jsx   # Single post view
│   │   │   ├── CreateBlog.jsx    # Create new post
│   │   │   ├── EditBlog.jsx      # Edit existing post
│   │   │   ├── About.jsx         # About page
│   │   │   └── Contact.jsx       # Contact page
│   │   ├── services/
│   │   │   └── api.js            # API helper functions
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md                     # This file
```

---

## Setup Instructions

### Prerequisites

- **Node.js** v16+ (v22 recommended)
- **MongoDB** (local or Atlas connection string)
- **Cloudinary** account (free tier: https://cloudinary.com/users/register/free)
- **npm** package manager

### 1. Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file in the `backend/` directory:**

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogdb?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**To get Cloudinary credentials:**

1. Sign up at https://cloudinary.com
2. Go to Dashboard → Settings → API Keys
3. Copy your Cloud Name, API Key, and API Secret

**Start backend:**

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Start frontend dev server:**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default)

---

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token
- `GET /api/users/me` - Get current user (protected)

### Profile

- `GET /api/profile/me` - Get logged-in user's profile (protected)
- `PUT /api/profile/update` - Update profile (protected)
  - Accepts: `username`, `bio`, `phone`, `location`, `profilePic`, `facebook`, `instagram`, `twitter`

### Uploads

- `POST /api/uploads` - Upload image to Cloudinary (protected)
  - Form field name: `image`
  - Returns: `{ url: "cloudinary_url" }`

### Blogs

- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (protected)
- `GET /api/blogs/:id` - Get single blog
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)
- `POST /api/blogs/:id/comments` - Add comment (protected)
- `GET /api/blogs/:id/comments` - Get blog comments
- `POST /api/blogs/:id/reactions` - Add reaction (protected)
- `GET /api/blogs/:id/reactions` - Get blog reactions

### Users

- `GET /api/users/:username` - Get public user profile
- `GET /api/users` - List all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only, protected)

---

## Usage

### 1. Register a New Account

- Go to `/register`
- Fill in username, email, password
- Click "Register"
- Auto-redirects to login

### 2. Login

- Go to `/login`
- Enter email and password
- Click "Login"
- JWT token is stored in localStorage

### 3. Edit Your Profile

- Click "Edit Profile" (or navigate to `/edit-profile`)
- **Upload profile picture:** Click "Change Photo", select file, click the upload button
  - Image is streamed to Cloudinary and URL is set immediately
- **Update profile info:** Edit username, bio, phone, location, and social links
- **Save:** Click "Save Changes" to persist all changes to database

### 4. Create a Blog Post

- Go to `/create-blog`
- Fill in title, content, and optional tags
- Click "Create"
- Post appears on your profile

### 5. View and Interact with Posts

- Go to `/posts` to see all blog posts
- Click a post to view details
- Add comments and reactions (if logged in)

### 6. View User Profiles

- Click on a username anywhere in the app to visit their public profile
- See their published posts and profile information

---

## Features in Detail

### Image Uploads (Cloudinary Integration)

- **Profile Picture Upload:**

  - User selects file on Edit Profile page
  - File is uploaded to `POST /api/uploads` with JWT auth
  - Backend streams file buffer to Cloudinary using `streamifier`
  - Cloudinary returns secure URL
  - URL is saved to user's `profilePic` field in MongoDB
  - Image is immediately displayed in the app

- **No Local Storage:** Images are not stored locally; all uploads go directly to Cloudinary for reliability and scalability

### Authentication Flow

- User registers with email, password, and username
- Password is hashed with bcryptjs (10 salt rounds) before storage
- Login returns a JWT token (1-hour expiry)
- Token is stored in browser localStorage
- Token is sent in `Authorization: Bearer <token>` header for protected endpoints
- Server validates token with middleware before allowing access

### Profile Updates

- User can update multiple fields at once:
  - Text fields: username, bio, phone, location, social links
  - Image: profilePic (uploaded via Cloudinary)
- Updates are sent as JSON POST to `/api/profile/update`
- Only non-undefined fields are updated in the database (partial updates)

---

## Troubleshooting

### "Image upload not available"

- Check that `cloudinary` and `streamifier` npm packages are installed in backend
- Verify Cloudinary env vars are set correctly in `.env`

### "Unauthorized" error on profile update

- Ensure JWT token is valid and not expired
- Check `Authorization` header is correctly formatted: `Bearer <token>`
- Log out and log in again to get a fresh token

### Login returns 500 error

- Ensure MongoDB is running and connection string is correct
- Check that user exists in database with correct email
- Verify password field is selected with `.select("+password")` in controller

### Cloudinary uploads fail silently

- Verify API credentials (cloud_name, api_key, api_secret) are correct
- Check that bucket/folder "blogs" is writable in Cloudinary settings
- Check browser console and server logs for detailed error messages

### Frontend can't reach backend

- Ensure backend is running on `http://localhost:5000`
- Check CORS is enabled in `server.js`
- Verify no firewall is blocking port 5000

---

## Development

### Run both servers (two terminal windows)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Build for Production

**Backend:** (No build needed; runs directly with Node.js)

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

---

## Environment Variables

### Backend (.env)

| Variable                | Description               | Example                                          |
| ----------------------- | ------------------------- | ------------------------------------------------ |
| `MONGO_URI`             | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT`                  | Server port               | `5000`                                           |
| `NODE_ENV`              | Environment               | `development` or `production`                    |
| `JWT_SECRET`            | Secret for signing JWTs   | `your_secret_key_here`                           |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | `dxxxxx`                                         |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | `123456789`                                      |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | `abcdefghijk`                                    |

---

## Common Issues & Fixes

| Issue                     | Solution                                                                     |
| ------------------------- | ---------------------------------------------------------------------------- |
| Port 5000 already in use  | Change `PORT` in `.env` or kill process: `lsof -ti:5000 \| xargs kill -9`    |
| Cannot connect to MongoDB | Check connection string, ensure cluster IP is whitelisted                    |
| Uploads return 501 error  | Install `cloudinary` and `streamifier`: `npm install cloudinary streamifier` |
| JWT expires quickly       | Token expiry is set to 1 hour in `userModel.js`; login again if expired      |
| CORS errors               | Ensure `cors` middleware is enabled in `server.js`                           |

---

## Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Blog post search and filtering
- [ ] Follow/unfollow users
- [ ] Like/save blog posts
- [ ] Notifications system
- [ ] Admin dashboard
- [ ] Rate limiting on uploads
- [ ] Image cropping before upload
- [ ] Markdown editor for blog posts

---

## License

MIT License - Feel free to use this project for learning and personal use.

---

## Support

For issues or questions:

1. Check the **Troubleshooting** section above
2. Review backend logs: `npm run dev` output
3. Check browser console (F12 → Console tab)
4. Verify all `.env` variables are set correctly

---

**Happy blogging! 🎉**
