import yfinance as yf
import json
from datetime import datetime
from pathlib import Path

# Ensure docs folder exists
Path("docs").mkdir(parents=True, exist_ok=True)

symbols = [
    "AAPL", "TSLA", "MSFT", "S", "SPY", "QQQ", "V", "MA",
    "DAL", "UAL", "ASAN", "BBAI", "IBIT", "ETHA", "C",
    "JPM", "XOM", "AVGO", "CRM", "BOXX", "TLT"
]

prices = []
for sym in symbols:
    ticker = yf.Ticker(sym)
    data = ticker.history(period="2d")   # <<-- get 2 days so we can compare
    if not data.empty and len(data) >= 2:
        last_price = round(data["Close"].iloc[-1], 2)
        prev_price = round(data["Close"].iloc[-2], 2)
        diff = round(last_price - prev_price, 2)
        pct = (diff / prev_price * 100) if prev_price != 0 else 0
        arrow = "▲" if diff > 0 else "▼" if diff < 0 else "▬"
        change_str = f"{arrow} ({diff:+.2f}, {pct:+.2f}%)"
        prices.append(f"{sym} {last_price} {change_str}")

with open("docs/prices.json", "w") as f:
    json.dump(
        {"updated": datetime.utcnow().isoformat(), "prices": prices},
        f,
        indent=2
    )

print("Updated docs/prices.json")
