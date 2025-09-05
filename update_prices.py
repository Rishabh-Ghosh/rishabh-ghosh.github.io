import yfinance as yf
import json
from datetime import datetime
from pathlib import Path

# Ensure docs folder exists
Path("docs").mkdir(parents=True, exist_ok=True)
symbols = [
    # Tech giants
    "AAPL", "MSFT", "GOOG", "GOOGL", "AMZN", "META", "NVDA", "TSLA",
    "AMD", "INTC", "QCOM", "AVGO", "ADBE", "CRM", "ORCL", "CSCO",

    # ETFs & Index funds
    "SPY", "QQQ", "DIA", "IWM", "TLT", "HYG", "LQD", "XLF", "XLE",
    "XLK", "XLY", "XLV", "XLI", "XLB", "XLU", "XLRE", "ARKK", "VTI",

    # Banks & Finance
    "JPM", "BAC", "WFC", "C", "GS", "MS", "BLK", "SCHW", "BX", "V",
    "MA", "PYPL", "AXP",

    # Airlines & Travel
    "DAL", "UAL", "AAL", "LUV", "RCL", "CCL", "NCLH", "EXPE", "BKNG",

    # Energy & Industrials
    "XOM", "CVX", "COP", "SLB", "HAL", "PSX", "BP", "SHEL", "GE",
    "CAT", "DE", "BA", "MMM", "HON", "RTX", "LMT", "NOC",

    # Consumer & Retail
    "WMT", "TGT", "COST", "HD", "LOW", "NKE", "SBUX", "MCD", "KO",
    "PEP", "PG", "CL", "KMB", "UL", "MO", "PM",

    # Healthcare & Pharma
    "JNJ", "PFE", "MRK", "BMY", "ABBV", "LLY", "AMGN", "GILD",
    "CVS", "UNH", "HUM", "CI",

    # Telecom & Media
    "T", "VZ", "TMUS", "DIS", "NFLX", "CMCSA", "CHTR", "PARA",

    # Small caps / Growth / Misc
    "ASAN", "BBAI", "IBIT", "ETHA", "BOXX", "SNOW", "SHOP", "ROKU",
    "PLTR", "COIN", "UBER", "LYFT", "DOCU", "ZM", "PATH",

    # Utilities / REITs
    "NEE", "DUK", "SO", "D", "EXC", "PLD", "O", "AMT", "CCI",

    # International ADRs
    "BABA", "TCEHY", "NIO", "JD", "PDD", "RIO", "TM", "HMC"
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
