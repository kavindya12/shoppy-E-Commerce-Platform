# 🛒 Shoppy — MERN E-Commerce Platform

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/Node-18.x-green)](https://nodejs.org/) [![React](https://img.shields.io/badge/React-18.x-blue)](https://react.dev/)

---

A scalable, production-ready e-commerce platform built using the **MERN Stack** with a modular monorepo architecture.

---

## 📁 Project Structure

```
shoopy/
│── client/     → React + Vite + Tailwind frontend
│── server/     → Node.js + Express + MongoDB backend
```

- `client/`  — Modern single-page React app (Vite, TailwindCSS, Zustand)
- `server/`  — Express REST API, JWT Auth, MongoDB (Mongoose)

---

## 🚀 Key Features

**User Experience**
- 🔐 JWT-based authentication & authorization
- 🛍️ Product listing with search, filters, sort & pagination
- 🛒 Persistent shopping cart
- 📦 Order placement & history
- 👀 Recently viewed items
- 🔔 Price Drop Alert system (base implementation)
- 🔁 Product comparison
- ⚡ Flash sale timer

**Admin & Backend**
- 📊 Admin dashboard
- 📦 Product CRUD
- 📜 Order management
- 📈 Modular, scalable backend
- 🗄️ MongoDB models & seeding support

---

## 🧩 Tech Stack

**Frontend:**
- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧭 React Router
- 🧠 Zustand / Context API
- 🔗 Axios

**Backend:**
- 🟩 Node.js
- 🚏 Express.js
- 🍃 MongoDB + Mongoose
- 🔐 JSON Web Tokens
- 🔑 Bcrypt

---

## ⚙️ Backend Setup

1. **Go to the server directory**
    ```bash
    cd server
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Configure environment variables**
    - Copy the example env and update:
    ```bash
    cp env.txt .env
    # Edit .env and update:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
4. **(Optional) Seed sample data:**
    ```bash
    npm run seed
    ```
5. **Start the server**
    - For development (with auto restart):
    ```bash
    npm run dev
    ```
    - For production:
    ```bash
    npm start
    ```

API now available at [http://localhost:5000/api](http://localhost:5000/api)

---

## 💻 Frontend Setup

1. **Go to client folder**
    ```bash
    cd client
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Create the environment file (if needed):**
    ```bash
    cp .env.example .env  # Or set VITE_API_URL in your preferred way
    ```
4. **Run the development server:**
    ```bash
    npm run dev
    ```
5. **Build for production:**
    ```bash
    npm run build && npm run preview
    ```

---

## 📝 Notable Source Structure

**Frontend:**
- Components in `client/src/components/`
- Pages/Routes in `client/src/pages/`
- Global store in `client/src/store/`
- API config in `client/src/services/`

**Backend:**
- Models in `server/models/`
- Controllers in `server/controllers/`
- Routes in `server/routes/`
- Middleware in `server/middleware/`
- Data seeding in `server/seed/`

---

## 🌐 API & Routing
- All backend endpoints start with `/api/` (see `server/routes/`)
- Example: `/api/products`, `/api/cart`, `/api/auth`, `/api/orders`, etc.
- For full API details, see controller files in `server/controllers/`.

---

## 🏗️ Future Enhancements
- 🧠 AI-powered recommendations
- 💳 Payment gateway integration
- 📱 PWA support
- 🗂️ Microservices migration
- 📬 Email + SMS notifications

---

## 🤝 Contributing
Pull requests are welcome! Follow conventional commits & proper PR descriptions.
- Style: Keep code modular and well-commented.
- PRs: Reference issues, include test coverage where possible.

---

## ❓ FAQ / Troubleshooting

- **Q: My server can't connect to MongoDB?**
  - A: Double check `MONGO_URI` in your server `.env` file, and make sure MongoDB is running.
- **Q: CORS issues running client and server locally?**
  - A: The server enables CORS; ensure your client API URL matches the backend exact port.
- **Q: How do I reset seeded data?**
  - A: Run `npm run seed` again in the server directory to reseed db.
- **More?** Open a GitHub issue or check controller/middleware logs for details.

---

## 📄 License
MIT License.
