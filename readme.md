# MERN Template — Hero UI Edition

A modern, full-stack boilerplate using the MERN stack with clean architecture, built-in authentication, Redis caching, AWS S3 uploads, TailwindCSS, Hero UI components, React Query, and charting. Perfect for dashboards, SaaS platforms, or any full-stack web app.

---

## 🧱 Tech Stack

### 🔧 Backend (`/server`)

-    Node.js, Express
-    MongoDB with Mongoose & Paginate
-    JWT Auth (Access + Refresh)
-    Redis (`ioredis`)
-    AWS S3 for file uploads
-    Yup, Validator for schema validation
-    Rate Limiting, CORS, File Upload, dotenv

### 🎨 Frontend (`/client`)

-    React 18 (Vite)
-    TailwindCSS with `@tailwindcss/typography`
-    Hero UI (`@heroui/react`)
-    React Router, React Query, Devtools
-    Axios, Formik, Yup
-    ApexCharts, CountUp, Framer Motion
-    Toasts via `react-hot-toast`
-    Date and Time via `moment` and `@internationalized/date`
-    Utilities: lodash, query-string, lucide-react

---

## 📁 Project Structure

```
modern-mern-template/
├── client/         # React frontend
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/         # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── .env.example    # Sample environment config
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/desiassassin/modern-mern-template.git
cd modern-mern-template
```

---

### 2. Setup Environment Variables

Create a `.env` file in both `client/` and `server/` using the below provided example.

#### Frontend (`client/.env`)

```env
VITE_BASE_URL=http://localhost:3001
VITE_FILES_URL= # base url where your files are hosted eg. https://subdomain.domain.tld/
VITE_GOOGLE_OAUTH_CLIENT_ID= # google oauth client id you get from google
```

#### Backend (`server/.env`)

```env
NODE_ENV=production|development
MONGODB_URL=# mongodb uri
REDIS_URL=# redis uri
ACCESS_TOKEN_SECRET=# a secure 256bit secret
REFRESH_TOKEN_SECRET=# a secure 256bit secret
DOMAIN=# domain.tld
CLOUDFLARE_R2_ACCOUNT_ID=# get from cloudflare dashboard
CLOUDFLARE_R2_ACCESS_KEY_ID=# get from cloudflare dashboard
CLOUDFLARE_R2_SECRET_ACCESS_KEY=# get from cloudflare dashboard
CLOUDFLARE_R2_BUCKET_NAME=# get from cloudflare dashboard
GOOGLE_OAUTH_CLIENT_ID=# get from google console
GOOGLE_OAUTH_CLIENT_SECRET=# get from google console
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth-redirect
MSG91_AUTH_KEY=# get from msg91 dashboard
```

---

### 3. Install Dependencies

```bash
# Backend
cd server
npm ci

# Frontend
cd ../client
npm ci
```

---

### 4. Run the Application

```bash
# Start frontend
cd client
npm run dev

# Start backend
cd ../server
npm run dev
```

---

## 📦 Available Scripts

### Frontend (`client/package.json`)

```json
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```

### Backend (`server/package.json`)

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

---

## ✅ Features Included

-    🔐 JWT Authentication (access + refresh tokens)
-    🌐 RESTful API structure with rate limiting
-    🧠 Redis caching
-    ☁️ AWS S3 file upload support
-    🧮 Form validation (Yup + Formik)
-    ⚡ React Query for state & caching
-    💅 TailwindCSS styling + Hero UI
-    🔥 Framer Motion animations
-    🔔 React Hot Toast notifications

---

## 💡 Ideal Use Cases

-    Admin panels
-    SaaS product starters
-    Internal dashboards
-    Authenticated web apps
-    Full-stack MVPs

---

## 🧪 Recommended Folder Structure

### Backend

```
server/
├── config/
├── controllers/
├── routes/
├── models/
├── middlewares/
├── validators/
├── services/
├── utils/
├── constants.js
└── server.js
```

### Frontend

```
client/
├── src/
│   ├── components/
│   ├── views/
│   ├── contexts/
│   ├── hooks/
│   ├── utils/
│   ├── main.jsx
│   ├── App.jsx
│   ├── constants.jsx
│   └── index.scss
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request with improvements or fixes.

---

## 📄 License

Licensed under the MIT License.

---

## 🌐 Author

**Your Name**  
[GitHub](https://github.com/desiassassin) · [LinkedIn](https://linkedin.com/in/arunksehrawat)
