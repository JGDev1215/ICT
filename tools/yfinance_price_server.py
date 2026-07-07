#!/usr/bin/env python3
"""Optional local yfinance price helper for the static ICT app."""

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse
from datetime import datetime, timezone
import json


ALIASES = {
    "MNQ": "MNQ=F",
    "NQ": "NQ=F",
    "MES": "MES=F",
    "ES": "ES=F",
    "MYM": "MYM=F",
    "YM": "YM=F",
    "RTY": "RTY=F",
    "M2K": "M2K=F",
    "MGC": "MGC=F",
    "GC": "GC=F",
    "CL": "CL=F",
    "BTCUSD": "BTC-USD",
    "BTC": "BTC-USD",
    "ETHUSD": "ETH-USD",
    "ETH": "ETH-USD",
}


class Handler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path != "/price":
            self.send_json({"error": "not found"}, 404)
            return

        symbol = parse_qs(parsed.query).get("symbol", [""])[0].strip().upper()
        if not symbol:
            self.send_json({"error": "missing symbol"}, 400)
            return

        try:
            import yfinance as yf
        except Exception:
            self.send_json({"error": "Install yfinance with: python3 -m pip install yfinance"}, 500)
            return

        yf_symbol = ALIASES.get(symbol)
        if not yf_symbol:
            self.send_json({"error": "unsupported symbol", "symbol": symbol, "supported": sorted(ALIASES.keys())}, 400)
            return

        try:
            ticker = yf.Ticker(yf_symbol)
            hist = ticker.history(period="1d", interval="1m")
            if hist.empty:
                raise ValueError("no price data")
            price = float(hist["Close"].dropna().iloc[-1])
        except Exception as exc:
            self.send_json({"error": str(exc), "symbol": symbol, "yfSymbol": yf_symbol}, 502)
            return

        self.send_json({
            "symbol": symbol,
            "yfSymbol": yf_symbol,
            "price": price,
            "source": "yfinance",
            "cached": False,
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        })

    def send_json(self, body, status=200):
        data = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8765), Handler)
    print("Serving yfinance price helper on http://127.0.0.1:8765")
    server.serve_forever()
