import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from hotwallet_forensics.analysis import summarize
from hotwallet_forensics.rpc import ALLOWED, rpc

class EvidenceTests(unittest.TestCase):
    def test_transaction_parser(self):
        tx = {"hash": "0xab", "type": "0x4", "blockNumber": "0x10", "authorizationList": [{}] * 2}
        receipt = {"status": "0x1", "logs": [{}]}
        result = summarize(tx, receipt)
        self.assertEqual(result["block"], 16)
        self.assertEqual(result["authorizations"], 2)
        self.assertEqual(result["log_count"], 1)

    def test_rpc_only_read_methods(self):
        self.assertNotIn("eth_sendRawTransaction", ALLOWED)
        with self.assertRaises(ValueError):
            rpc("https://example.org", "eth_sendRawTransaction", ["0x00"])

if __name__ == "__main__":
    unittest.main()
