import os
import json
import sqlite3
import asyncio
import httpx
from typing import AsyncGenerator, Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

DB_FILE = os.path.join(os.path.dirname(__file__), "chat_history.db")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

app = FastAPI(title="Private Local LLM Chat")

# Initialize Database
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            model TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            model TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE
        )
    """)
    conn.commit()
    conn.close()

init_db()

# Pydantic Schemas
class ChatCreate(BaseModel):
    id: str
    title: str
    model: str

class MessageCreate(BaseModel):
    chat_id: str
    role: str
    content: str
    model: Optional[str] = None

class StreamRequest(BaseModel):
    chat_id: str
    model: str
    messages: List[Dict[str, str]]
    system_prompt: Optional[str] = "You are a helpful, private local AI assistant."
    temperature: Optional[float] = 0.7

class PullModelRequest(BaseModel):
    model: str

# Helper Functions
def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

# API Endpoints
@app.get("/api/status")
async def get_status():
    """Check Ollama service connectivity and installed models."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                models_data = resp.json().get("models", [])
                models_list = [m["name"] for m in models_data]
                return {
                    "online": True,
                    "engine": "Ollama",
                    "base_url": OLLAMA_BASE_URL,
                    "models": models_list
                }
    except Exception:
        pass

    return {
        "online": False,
        "engine": "Ollama",
        "base_url": OLLAMA_BASE_URL,
        "models": [],
        "message": "Ollama service is not running on PC. Please start Ollama or download a model."
    }

@app.get("/api/models")
async def list_models():
    """List recommended and installed edge LLM models."""
    installed = []
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                installed = [m["name"] for m in resp.json().get("models", [])]
    except Exception:
        pass

    recommended = [
        {"name": "codegemma:2b", "type": "coding", "desc": "CodeGemma 2B Instruct - High performance lightweight code model", "installed": any("codegemma" in m for m in installed)},
        {"name": "deepseek-r1:1.5b", "type": "reasoning", "desc": "DeepSeek R1 Distill 1.5B - Edge reasoning & general task model", "installed": any("deepseek" in m for m in installed)},
        {"name": "llama3.2:1b", "type": "lightweight", "desc": "Llama 3.2 1B - Ultra-fast edge model for minimal compute", "installed": any("llama3.2:1b" in m for m in installed)},
        {"name": "qwen2.5:1.5b", "type": "general", "desc": "Qwen 2.5 1.5B - Compact general instruction model", "installed": any("qwen" in m for m in installed)}
    ]

    return {"installed": installed, "recommended": recommended}

@app.post("/api/models/pull")
async def pull_model(req: PullModelRequest):
    """Trigger Ollama model download in background."""
    async def stream_pull():
        try:
            async with httpx.AsyncClient(timeout=600.0) as client:
                async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/pull", json={"name": req.model}) as resp:
                    async for chunk in resp.aiter_text():
                        yield f"data: {chunk}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(stream_pull(), media_type="text/event-stream")

@app.post("/api/engine/kill")
async def kill_engine(req: Optional[Dict[str, Any]] = None):
    """Unload all active models from RAM/VRAM immediately."""
    model_name = req.get("model") if req else None
    results = []
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            tags_resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if tags_resp.status_code == 200:
                models = tags_resp.json().get("models", [])
                target_models = [m["name"] for m in models] if not model_name else [model_name]
                for m in target_models:
                    await client.post(f"{OLLAMA_BASE_URL}/api/generate", json={"model": m, "keep_alive": 0})
                    results.append(f"Unloaded {m}")
    except Exception as e:
        results.append(f"Error unloading model: {str(e)}")

    return {"status": "success", "message": "LLM VRAM/RAM memory cleared", "details": results}

@app.get("/api/chats")
async def get_chats():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM chats ORDER BY updated_at DESC")
    chats = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return chats

@app.post("/api/chats")
async def create_chat(chat: ChatCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO chats (id, title, model) VALUES (?, ?, ?)", (chat.id, chat.title, chat.model))
    conn.commit()
    conn.close()
    return {"status": "created", "id": chat.id}

@app.get("/api/chats/{chat_id}")
async def get_chat_messages(chat_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM messages WHERE chat_id = ? ORDER BY id ASC", (chat_id,))
    messages = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return messages

@app.delete("/api/chats/{chat_id}")
async def delete_chat(chat_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM messages WHERE chat_id = ?", (chat_id,))
    cursor.execute("DELETE FROM chats WHERE id = ?", (chat_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

@app.post("/api/chat/stream")
async def chat_stream(req: StreamRequest):
    """Stream chat completions from Ollama via SSE."""
    conn = get_db()
    cursor = conn.cursor()

    # Ensure chat exists
    cursor.execute("INSERT OR IGNORE INTO chats (id, title, model) VALUES (?, ?, ?)", 
                   (req.chat_id, req.messages[-1]["content"][:30] if req.messages else "New Chat", req.model))

    # Save last user message if present
    if req.messages and req.messages[-1]["role"] == "user":
        cursor.execute("INSERT INTO messages (chat_id, role, content, model) VALUES (?, ?, ?, ?)",
                       (req.chat_id, "user", req.messages[-1]["content"], req.model))
        conn.commit()

    conn.close()

    formatted_messages = []
    if req.system_prompt:
        formatted_messages.append({"role": "system", "content": req.system_prompt})
    formatted_messages.extend(req.messages)

    payload = {
        "model": req.model,
        "messages": formatted_messages,
        "options": {
            "temperature": req.temperature
        },
        "stream": True
    }

    async def generate_response():
        full_content = ""
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/chat", json=payload) as resp:
                    if resp.status_code != 200:
                        err_text = await resp.aread()
                        yield f"data: {json.dumps({'error': f'Ollama error ({resp.status_code}): {err_text.decode()}'})}\n\n"
                        return

                    async for line in resp.aiter_lines():
                        if line:
                            try:
                                data = json.loads(line)
                                token = data.get("message", {}).get("content", "")
                                full_content += token
                                yield f"data: {json.dumps({'token': token, 'done': data.get('done', False)})}\n\n"
                            except Exception:
                                continue

            # Save assistant message to DB after streaming completes
            if full_content:
                db = get_db()
                c = db.cursor()
                c.execute("INSERT INTO messages (chat_id, role, content, model) VALUES (?, ?, ?, ?)",
                          (req.chat_id, "assistant", full_content, req.model))
                c.execute("UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", (req.chat_id,))
                db.commit()
                db.close()

        except Exception as e:
            yield f"data: {json.dumps({'error': f'Failed to connect to local LLM: {str(e)}'})}\n\n"

    return StreamingResponse(generate_response(), media_type="text/event-stream")

# Mount Static PWA Frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Private Local LLM Chat on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
