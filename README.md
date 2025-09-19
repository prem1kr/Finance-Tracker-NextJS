
# 💰 Personal Finance Manager (Next.js + MongoDB)

A full-stack **Personal Finance Management App** built with **Next.js (App Router + API routes)** and **MongoDB**.
It allows users to manage **income, expenses, and transactions** with **authentication, Google login, and avatar upload support**.

---

## 📂 Project Structure (Detailed)

### **Root**

```
├── .next/                # Next.js build output
├── app/                  # Main application folder (Next.js app router)
├── components/           # Reusable UI components
├── public/               # Static files (avatars, icons, uploads, etc.)
├── .env                  # Environment variables
```

---

### **app/api/**

```
├── config/
│   └── db.js             # MongoDB connection setup

├── controller/
│   ├── auth/
│   │   ├── google/       # Google authentication route
│   │   ├── login/        # Login route
│   │   ├── signup/       # Signup route
│   │   └── user/         # User profile & avatar update
│   │
│   └── transaction/
│       ├── add/          # Add new transaction
│       ├── delete/       # Delete transaction
│       ├── edit/         # Edit transaction
│       └── get/          # Get all transactions

├── models/
│   ├── auth/
│   │   └── userDB.js     # User schema (auth, avatar, premium)
│   │
│   └── transaction/
│       └── transactionDB.js # Transaction schema (income, expense, category, date, amount)
```

---

### **app/pages/**

```
├── auth/
│   ├── google/           # Google login page
│   ├── login/            # Login UI
│   └── signup/           # Signup UI

├── dashboard/
│   ├── addexpanse/       # Form to add expense
│   ├── addincome/        # Form to add income
│   ├── allTransaction/   # List all transactions
│   ├── dashboardhome/    # Dashboard home/overview
│   ├── edit/             # Edit transaction
│   ├── expanse/          # Expense overview
│   └── income/           # Income overview

├── navbar/               # Navbar component
├── sidebar/              # Sidebar component
└── transaction/          # Transaction-related UI

layout.js                 # Root layout wrapper
page.js                   # Entry page
globals.css               # Global CSS (Tailwind)
favicon.ico               # App favicon
```

---

### **components/**

```
├── context/              # Context API (Theme, Auth, Transactions)
```

---

### **hooks/**

```
# Custom hooks (fetch user, income, expenses, transactions)
```

---

### **utils/**

```
# Helper functions (icon map, formatters, etc.)
```

---

### **public/**

```
uploads/
└── avatars/              # User uploaded profile pictures
favicon.ico               # Favicon
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/prem1kr/Finance-Trakers.git
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a **.env** file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

The app will run at **[http://localhost:3000](http://localhost:3000)**

---

## 📌 Features

* 🔐 **User Authentication** (JWT + Google OAuth)
* 👤 **Profile Avatar **
* 💸 **Add, Edit, Delete Income & Expenses**
* 📊 **Track Transactions with Categories**
* 📱 **Responsive UI** with TailwindCSS

---

## 📡 API Endpoints

### 🔑 Auth

* `POST /api/auth/signup` → Register new user
* `POST /api/auth/login` → Login user
* `GET /api/auth/user` → Get user profile
* `PUT /api/auth/user` → Update avatar

### 💵 Transactions

* `POST /api/transaction/add` → Add transaction
* `GET /api/transaction/get` → Get all transactions
* `PUT /api/transaction/edit/:id` → Update transaction
* `DELETE /api/transaction/delete/:id` → Delete transaction

---

## 📌 Future Enhancements

* 📈 Expense/Income Analytics (Charts & Graphs)
* 📤 Export Data ( PDF)
* 📲 PWA for mobile users

---

## 👨‍💻 Author

**Prem Kumar**


