# EIP-7702: authorization and delegated execution

This document explains the mechanism without publishing malicious deployment instructions.

## Protocol background

[EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) introduces transaction type `0x04`. A set-code transaction can contain an `authorization_list`, each entry containing **chain_id, address, nonce, y_parity, r, s**. The signature authorizes a delegation address for an externally owned account, subject to chain and nonce validation.

The account's code can become a delegation designator: `0xef0100 || <20-byte delegation address>`. A call to that account may then execute the delegate's runtime code in the account's context, with the account's existing asset authority. This mechanism is distinct from transferring private keys to a smart contract.

## Incident-linked observations

Investigators described a type-4 transaction with 50 signed authorization tuples. The relevant on-chain anchor is [0xad9926…298b](https://etherscan.io/tx/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b). A later sweep transaction was recorded as [0x53bd38…e2f3](https://etherscan.io/tx/0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3).

A set of cryptographically valid signatures does **not** prove the corresponding authorizations all took effect, that the authorized party acted knowingly, or how any signatures were obtained. Only the state transition and execution results can establish which delegations were effective.

Investigators associated the delegated implementation address `0x63e842b054bd624a465454d533c33f573e9c6fae` with subsequent bulk movement. Selectors `0x8a179be4` and `0x043ff9d2` appear in published contract-level analyses. **Selector-to-function-name mapping is not source-code verification**; inspect traces, bytecode and verified ABI where available.

## What the public data cannot show

The blockchain does not contain internal host logs, developer endpoint access records, employee authentication traces or an authenticated narrative of initial access. Binance's reported DevOps laptop/service-container compromise remains a preliminary company account unless supported by additional evidence.

## Defensive implications

High-value signers should enforce independent intent checks, separate signing from transaction construction, constrain target and method allowlists, limit hot-wallet exposure, monitor `0x04` transactions and unexpected account-code changes, and require independent approvals for authority-changing transactions.

References: [Ethereum protocol](https://eips.ethereum.org/EIPS/eip-7702), [TRM Labs](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history), [Bitquery](https://bitquery.io/investigations/binance-hack).
