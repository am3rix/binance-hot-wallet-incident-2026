# Incident reconstruction

**Event:** 29 October 2026. **Research cut-off:** 31 October 2026 UTC.

## Executive summary

TRM Labs reports approximately USD 6.36 billion in unauthorized transfers from Binance-associated wallets across ten networks. Binance acknowledged a security incident and reported containment and restitution measures. These numbers are externally reported estimates, not recomputed here. [TRM](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history)

## Publicly reported intrusion scenario

Binance's initial hypothesis referred to a compromised DevOps laptop and access to a withdrawal-related service container. Later disclosures noted additional compromise points. **These are operator disclosures, not independently demonstrated on-chain facts.** The exact first access, signing authority exposure and internal approval path remain unresolved from public data.

## Preparatory signals

TRM identified funding of an operator wallet through small Tornado Cash withdrawals beginning 28 October and contract deployments and tests before the attack. Those activities are consistent with a staged operation, but isolated wallet activity must not be treated as proof of human identity.

## Attack execution

Around 20:05 UTC on 29 October, transfers began on XRP Ledger. Other networks followed. An Ethereum transaction at 20:20:59 UTC (block 26,300,753) carried a set of 50 EIP-7702 authorizations. A subsequent call at 20:24:23 UTC (block 26,300,770) produced a major asset movement. For the public transaction anchors and interpretive boundaries, see [evidence ledger](02-evidence-ledger.md).

## Impact and containment

TRM estimates the aggregate theft at USD 6.36 billion (transfer-time pricing). Issuers and protocol operators froze some tokens; a freeze is not identical to recovery by the rightful holder. Binance announced the use of company reserves and protection funds to replenish user balances. Figures refer to different snapshots and should not be conflated.

## Attribution

The [FBI advisory, dated 31 October 2026](https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack), attributes the attack to the North Korean-associated TraderTraitor activity cluster. A blockchain transfer alone cannot establish that attribution. The public record does not name an individual operator.

## Scope limitation

We cannot infer malware, private-key theft, employee conduct or a complete root cause from transaction receipts. We do not reproduce an exploit, possess internal logs or purport to verify all ten networks.

## Sources

[Binance disclosure](https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7) · [TRM Labs](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history) · [FBI](https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack)
