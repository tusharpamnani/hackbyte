# 🚀 Git-Smart  
**_Smart Learning. Seamless Automation._**

[🔗 Live Demo](https://gitsmart.vercel.app/) | [📂 GitHub Repo](https://github.com/tusharpamnani/hackbyte)

---

## 🧠 What is Git-Smart?

**Git-Smart** helps beginner developers kickstart their development journey using AI-powered personalized roadmaps and GitHub-based project automation. We use **Gemini API** to guide what to learn, and **GitHub Actions** to verify how well it's learned — turning GitHub into a personal project mentor.

---

## 🎯 Features

- ✅ **AI-Powered Roadmap Generation** via Gemini  
- 🧩 **Batch-Wise Projects** – 4 practical projects per batch  
- 📖 **Clear Project Guides** hosted in GitHub repos  
- 🤖 **GitHub Actions** for automated code testing  
- 🛡️ **CodeQL** integration for secure, quality submissions  
- ⚡ **Instant Feedback** loop on every submission  
- 🌐 **Live Deployment** powered by Vercel  

---

## 🛠️ Tech Stack

| Category        | Tech Used                                  |
|----------------|---------------------------------------------|
| Frontend       | Next.js, React, Tailwind CSS, Framer Motion |
| Backend        | Prisma, MongoDB, Clerk                      |
| AI Integration | Gemini API, Langchain                       |
| Automation     | GitHub Actions, CodeQL                      |
| Auth           | Clerk + GitHub OAuth                        |
| Deployment     | Vercel                                      |

---

## ⚙️ Getting Started

Follow these steps to set up and run Git-Smart locally:

### 1. **Clone the Repository**

```bash
git clone https://github.com/tusharpamnani/hackbyte.git
cd hackbyte
```

### 2. **Install Dependencies**

Make sure you have `node` and `npm` installed, then:

```bash
npm install
```

### 3. **Setup Environment Variables**

- Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

- Fill in the required values in `.env`.  
  This includes credentials for services like **Clerk**, **Google AI**, **MongoDB**, etc.

### 4. **Generate Prisma Client**

```bash
npx prisma generate
```

> Ensure your database is set up and running before this step.

### 5. **Run the Development Server**

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000`.

---

## 💡 Inspiration

Honestly? We were tired of **winging it**.

Our dev journeys started with a whole lot of **"fuck around and find out."** Endless tutorials, half-baked projects, no real structure — just vibes and stack overflow tabs. We wasted time, got stuck on dumb stuff, and had no clue what we were doing wrong.

Then came the DMs. Juniors asking, _“Bro how to start?”, “Is this project okay?”, “What to do after HTML?”_ — and we realized: damn, we needed something like **Git-Smart** back then.

So we built it.

Not another course. Not another YouTube list. Just a **practical, AI-powered guide** that says:  
→ _Here’s what to learn_  
→ _Here’s what to build_  
→ _Here’s how you’re doing_  
→ _Now go again._

This isn’t a tutorial dump — it’s a **no-BS roadmap** with real projects and real feedback, made for devs who want to stop scrolling and start building.

---

## 🧪 Live in Action

🖥 Try it live → [gitsmart.vercel.app](https://gitsmart.vercel.app)

---
