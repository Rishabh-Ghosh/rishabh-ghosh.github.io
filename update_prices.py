
import yfinance as yf
import json
from datetime import datetime
from pathlib import Path

# Ensure docs folder exists
Path("docs").mkdir(parents=True, exist_ok=True)

symbols = ["AAPL", "TSLA", "MSFT", "S", "SPY","QQQ","V","MA","DAL","UAL","ASAN","BBAI","IBIT","ETHA","C","JPM","XOM","AVGO","CRM","BOXX","TLT"]

prices = []
for sym in symbols:
    ticker = yf.Ticker(sym)
    data = ticker.history(period="1d")
    if not data.empty:
        last_price = round(data["Close"].iloc[-1], 2)
        prev_price = round(data["Close"].iloc[-2], 2) if len(data) > 1 else last_price
        change = "▲" if last_price > prev_price else "▼" if last_price < prev_price else "▬"
        prices.append(f"{sym} {last_price} {change}")

with open("docs/prices.json", "w") as f:
    json.dump(
        {"updated": datetime.utcnow().isoformat(), "prices": prices},
        f,
        indent=2
    )

print("Updated docs/prices.json")
