from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
from json import dumps
from mimetypes import guess_type
from pathlib import Path
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
ROOT_DIR = Path(__file__).resolve().parents[1]
STATIC_FILES = {
    "/": ROOT_DIR / "index.html",
    "/index.html": ROOT_DIR / "index.html",
    "/manifest.webmanifest": ROOT_DIR / "manifest.webmanifest",
    "/service-worker.js": ROOT_DIR / "service-worker.js",
}


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
            if self.send_static(parsed.path):
                return
            self.send_json({"error": "not found"}, 404)
            return

        self.send_price(parsed)

    def send_price(self, parsed):
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

    def send_static(self, path):
        file_path = STATIC_FILES.get(path)
        if not file_path and path.startswith("/assets/"):
            candidate = (ROOT_DIR / path.lstrip("/")).resolve()
            assets_dir = (ROOT_DIR / "assets").resolve()
            if candidate.is_relative_to(assets_dir):
                file_path = candidate

        if not file_path or not file_path.is_file():
            return False

        content_type = guess_type(file_path.name)[0] or "application/octet-stream"
        if file_path.name == "manifest.webmanifest":
            content_type = "application/manifest+json"
        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
        return True

    def send_json(self, body, status=200):
        data = dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
