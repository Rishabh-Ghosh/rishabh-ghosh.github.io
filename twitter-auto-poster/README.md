# 📈 Macro Finance Twitter Auto-Poster

An automated Twitter/X bot that publishes high-IQ macro financial observations (ZQ futures, rate cut probabilities, yield curves, Fed policy) in a deadpan, absurdist, post-ironic internet humor style.

---

## 📁 Project Overview

* `poster.py` - Primary execution script. Handles dry-run, static queue posting, or Gemini AI post generation.
* `generator.py` - Uses the **Gemini 2.5 Flash** model with custom financial shitpost prompts.
* `config.py` - Manages `.env` variables and persona system instructions.
* `tweets.json` - Queue of static pre-approved tweets.
* `.github/workflows/post.yml` - GitHub Action workflow for free scheduled cron posting.

---

## ⚡ Quick Start (Local Testing)

### 1. Install Dependencies
```bash
cd twitter-auto-poster
pip install -r requirements.txt
```

### 2. Run in Dry-Run Mode (No API keys required to test)
```bash
python poster.py --mode queue
```
Or test AI generation mode:
```bash
python poster.py --mode ai --topic "ZQ 30-day Fed funds futures pricing 28% cut probability"
```

---

## 🗝️ Setting Up Your API Credentials

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your 4 X API keys from **[developer.x.com](https://developer.x.com)**:
* `X_API_KEY`
* `X_API_SECRET`
* `X_ACCESS_TOKEN`
* `X_ACCESS_TOKEN_SECRET`

And your Gemini API Key from **[Google AI Studio](https://aistudio.google.com)**:
* `GEMINI_API_KEY`

---

## 🚀 Live Posting

To send a live tweet to X:
```bash
python poster.py --mode queue --no-dry-run
```

---

## ⏰ Automated Scheduling with GitHub Actions

1. Push this repository to GitHub.
2. Go to **Settings > Secrets and variables > Actions > New repository secret**.
3. Add the 5 secrets: `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`, `GEMINI_API_KEY`.
4. The workflow will automatically run every weekday at 9:00 AM EST (14:00 UTC) to post the next queue item or generate a fresh macro-shitpost!
