Here’s a `project-goals.md` file written specifically for **Cursor AI** to quickly understand your intentions, tech stack, and scope of the Learn Python app project.

````markdown
# 🐍 Learn Python Web App — Project Goals

## 🎯 Project Purpose

Create a browser-based app that teaches Python programming through:
- Interactive lessons
- In-browser code execution
- Real-time feedback

The app is designed for **beginners**, runs entirely in the browser, and does **not require a backend** at launch.

---

## 🧱 Tech Stack

| Layer        | Tech             | Purpose                            |
|--------------|------------------|------------------------------------|
| Frontend     | Next.js (App Router) | UI, routing, and lesson navigation  |
| Runtime      | Pyodide (via WebAssembly) | Run Python safely in the browser     |
| Editor       | Monaco Editor    | Code editing with syntax highlighting |
| Storage (MVP)| LocalStorage     | Store lesson progress on device     |
| Hosting      | Vercel / Cloudflare | Easy static/container hosting        |

---

## 🚧 MVP Features

- [x] Lesson loader from JSON file
- [x] Monaco-based code editor
- [x] Pyodide environment to run Python
- [x] Display stdout and errors from code
- [x] Built-in test cases to validate user code
- [ ] Basic progress tracking
- [ ] Mobile responsiveness

---

## 🧪 Sample Lesson (JSON format)

```json
{
  "id": "add-two-numbers",
  "title": "Add Two Numbers",
  "description": "Write a function that returns the sum of two numbers.",
  "starter_code": "def add(a, b):\n    return",
  "tests": [
    { "input": "add(2, 3)", "expected": "5" },
    { "input": "add(-1, 1)", "expected": "0" }
  ]
}
````

---

## 💡 Future Ideas

* AI hint system (GPT-based)
* Challenge streaks and XP leveling
* Code saving/sharing between users
* User auth + cloud syncing (D1 or Supabase)
* Export-to-GitHub or Replit integration

---

## 🧠 Key Constraints

* No backend dependency in MVP
* Works offline after first load
* Executes Python securely (no eval, server exec)
* Container-first mindset for eventual self-hosting

---

## 📁 Suggested File Structure

```
/
├─ pages/
│  ├─ index.tsx
│  └─ [lesson].tsx
├─ components/
│  ├─ CodeEditor.tsx
│  ├─ OutputPanel.tsx
│  └─ ChallengeChecker.tsx
├─ utils/
│  └─ runPyodide.ts
├─ public/
│  └─ lessons.json
└─ project-goals.md
```

---

## 👋 Author Notes

This project is created by Carl as a way to help beginners learn Python while flexing edge tech (Next.js, Pyodide, WASM, WebContainers). It’s meant to be lightweight, extendable, and deployable anywhere (especially in educational or dev tool settings).

```

Let me know if you want this in `.md` format to download or if you'd like a GitHub README version.
```
