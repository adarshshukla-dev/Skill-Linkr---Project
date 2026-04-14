# 🚀 Skill Linkr — Backend Setup Guide

Node.js + Express + MongoDB Atlas + Render Deployment

---

## 📁 Folder Structure

```
skilllinkr-backend/
├── server.js              ← Main entry point
├── package.json
├── .env.example           ← Copy to .env
├── api.js                 ← Frontend helper (copy to frontend folder)
├── models/
│   ├── User.js            ← Student & Client schema
│   ├── Project.js         ← Project schema
│   └── Application.js     ← Application schema
├── routes/
│   ├── auth.js            ← Register & Login
│   ├── projects.js        ← Project CRUD
│   ├── applications.js    ← Apply, hire, review
│   ├── students.js        ← Student profiles
│   └── clients.js         ← Client profiles
└── middleware/
    └── auth.js            ← JWT protection
```

---

## ⚙️ STEP 1 — Setup MongoDB Atlas (Free)

1. Go to **https://cloud.mongodb.com** → Sign up free
2. Click **"Build a Database"** → Choose **M0 Free Tier**
3. Choose region: **Mumbai (ap-south-1)** (fastest from India)
4. Create username & password (save these!)
5. In **Network Access** → Click **"Add IP Address"** → Select **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Click **Connect** → **Drivers** → Copy the connection string

Your connection string looks like:
```
mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

Change it to:
```
mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/skilllinkr?retryWrites=true&w=majority
```
(Add `/skilllinkr` before the `?`)

---

## ⚙️ STEP 2 — Setup Backend Locally

```bash
# 1. Go into the backend folder
cd skilllinkr-backend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Open .env and fill in:
#    MONGO_URI=your MongoDB Atlas connection string
#    JWT_SECRET=any long random string

# 5. Run the server
npm run dev

# You should see:
# ✅ MongoDB Atlas connected successfully
# 🚀 Server running on port 5000
```

Test it: Open **http://localhost:5000** in your browser.
You should see: `{ "message": "🚀 Skill Linkr API is running!" }`

---

## ⚙️ STEP 3 — Deploy to Render (Free)

### 3a. Push code to GitHub

```bash
# In the backend folder:
git init
git add .
git commit -m "Initial Skill Linkr backend"

# Create a new repo on github.com → copy the URL
git remote add origin https://github.com/YOUR_USERNAME/skilllinkr-backend.git
git branch -M main
git push -u origin main
```

### 3b. Deploy on Render

1. Go to **https://render.com** → Sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub → Select **skilllinkr-backend** repo
4. Fill in:
   - **Name**: `skilllinkr-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Scroll to **Environment Variables** → Add:
   ```
   MONGO_URI     = (your MongoDB Atlas URI)
   JWT_SECRET    = (your secret key)
   JWT_EXPIRES_IN = 7d
   FRONTEND_URL  = https://skilll-linkr.vercel.app
   ```
6. Click **"Create Web Service"**

Wait 2–3 minutes. Your backend URL will be:
```
https://skilllinkr-backend.onrender.com
```

---

## ⚙️ STEP 4 — Connect Frontend to Backend

1. Copy `api.js` from this folder to your frontend folder (where `index.html` is)

2. Open `api.js` and change line 4:
```js
const API_BASE = 'https://skilllinkr-backend.onrender.com/api';
//                ⬆️ Your actual Render URL
```

3. Add `<script src="api.js"></script>` to each HTML page before `</body>`

4. Now connect the login form in `login.html`:
```js
// Example: connect doLogin() to real backend
async function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const pw    = document.getElementById('loginPassword').value;
  try {
    const data = await login(email, pw, role);  // from api.js
    redirectToDashboard();                       // from api.js
  } catch (err) {
    showError(err.message);
  }
}
```

5. Connect register forms similarly using `registerStudent()` and `registerClient()`.

---

## 🌐 API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/student` | Register student |
| POST | `/api/auth/register/client`  | Register client  |
| POST | `/api/auth/login`            | Login (both)     |
| GET  | `/api/auth/me`               | Get current user (requires token) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects`                   | Browse open projects (public) |
| GET    | `/api/projects/:id`               | Single project detail |
| POST   | `/api/projects`                   | Post project (client only) |
| PUT    | `/api/projects/:id`               | Edit project |
| DELETE | `/api/projects/:id`               | Delete project |
| GET    | `/api/projects/client/my-projects`| Client's projects |
| PUT    | `/api/projects/:id/hire/:studentId` | Hire student |
| PUT    | `/api/projects/:id/release-payment` | Release payment |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/:projectId`       | Apply to project (student) |
| GET  | `/api/applications/my`               | My applications (student) |
| GET  | `/api/applications/project/:id`      | Project applicants (client) |
| PUT  | `/api/applications/:id/status`       | Update status (client) |
| POST | `/api/applications/:id/review`       | Submit review |

### Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students`      | Browse students |
| GET | `/api/students/:id`  | Student profile |
| PUT | `/api/students/profile` | Update student profile |
| PUT | `/api/clients/profile`  | Update client profile |

---

## 🔐 Authentication

All protected routes need this header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

The `api.js` helper handles this automatically.

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| `MongoDB connection failed` | Check MONGO_URI in .env, check IP whitelist in Atlas |
| `CORS error` in browser | Add your frontend URL to FRONTEND_URL in .env |
| Render app sleeps after 15 min | Free tier — first request takes ~30s to wake up |
| `JWT malformed` | Clear localStorage and login again |

---

## 📞 Need Help?
Email: info@skilllinkr.in
