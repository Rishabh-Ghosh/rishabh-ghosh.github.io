@echo off
echo ========================================================
echo 🔒 Starting Private Local Edge LLM Chat App
echo ========================================================
echo.

if not exist ".venv" (
    echo Creating virtual environment...
    "C:\Users\Rishabh Ghosh\AppData\Roaming\Python\Python311\Scripts\uv.exe" venv
    "C:\Users\Rishabh Ghosh\AppData\Roaming\Python\Python311\Scripts\uv.exe" pip install fastapi uvicorn httpx pydantic sqlite-utils
)

echo Starting server on http://localhost:8000 ...
echo (Access from phone via local Wi-Fi / Tailscale on http://YOUR-PC-IP:8000)
echo ========================================================
.venv\Scripts\python.exe app.py

pause
