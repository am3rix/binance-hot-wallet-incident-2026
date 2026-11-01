"""Verify selected public mainnet transactions without broadcasting anything."""
import argparse
import json
import os
from .rpc import rpc
from .analysis import summarize

HASHES = {
    "authorization": "0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b",
    "sweep": "0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3",
}

def main():
    parser = argparse.ArgumentParser(description="Read-only on-chain evidence viewer")
    parser.add_argument("command", choices=["facts", "verify"])
    args = parser.parse_args()
    if args.command == "facts":
        print(json.dumps(HASHES, indent=2))
        return
    endpoint = os.getenv("ETH_RPC_URL")
    if not endpoint:
        parser.error("Set ETH_RPC_URL to an Ethereum mainnet JSON-RPC endpoint")
    chain = int(rpc(endpoint, "eth_chainId", []), 16)
    if chain != 1:
        parser.error(f"Expected Ethereum mainnet (chain 1), got {chain}")
    for name, hash_ in HASHES.items():
        tx = rpc(endpoint, "eth_getTransactionByHash", [hash_])
        receipt = rpc(endpoint, "eth_getTransactionReceipt", [hash_])
        if not tx or not receipt:
            raise RuntimeError(f"Missing public transaction: {hash_}")
        print(json.dumps({"case": name, **summarize(tx, receipt)}, indent=2))

if __name__ == "__main__":
    main()
