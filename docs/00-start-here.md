# Start here — a practical guide to the evidence

**No downloads are necessary to read the investigation or inspect the public records.** This guide assumes no prior knowledge of Ethereum.

## Quick navigation

| Time | What you will learn | Open |
|---|---|---|
| 2 min | What happened and what is not established | [Case overview](../README.md#case-overview) |
| 5 min | The public narrative and timeline | [Incident report](01-incident-report.md) |
| 5 min | Read an Ethereum transaction | [Evidence ledger](02-evidence-ledger.md) |
| 10 min | What EIP-7702 actually changes | [Protocol analysis](03-eip7702-contract-analysis.md) |
| 15 min | Check three pieces of evidence yourself | [Walkthrough below](#guided-verification) |
| Optional | Run an independent read-only verifier | [Reproduction](04-reproduction.md) |

## Before the walkthrough

A **wallet address** is a public identifier, not proof of the owner's identity. A **transaction hash** uniquely identifies a recorded transaction. A **receipt** describes its execution outcome and logs. A **smart contract** is code executed by the blockchain. An **authorization** under [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) is a signed instruction that allows an externally owned account to delegate execution to contract code.

## Guided verification

1. Open the [type-4 transaction](https://etherscan.io/tx/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b). Record its block, UTC timestamp and transaction type. Where supported, inspect the authorization list.
2. Open the [first major sweep transaction](https://etherscan.io/tx/0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3). Inspect the **from**, **to**, input and ERC-20 transfer log entries. Do not assume all logs represent transfers to an attacker.
3. Compare both blocks. The ordering confirms that the authorization preceded this sweep. It does **not** identify how a valid authorization signature was obtained.
4. Open the [Binance-labeled address](https://etherscan.io/address/0x28c6c06298d514db089934071355e5743bf21d60). Explorer labels are external attributions, not on-chain identity proofs.
5. Read the [Ethereum specification](https://eips.ethereum.org/EIPS/eip-7702). The EIP explains why account code may temporarily act as a pointer to delegated code.

**Your conclusion should be narrower than the headline:** the public chain shows transaction order and state changes; it cannot by itself prove an employee laptop was compromised.

## Test your understanding

- Which finding could be reproduced independently: the public transaction type, or the alleged malware entry point?
- Why is a cryptographically valid signature not evidence that the signer knowingly approved the action?
- Why should cross-chain dollar values be described as estimates rather than a single permanent measurement?

Answers: transaction type; signatures do not disclose intent or authorization context; asset prices, chain coverage and snapshot timing differ.

## Research integrity

The analyses referenced here were published by third parties. This repository is independent, cites their work and does not claim to have discovered the intrusion or independently verified every cross-chain outflow.
