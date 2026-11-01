"""Minimal Ethereum JSON-RPC reader. Only non-mutating methods are permitted."""
import json
from urllib.request import Request, urlopen

ALLOWED = {"eth_chainId", "eth_getTransactionByHash", "eth_getTransactionReceipt", "eth_getBlockByNumber", "eth_getCode"}

def rpc(endpoint: str, method: str, params: list):
    if method not in ALLOWED:
        raise ValueError(f"Forbidden JSON-RPC method: {method}")
    if not endpoint.startswith(("https://", "http://localhost:", "http://127.0.0.1:")):
        raise ValueError("Use HTTPS or a local RPC endpoint")
    payload = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params}).encode()
    request = Request(endpoint, payload, {"Content-Type": "application/json"})
    with urlopen(request, timeout=25) as response:
        result = json.load(response)
    if "error" in result:
        raise RuntimeError(result["error"])
    return result["result"]
