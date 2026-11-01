"""Public transaction observations; no private-key operations."""
def summarize(tx, receipt):
    auth = tx.get("authorizationList", tx.get("authorization_list", []))
    return {
        "hash": tx.get("hash"),
        "type": tx.get("type"),
        "block": int(tx["blockNumber"], 16) if tx.get("blockNumber") else None,
        "from": tx.get("from"),
        "to": tx.get("to"),
        "authorizations": len(auth) if isinstance(auth, list) else None,
        "receipt_status": int(receipt["status"], 16) if receipt.get("status") else None,
        "log_count": len(receipt.get("logs", [])),
    }
