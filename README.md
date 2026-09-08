# Contact List — Full-Stack App

A full-stack contact manager with a Node.js/Express REST API and a React (Vite) frontend.

---

## Prerequisites

- **Node.js** 18+ and **npm** (or **pnpm**)

---

## 1 — Run the Backend

```bash
cd server
npm install        # install express and cors
npm run dev        # starts on http://localhost:3001 
```

The API exposes three endpoints:

| Method   | Path              | Description                  |
|----------|-------------------|------------------------------|
| `GET`    | `/contacts`       | Return all contacts          |
| `POST`   | `/contacts`       | Create a contact             |
| `DELETE` | `/contacts/:id`   | Remove a contact by ID       |

**POST body** (JSON):
```json

```
`name` and `email` are required; `email` must contain `@`. A `400` with `{ "message": "..." }` is returned on failure.

> Data is stored in memory — it resets when the server restarts.

---

## 2 — Run the Frontend

Open a **second terminal** from the project root:

```bash
# from /code (project root)
npm install        # or: pnpm install
npm run dev        # starts on http://localhost:5173 (or the port Vite picks)
```

Then open the URL Vite prints in the terminal.

---

## How the frontend finds the backend

The frontend reads the API base URL from the environment variable **`VITE_API_URL`**.

- **Default** (no config needed for local dev): `http://localhost:3001`
- **Override**: create a `.env.local` file in the project root:
  ```
  VITE_API_URL=http://your-server-host:3001
  ```
  Vite picks this up automatically on the next `npm run dev`.

The variable is consumed in `src/App.tsx`:
```ts
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
```

---

## Project layout

```
/
├── server/
│   ├── package.json   # express + cors
│   └── server.js      # REST API
├── src/
│   ├── App.tsx        # React UI
│   ├── index.css      # Tailwind v4 + Google Fonts
│   └── main.tsx
├── index.html
├── package.json       # Vite + React
└── vite.config.ts
```
