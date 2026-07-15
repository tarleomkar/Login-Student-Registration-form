# Student Management System

A full-stack student registration and management app with **two-level AES encryption**. Users can register, log in (client-side validation), and perform CRUD operations on student records from a dashboard.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router, CryptoJS |
| Backend | Node.js, Express 5, TypeScript, Mongoose |
| Database | MongoDB |
| Encryption | AES (CryptoJS) — frontend key + backend key |

## Features

- **Login form** — email format and password length validation (min 8 characters)
- **Student registration** — Full Name, Email, Phone Number, Date of Birth, Gender, Address, Course Enrolled, Password
- **Dashboard CRUD**
  - Create student (register / add form)
  - Read student list
  - Update student (password not required on edit)
  - Delete student (confirmation dialog)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/register` | Create a new student |
| `GET` | `/api/students` | Get all students |
| `PUT` | `/api/student/:id` | Update a student by MongoDB `_id` |
| `DELETE` | `/api/student/:id` | Delete a student by MongoDB `_id` |

## How Encryption Is Implemented

Data is encrypted twice before it reaches MongoDB. The MongoDB `_id` is **never** encrypted.

### Keys

| Key | Location | Purpose |
|-----|----------|---------|
| `VITE_FRONTEND_AES_KEY` | `client/.env` | Level 1 — client encrypt/decrypt |
| `FRONTEND_AES_KEY` | `server/.env` | Same value as client key — server decrypts incoming / encrypts outgoing client payloads |
| `BACKEND_AES_KEY` | `server/.env` | Level 2 — server encrypt/decrypt for MongoDB storage |

Generate keys (example):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run twice — use one value for the frontend keys and a **different** value for `BACKEND_AES_KEY`.

### Create / Update flow

1. **Frontend** encrypts every field with `encryptFrontend()` (`client/src/utils/crypto.ts`)
2. **Backend** decrypts with `decryptFrontend()`, validates plaintext, then encrypts with `encryptBackend()` before saving (`server/src/utils/crypto.ts`)
3. **MongoDB** stores backend-encrypted ciphertext

### Read flow

1. **Backend** reads ciphertext from MongoDB, decrypts with `decryptBackend()`, re-encrypts with `encryptFrontend()`, returns JSON (`_id` stays plain)
2. **Frontend** decrypts each field with `decryptFrontend()` for display

```
Register/Update:
  Plaintext → [Frontend AES] → API → decrypt → validate → [Backend AES] → MongoDB

Fetch:
  MongoDB → decrypt backend → encrypt frontend → API → decrypt frontend → UI
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repository

```bash
git clone https://github.com/tarleomkar/Login-Student-Registration-form.git
cd Login-Student-Registration-form
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-react-node-typescript
CLIENT_ORIGIN=http://localhost:5173
FRONTEND_AES_KEY=your_frontend_key_here
BACKEND_AES_KEY=your_backend_key_here
```

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env` — `VITE_FRONTEND_AES_KEY` must match `FRONTEND_AES_KEY` on the server:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FRONTEND_AES_KEY=your_frontend_key_here
```

Start the client:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 4. Usage flow

1. Open `http://localhost:5173/register` and create a student (use a unique email each time)
2. Go to **Login**, enter valid email/password format, submit → dashboard
3. From **Dashboard**: view list, add, edit, or delete students
4. In browser DevTools → Network, inspect API payloads — field values are AES ciphertext strings, not plain text

## Folder Structure

```
task-react-node-typescript/
├── client/                    # React frontend
│   └── src/
│       ├── components/
│       │   ├── LoginForm.tsx      # Login with validation
│       │   ├── StudentForm.tsx    # Register / create / update form
│       │   └── StudentList.tsx    # List, view, edit, delete
│       ├── services/
│       │   ├── api.ts             # Axios instance
│       │   └── studentApi.ts      # CRUD + encrypt/decrypt helpers
│       └── utils/
│           └── crypto.ts          # Frontend AES encryption
├── server/                    # Express backend
│   └── src/
│       ├── routes/
│       │   └── studentRoutes.ts
│       ├── controllers/
│       │   └── studentController.ts
│       ├── models/
│       │   └── Student.ts
│       ├── utils/
│       │   └── crypto.ts          # Backend AES encryption
│       ├── app.ts
│       └── server.ts
└── README.md
```

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `server/` | `npm run dev` | Start API with hot reload |
| `server/` | `npm run build` | Compile TypeScript |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Production build |

## Notes

- Login validates form input only; there is no separate login API (per assignment spec).
- Password is required for register/create but optional when editing a student.
- Ensure MongoDB is running before starting the server.
