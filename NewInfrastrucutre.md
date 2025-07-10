# 🧱 /build — MVP

## 🎯 What Is `/build`?

A web-based platform where anyone can **learn by building real tools** using Python (and eventually JS, AI, and data).

- No setup
- No gatekeeping
- All content in Season 1 is free
- Season Pass adds rewards — not restrictions

---

## 🚀 MVP Goals

- Let users complete **real tools** in-browser
- Run Python using Pyodide
- Offer optional AI assistance (GPT-powered)
- Track XP + tool completion
- Optional Season Pass adds:
  - More XP
  - Unlimited AI
  - Export options
  - Remix mode

---

## 🧪 Season 1 Tools

| Tool | Skills Covered |
|------|----------------|
| CSV Cleaner | Python I/O, string ops |
| Form Filler Generator | Input/output, formatting |
| AI Note Summarizer | API use, prompt design |
| Flashcard Generator | Lists, loops, GPT templates |
| Ask My PDF | File parsing, AI Q&A |

---

## 🛠 MVP Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js (App Router) |
| Python Runtime | Pyodide (WebAssembly, runs in-browser) |
| Code Editor | Monaco |
| DB (for tracking) | Supabase or D1 |
| AI Integration | GPT-4o (via API route) |

---

## 🗃️ Initial Database Schema

### `users`

| Field | Type |
|-------|------|
| id | UUID |
| email | string (nullable) |
| username | string |
| is_passholder | boolean |
| created_at | datetime |

---

### `tools`

| Field | Type |
|-------|------|
| id | UUID |
| slug | string |
| title | string |
| track | enum (`python`, `ai`, `data`) |
| season | string |
| order | int |
| created_at | datetime |

---

### `user_tool_progress`

| Field | Type |
|-------|------|
| id | UUID |
| user_id | FK → users.id |
| tool_id | FK → tools.id |
| status | enum(`not_started`, `in_progress`, `completed`) |
| ai_uses | int |
| xp_earned | int |
| updated_at | datetime |

---

### `ai_logs` (optional for later)

| Field | Type |
|-------|------|
| id | UUID |
| user_id | FK |
| tool_id | FK |
| type | enum(`explain`, `debug`, `review`) |
| prompt | text |
| created_at | datetime |

---

### `season_passes` (optional for tracking)

| Field | Type |
|-------|------|
| user_id | FK |
| season | string |
| activated_at | datetime |

---

## ✅ MVP Pages

| Path | Description |
|------|-------------|
| `/` | Hero + "Start Building" |
| `/tool/[slug]` | Code editor + output + AI assist |
| `/profile` | XP, badges, and build history |
| `/upgrade` | Season pass explainer |

---

## 🧠 How to Contribute (Future Vision)

- Add new tools in `tools.json`
- Extend tool types (JS, AI, Data)
- Build remix and export system
- Add `/dream` feature to plan tools before building

---

## 📜 License

MIT – built to empower learners and makers.

