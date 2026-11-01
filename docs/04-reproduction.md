# Reproducing selected Ethereum evidence

The verifier makes **read-only JSON-RPC requests**. It does not sign, broadcast or construct transactions.

## Requirements

Python 3.10+ and a trusted Ethereum mainnet JSON-RPC URL. Historical account state queries may require archive support.

```bash
python -m venv .venv
python -m pip install -e .
python -m unittest discover -s tests -v
```

Linux/macOS:

```bash
export ETH_RPC_URL="https://your-ethereum-rpc"
python -m hotwallet_forensics.cli verify
```

Windows PowerShell:

```powershell
$env:ETH_RPC_URL = "https://your-ethereum-rpc"
python -m hotwallet_forensics.cli verify
```

## Compare expected results

The script prints transaction status, block, transaction type and the number of authorization entries. Compare with [E01](02-evidence-ledger.md). Results depend on the RPC endpoint and should not be described as independently validated until executed against a suitable provider.

No account, credentials, wallet or proprietary dataset is needed for manual inspection in an explorer.
