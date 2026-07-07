from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
from json import dumps
from time import time
from urllib.parse import parse_qs, urlparse


ALIASES = {
    "NQ": "NQ=F",
    "MNQ": "MNQ=F",
    "ES": "ES=F",
    "MES": "MES=F",
    "YM": "YM=F",
    "MYM": "MYM=F",
    "RTY": "RTY=F",
    "M2K": "M2K=F",
    "GC": "GC=F",
    "MGC": "MGC=F",
    "CL": "CL=F",
    "BTCUSD": "BTC-USD",
    "BTC": "BTC-USD",
    "ETHUSD": "ETH-USD",
    "ETH": "ETH-USD",
}

ALLOWED_ORIGINS = {
    "https://jgdev1215.github.io",
    "http://localhost:8000",
    "http://localhost:8888",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8888",
}

CACHE_TTL_SECONDS = 30
PRICE_CACHE = {}


class handler(BaseHTTPRequestHandler):
    def end_headers(self):
        origin = self.headers.get("Origin")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        elif not origin:
            self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "s-maxage=30, stale-while-revalidate=60")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/price":
            self.send_json({"error": "not found"}, 404)
            return

        symbol = parse_qs(parsed.query).get("symbol", [""])[0].strip().upper()
        if not symbol:
            self.send_json({"error": "missing symbol"}, 400)
            return

        yf_symbol = ALIASES.get(symbol)
        if not yf_symbol:
            self.send_json(
                {
                    "error": "unsupported symbol",
                    "symbol": symbol,
                    "supported": sorted(ALIASES.keys()),
                },
                400,
            )
            return

        cached = PRICE_CACHE.get(yf_symbol)
        now = time()
        if cached and now - cached["cached_at"] < CACHE_TTL_SECONDS:
            body = dict(cached["body"])
            body["cached"] = True
            self.send_json(body)
            return

        try:
            import yfinance as yf
        except Exception:
            self.send_json({"error": "yfinance dependency unavailable"}, 500)
            return

        try:
            ticker = yf.Ticker(yf_symbol)
            hist = ticker.history(period="1d", interval="1m")
            if hist.empty:
                raise ValueError("no price data")
            close = hist["Close"].dropna()
            if close.empty:
                raise ValueError("no close price data")
            price = float(close.iloc[-1])
        except Exception as exc:
            self.send_json(
                {"error": str(exc), "symbol": symbol, "yfSymbol": yf_symbol},
                502,
            )
            return

        body = {
            "symbol": symbol,
            "yfSymbol": yf_symbol,
            "price": price,
            "source": "yfinance",
            "cached": False,
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        }
        PRICE_CACHE[yf_symbol] = {"cached_at": now, "body": body}
        self.send_json(body)

    def send_json(self, body, status=200):
        data = dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
