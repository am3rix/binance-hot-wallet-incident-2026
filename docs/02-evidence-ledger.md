# Evidence ledger

This ledger separates recorded transaction fields from labels and third-party interpretations. All timestamps use **UTC**.

| ID | Artifact | Source | Checks |
|---|---|---|---|
| E01 | [Authorization tx](https://etherscan.io/tx/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b) | Ethereum mainnet | Type 4, block 26300753, authorization list |
| E02 | [Subsequent sweep tx](https://etherscan.io/tx/0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3) | Ethereum mainnet | Receipt, input, token logs, block 26300770 |
| A01 | [Binance 14 label](https://etherscan.io/address/0x28c6c06298d514db089934071355e5743bf21d60) | Explorer labeling | Account history and code |
| A02 | [Delegated-code account](https://etherscan.io/address/0x63e842b054bd624a465454d533c33f573e9c6fae) | Ethereum mainnet | Bytecode and deployment |
| R01 | [Cross-chain loss](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history) | TRM Labs | Third-party valuation, not independently reproduced |
| R02 | [TraderTraitor attribution](https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack) | FBI | Law-enforcement assessment |

## Confidence scale

- **Direct observation** — reproducible from a trusted Ethereum node.
- **Reported** — explicit statement by an identifiable organization.
- **Inferred** — interpretation based on several observed facts.
- **Unknown** — public evidence insufficient to establish a claim.

## Integrity procedure

Record the chain ID (1), full transaction hashes, returned block hashes, the UTC timestamp, your RPC provider and the moment you queried the endpoint. For historical code use an archive-capable endpoint. Do not merge chain-level values with off-chain estimates without labeling the source.
