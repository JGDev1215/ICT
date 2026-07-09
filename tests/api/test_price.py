import builtins
import json
import sys
import types
import unittest
from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from api import price  # noqa: E402


def make_handler():
    instance = price.handler.__new__(price.handler)
    instance.status = None
    instance.headers_sent = []
    instance.wfile = BytesIO()
    instance.send_response = lambda status: setattr(instance, "status", status)
    instance.send_header = lambda name, value: instance.headers_sent.append((name, value))
    instance.end_headers = lambda: None
    return instance


def send_price(path):
    instance = make_handler()
    instance.send_price(urlparse(path))
    body = json.loads(instance.wfile.getvalue().decode("utf-8"))
    return instance.status, body


class FakeIloc:
    def __init__(self, value):
        self.value = value

    def __getitem__(self, index):
        return self.value


class FakeClose:
    empty = False

    def __init__(self, value):
        self.iloc = FakeIloc(value)

    def dropna(self):
        return self


class FakeHistory:
    empty = False

    def __init__(self, value):
        self.value = value

    def __getitem__(self, key):
        if key != "Close":
            raise KeyError(key)
        return FakeClose(self.value)


class EmptyHistory:
    empty = True


class FakeTicker:
    def __init__(self, yf_symbol, history):
        self.yf_symbol = yf_symbol
        self._history = history

    def history(self, period, interval):
        if period != "1d" or interval != "1m":
            raise AssertionError("unexpected yfinance history request")
        return self._history


def fake_yfinance(history):
    return types.SimpleNamespace(Ticker=lambda yf_symbol: FakeTicker(yf_symbol, history))


class PriceApiBoundaryTest(unittest.TestCase):
    def setUp(self):
        price.PRICE_CACHE.clear()
        self.original_yfinance = sys.modules.pop("yfinance", None)

    def tearDown(self):
        price.PRICE_CACHE.clear()
        sys.modules.pop("yfinance", None)
        if self.original_yfinance is not None:
            sys.modules["yfinance"] = self.original_yfinance

    def test_missing_symbol_returns_400(self):
        status, body = send_price("/api/price")

        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "missing symbol")

    def test_unsupported_symbol_returns_supported_aliases(self):
        status, body = send_price("/api/price?symbol=NOTAREAL")

        self.assertEqual(status, 400)
        self.assertEqual(body["error"], "unsupported symbol")
        self.assertEqual(body["symbol"], "NOTAREAL")
        self.assertIn("MNQ", body["supported"])
        self.assertIn("BTC", body["supported"])

    def test_yfinance_dependency_unavailable_returns_500(self):
        original_import = builtins.__import__

        def guarded_import(name, *args, **kwargs):
            if name == "yfinance":
                raise ImportError("blocked by test")
            return original_import(name, *args, **kwargs)

        builtins.__import__ = guarded_import
        try:
            status, body = send_price("/api/price?symbol=MNQ")
        finally:
            builtins.__import__ = original_import

        self.assertEqual(status, 500)
        self.assertEqual(body["error"], "yfinance dependency unavailable")

    def test_provider_unavailable_returns_502_shape(self):
        sys.modules["yfinance"] = fake_yfinance(EmptyHistory())

        status, body = send_price("/api/price?symbol=MNQ")

        self.assertEqual(status, 502)
        self.assertEqual(body["error"], "price provider unavailable")
        self.assertEqual(body["symbol"], "MNQ")
        self.assertEqual(body["yfSymbol"], "MNQ=F")

    def test_successful_response_shape_uses_mocked_provider(self):
        sys.modules["yfinance"] = fake_yfinance(FakeHistory(29876.25))

        status, body = send_price("/api/price?symbol=mnq")

        self.assertEqual(status, 200)
        self.assertEqual(body["symbol"], "MNQ")
        self.assertEqual(body["yfSymbol"], "MNQ=F")
        self.assertEqual(body["price"], 29876.25)
        self.assertEqual(body["source"], "yfinance")
        self.assertFalse(body["cached"])
        self.assertIn("timestamp", body)


if __name__ == "__main__":
    unittest.main(verbosity=2)
