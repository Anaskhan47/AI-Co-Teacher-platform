# AI Co-Teacher 🎓 [Deployment: Stable]

**AI-powered teaching assistant** — generate lesson plans, quizzes, assignments, presentations, and data analysis reports in seconds.

---

## ✨ Features

| Feature | Description |
|---|---|
| AI Lesson Plan Generator | Curriculum-aligned lesson plans with PDF context support |
| AI Quiz / Assessment Generator | MCQ with Bloom's Taxonomy levels |
| AI Assignment Generator | Homework, Worksheets, Projects |
| AI Question Paper Generator | Full exam papers with marking scheme |
| AI PPT Generator | Presentation slide decks |
| AI Lesson Summarizer | Text and PDF summarization |
| Data Analysis | CSV student performance & attendance reports |
| Multi-Dashboard | Teacher, Student, Parent portals |
| Attendance Tracking | Class-level attendance management |
| Messaging | Teacher ↔ Student/Parent communication |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Express 5 (TypeScript) |
| AI Providers | Groq (Llama 3.3-70b) + Google Gemini 2.0 Flash |
| Auth | Firebase Auth (Google SSO) + JWT (email/password) |
| Database | Firebase Firestore |
| State | Zustand + React Context + TanStack Query |

---

## 🚀 Setup

### Prerequisites
- Node.js >= 18
- A Firebase project ([console.firebase.google.com](https://console.firebase.google.com))
- A Groq API key ([console.groq.com](https://console.groq.com)) **and/or** a Google Gemini key

### 1. Install dependencies
```sh
npm install
```

### 2. Configure environment variables
```sh
cp .env.example .env
```
Fill in all values in `.env` — see `.env.example` for the full list.

### 3. Run both frontend and backend
```sh
npm run dev:all
```
- **Frontend:** http://localhost:8080
- **Backend:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

### 4. Run separately
```sh
# Frontend only
npm run dev

# Backend only
npm run server
```

---

## 📁 Project Structure

```
ai-co-teacher/
├── src/                    # React frontend
│   ├── api/                # Axios client
│   ├── components/
│   │   ├── dashboard/      # 17 dashboard feature tabs
│   │   ├── landing/        # Public landing page sections
│   │   ├── layout/         # AppLayout
│   │   └── ui/             # 49 shadcn/ui components
│   ├── contexts/           # AuthContext (unified auth)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Firebase client config
│   ├── pages/              # Route pages
│   └── store/              # Zustand stores
├── backend/
│   └── src/
│       ├── controllers/    # 15 route controllers
│       ├── lib/            # Firebase Admin SDK
│       ├── middleware/     # Auth + Upload middleware
│       ├── routes/         # 15 Express route files
│       └── services/       # AIService (Groq + Gemini)
├── public/                 # Static assets
├── .env.example            # ← Copy to .env and fill values
└── co-teacher.py           # Standalone Streamlit chatbot (Ollama)
```

---

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for all required variables.

**Minimum required to run:**
- `JWT_SECRET` — strong random string
- `GROQ_API_KEY` or `GEMINI_API_KEY` — at least one AI provider
- Firebase project credentials (Admin SDK + Client SDK)

---

## 🐍 Python Chatbot (Optional)

A standalone Streamlit chatbot using local Ollama models:
```sh
pip install streamlit ollama pandas
ollama pull llama3.2
streamlit run co-teacher.py
```

---

## 📄 License

MIT
