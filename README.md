# 🚀 Productivity Tracker – VS Code Extension
> Private, real, context‑rich productivity tracking inside VS Code.
> Track your work. Auto‑commit summaries. Learn during your idle time.

[![CI](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/kiranerella/productivity-tracker/actions)

---

## ✨ Features
- 📋 Live Summary Dashboard – View your 5 most recent commits with word count & metadata

- 🔍 Filter + Search – Quickly narrow down summaries by keyword

- 🔄 Refresh View – One-click refresh to update dashboard without restarting

- 📎 Copy to Clipboard – Copy all summaries in markdown format

- ⬇️ Export Summaries – Download summaries as .md file

- 🧠 AI Insights – Summarize or explain your work with one-click OpenAI integration

- 🛠 Auto Path Detection – Uses .env SUMMARY_PATH or default fallback path

## 🛠 Setup
- Clone or install the extension.

- Set the SUMMARY_PATH in a .env file at the root of your project:
```
SUMMARY_PATH=/absolute/path/to/activity_repo/summaries
```
- Run or install the extension:
```
code --install-extension ./productivity-tracker-0.0.1.vsix --force
```
## 📦 Commands
| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `Show Dashboard` | Open live dashboard inside VS Code           |
| `Start Tracker`  | (Planned) Initialize activity tracking logic |


Use Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux) and search for the commands.

## 🧠 AI-Generated Insights (Optional)
Requires OpenAI API key set via .env:
```
OPENAI_API_KEY=sk-xxxxxx
```
Click 🧠 AI Insights to generate highlights or summaries of your latest work.

## 📁 File Structure
```bash
activity_repo/
  └── summaries/
        ├── summary-1.md
        ├── summary-2.md
        └── ...
extension/
  └── src/
        ├── extension.ts
        └── panels/dashboard.ts
```
## 🔐 Privacy & Local-Only Mode
All summaries and AI analysis happen locally. No data is shared or synced unless explicitly exported or configured otherwise.

## 🧩 Roadmap
- [x] Export & Clipboard Features

- [x] AI-Assisted Insights

- [ ] Git Commit Timeline View

- [ ] Configurable Filters (date, tags)

- [ ] Notion/GitHub Gist Exporter

- [ ] Idle Time Tracker & Suggestions


## 📃 License
MIT License
© 2025 Kiran Nerella

## 💬 Feedback?
Create an issue or reach out on GitHub Discussions.

