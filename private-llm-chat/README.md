# 🔒 Private Local LLM Chat (ChatGPT-style)

A 100% private, cross-platform ChatGPT application designed to run edge models from Hugging Face on your Windows PC and access them securely from your Computer and Mobile Phone (iOS / Android).

---

## 🌟 Key Features

- **Selected Edge Models**:
  - **CodeGemma 2B** (`codegemma:2b`) — Optimized for code generation and technical tasks.
  - **DeepSeek R1 Distill 1.5B** (`deepseek-r1:1.5b`) — Edge reasoning and general conversation.
  - **Llama 3.2 1B** (`llama3.2:1b`) — Ultra-lightweight edge model for low compute.
- **ChatGPT-Style PWA UI**:
  - Markdown rendering with code syntax highlighting & 1-click **Copy Code** button.
  - Real-time Server-Sent Events (SSE) token streaming.
  - Model switching in dropdown header.
  - Custom system prompt & temperature configuration.
- **100% Private Storage**:
  - All chat history is saved in a local SQLite database (`chat_history.db`).
- **Cross-Device (PC + Mobile)**:
  - Install as a PWA on iOS/Android (Safari / Chrome -> **Add to Home Screen**).
  - Stream tokens from your PC over **Tailscale** or local Wi-Fi.

---

## 🚀 Quick Start Guide

### 1. Install & Run Ollama (Local LLM Engine)
Download and install [Ollama for Windows](https://ollama.com/download/windows). Once running, pull your target models in terminal:
```powershell
ollama pull codegemma:2b
ollama pull deepseek-r1:1.5b
```

### 2. Launch the Chat Application
Run `run.bat` or launch with `uv`:
```powershell
cd private-llm-chat
run.bat
```
The app will start on **`http://localhost:8000`**.

---

## 📱 Mobile Setup (iPhone / Android)

1. Connect your PC and Mobile phone to **Tailscale** (or the same local Wi-Fi).
2. Open your phone's browser and go to `http://<YOUR-PC-IP>:8000` (or `http://<TAILSCALE-IP>:8000`).
3. Tap **Share** (iOS Safari) or **Menu** (Android Chrome) -> **Add to Home Screen**.
4. Enjoy your standalone private ChatGPT app!
