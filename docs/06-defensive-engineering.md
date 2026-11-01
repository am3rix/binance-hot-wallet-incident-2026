# Defensive engineering notes

The incident illustrates how a valid on-chain authorization may still be contrary to the owner's intent.

- Separate transaction intent validation from the service that submits transactions.
- Enforce chain, recipient, selector, token and threshold policies before signing.
- Require independent authorization for changes in account execution semantics.
- Detect unexpected account code changes and newly assigned EIP-7702 delegates.
- Keep hot-wallet balances limited to operational requirements; maintain segregation of reserve custody.
- Test emergency revocation and withdrawal pause workflows.
- Persist tamper-evident approval logs outside the environment that constructs transactions.

These are architectural recommendations, not verified descriptions of Binance's internal controls. See the [incident report](01-incident-report.md) for evidence boundaries.
