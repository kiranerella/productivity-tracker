# 🚀 Productivity Tracker (VS Code Extension)

> Accurate, automated tracking of your coding productivity — powered by GPT summaries and Git commits.

[![CI](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/kiranerella/productivity-tracker/actions)

---

## ✨ Features
- Tracks local coding activity automatically (file changes, events)
- Generates AI-based summaries of work (OpenAI GPT)
- Commits summaries periodically to your private GitHub repo
- Smart fallback: uses recent commits or latest article if GPT fails
- Fully configurable via `.env` file

---

## ⚙️ Installation

> Local dev (while building):

```bash
git clone https://github.com/kiranerella/productivity-tracker.git
cd productivity-tracker
npm install
cd extension
npm install
npm run watch
# F5 in VSCode to run Extension Host
```

Local install as VSIX (after build):
```
npm install -g vsce
vsce package
code --install-extension productivity-tracker-0.0.1.vsix
```


> ENV configuration

Create .env in root:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
GIT_BRANCH=master
GIT_REMOTE=git@github.com:kiranerella/productivity-log.git
GIT_REPO_PATH=./activity_repo
GIT_COMMIT_INTERVAL=*/2 * * * *   # every 2 minutes
FORCE_ARTICLE=0
RSS_FEED=https://www.freecodecamp.org/news/rss/
ARTICLE_PARAGRAPHS=3
```

> TO-DO's

```
⏳ VSIX build & Marketplace publish

⏳ Webview dashboard UI inside VSCode

⏳ Cloud sync & analytics

```

> 🛠 Built with

- Node.js, VS Code Extension API
- simple-git, chokidar, node-cron

---

Built with love by KiranNerella.
