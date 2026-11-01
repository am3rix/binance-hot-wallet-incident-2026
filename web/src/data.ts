import type { Chapter, Evidence } from './types';

export const evidence: Evidence[] = [
  { id: 'TX-01', title: 'Type-4 authorization', address: '0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b', url: 'https://etherscan.io/tx/0xad99264d5532ae0dd04b2004eebda05f25657e70dacb764f7ac8d4ccd051298b', classification: 'On-chain', note: 'Reported block 26,300,753. Inspect the transaction type and authorization list.' },
  { id: 'TX-02', title: 'Subsequent Ethereum sweep', address: '0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3', url: 'https://etherscan.io/tx/0x53bd38b816c23e74134786c29a8c18d792777998a3b9326047b583100e88e2f3', classification: 'On-chain', note: 'Reported block 26,300,770. Compare receipt and token transfer logs.' },
  { id: 'ADDR-01', title: 'Binance-labeled wallet', address: '0x28c6c06298d514db089934071355e5743bf21d60', url: 'https://etherscan.io/address/0x28c6c06298d514db089934071355e5743bf21d60', classification: 'Reported', note: 'Explorer labeling is an attribution. It is not proof of legal ownership.' },
  { id: 'ADDR-02', title: 'Reported delegated-code address', address: '0x63e842b054bd624a465454d533c33f573e9c6fae', url: 'https://etherscan.io/address/0x63e842b054bd624a465454d533c33f573e9c6fae', classification: 'Reported', note: 'Examine bytecode, contract metadata and traces where available.' },
];
const protocol = { label: 'Ethereum EIP-7702 specification', href: 'https://eips.ethereum.org/EIPS/eip-7702' };
const trm = { label: 'TRM Labs incident research', href: 'https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history' };
const fbi = { label: 'FBI attribution statement', href: 'https://www.fbi.gov/investigate/cyber/alerts/2026/north-korea-responsible-for-6-billion-binance-attack' };
const bitquery = { label: 'Bitquery on-chain analysis', href: 'https://bitquery.io/investigations/binance-hack' };
export const chapters: Chapter[] = [
  {
    id: 'brief', title: 'The incident', subtitle: 'Scope and research method', reading: '4 min',
    kicker: 'Overview', heading: 'A reconstruction, not an attribution claim.',
    paragraphs: [
      'On 29 October 2026, Binance disclosed unauthorized movements of digital assets. TRM Labs subsequently estimated approximately USD 6.36 billion in transfers across ten networks. The figure is a third-party transfer-time valuation; this project does not recalculate the entire cross-chain loss.',
      'The public Ethereum record gives us a narrower, reproducible question: which authorization transaction preceded the major sweep, and what does the protocol establish about that sequence?',
      'A transaction receipt is evidence of execution, not a record of who controlled a workstation or authorized the operation. We therefore separate direct chain observations, reporting from identifiable organizations, and questions that remain unresolved.'
    ],
    takeaways: [
      { heading: 'Observable', body: 'Block numbers, transaction envelopes, status and token transfer logs.' },
      { heading: 'Attributed', body: 'Wallet labels, operational disclosures and law-enforcement conclusions.' },
      { heading: 'Unknown', body: 'The initial entry point, signature origin and individual operator identity.' }
    ], evidence: ['TX-01','TX-02'], sources:[trm,bitquery],
    question: { text: 'Which finding can be reproduced from public Ethereum data?', options: ['How the attacker entered the internal network','The block containing the type-4 transaction','The identity of the operator'], correct: 1, explanation: 'Block numbers and transaction types are public. Initial access and operator identity require other evidence.' }
  },
  {
    id:'timeline', title:'Sequence of events', subtitle:'From staging to containment', reading:'6 min',
    kicker:'Chronology', heading:'Read the sequence before interpreting intent.',
    paragraphs:[
      'TRM Labs identified preparatory transactions and contract tests on 28 October. The presence of rehearsal activity is consistent with planning, but the record alone does not identify the party responsible.',
      'The published cross-chain timeline begins near 20:05 UTC on 29 October. At 20:20:59 UTC an Ethereum type-4 transaction was included in block 26,300,753. A major subsequent sweep is recorded at 20:24:23 UTC in block 26,300,770.',
      'The sequence establishes ordering. It does not prove the internal compromise described in preliminary company reporting, nor does it indicate that every transfer across other networks used EIP-7702.'
    ],
    takeaways:[
      {heading:'28 October', body:'Third-party investigators report funding and preparation.'},
      {heading:'29 October · 20:20 UTC',body:'Ethereum authorization transaction: block 26,300,753.'},
      {heading:'29 October · 20:24 UTC',body:'Subsequent sweep: block 26,300,770.'}
    ], evidence:['TX-01','TX-02'], sources:[trm,bitquery],
    question:{text:'What does a later block number establish?',options:['The identity of the person who signed','The chronological order of included transactions','That every later transfer was unauthorized'],correct:1,explanation:'Block inclusion gives ordering; authorization intent and identity are not public block fields.'}
  },
  {
    id:'authorization', title:'EIP-7702',subtitle:'Account delegation and signatures', reading:'9 min',
    kicker:'Protocol', heading:'The difference between signature validity and consent.',
    paragraphs:[
      'EIP-7702 defines a set-code transaction type (0x04). Its authorization list contains a chain identifier, a delegate address, a nonce and signature components. Ethereum checks the authorization under protocol rules before any account-code update takes effect.',
      'An accepted authorization may set the account code to 0xef0100 followed by the delegate address. Later calls can execute the delegate code in the account context. This does not require transferring a private key to the contract, and it does not imply the cryptographic protocol was broken.',
      'Researchers reported fifty authorization tuples within the incident-linked transaction. That count alone does not establish fifty effective delegations; nonce and other validity checks determine the actual state transition. Public transaction fields cannot disclose how a cryptographically valid signature came to be produced.'
    ],
    takeaways:[
      {heading:'Transaction type',body:'0x04 carries an authorization list alongside transaction data.'},
      {heading:'Code marker',body:'0xef0100 + a 20-byte address signifies delegation.'},
      {heading:'Trust boundary',body:'A valid signature does not establish informed approval.'}
    ], evidence:['TX-01','ADDR-02'],sources:[protocol,bitquery],
    question:{text:'Does fifty authorization tuples mean fifty successful delegations?',options:['Yes, each tuple always executes','No, authorization checks determine which are effective','Yes, if the transaction succeeded'],correct:1,explanation:'Each authorization is evaluated under the protocol; signature presence is not equivalent to a state change.'}
  },
  {
    id:'execution',title:'Transaction execution',subtitle:'Receipts, events and account context',reading:'7 min',
    kicker:'Execution',heading:'Follow the receipt, not the headline.',
    paragraphs:[
      'The Ethereum sweep followed the authorization transaction. A receipt exposes transaction status and emitted logs. ERC-20 Transfer events can describe asset movements, while bytecode and execution traces help explain which calls produced those events.',
      'A transfer event is not equivalent to a complete beneficial-ownership graph. Tokens may move through contracts, services or shared intermediaries. Researchers therefore treat address attribution as a separate source-supported step.',
      'The public record is valuable for reconstructing effects. It cannot show private signing-service configuration, employee authentication or whether a transaction violated internal policy.'
    ],
    takeaways:[
      {heading:'Envelope',body:'From, to, type, block number and calldata.'},
      {heading:'Receipt',body:'Status and event logs emitted during execution.'},
      {heading:'Interpretation',body:'Transfer logs support movement, not personal identity.'}
    ],evidence:['TX-01','TX-02','ADDR-01'],sources:[protocol,bitquery],
    question:{text:'What does an ERC-20 Transfer event prove?',options:['A token event was emitted during execution','The recipient is the attacker','A private key was stolen'],correct:0,explanation:'The event is public execution data. Ownership attribution and compromise mechanism need additional evidence.'}
  },
  {
    id:'tracing',title:'Tracing the funds', subtitle:'Cross-chain evidence boundaries',reading:'6 min',
    kicker:'Tracing',heading:'An estimate depends on its observation window.',
    paragraphs:[
      'TRM Labs reports transfers across multiple chains and values them using token prices around the time of movement. Other investigators use different cut-off times and may group networks differently, producing slightly different totals.',
      'On-chain tracing is strongest when it preserves chain IDs, complete transaction hashes, block numbers and transfer direction. Any exchange or intermediary labels should be attributed to their source and verified independently where possible.',
      'Freezing stablecoins on issuer-controlled contracts can constrain movement, but it is not the same thing as returning stolen assets to their original holder. Likewise, replenishing customer balances from company reserves does not mean the attacker returned the funds.'
    ],
    takeaways:[
      {heading:'Reported USD 6.36B',body:'TRM Labs transfer-time aggregate across ten networks.'},
      {heading:'Freeze versus recovery',body:'Restricting movement does not automatically restore ownership.'},
      {heading:'Reconciliation',body:'Chain coverage, price and timestamp must accompany totals.'}
    ],evidence:['TX-02','ADDR-01'],sources:[trm,bitquery],
    question:{text:'Why can two valid cross-chain totals differ?',options:['Blockchain hashes are arbitrary','Different pricing times and network coverage','All stablecoins are always frozen'],correct:1,explanation:'Dollar totals are valuations built from a defined selection of transfers and times.'}
  },
  {
    id:'attribution',title:'Attribution',subtitle:'Reported hypotheses and uncertainty',reading:'6 min',
    kicker:'Assessment',heading:'Distinguish attribution from identification.',
    paragraphs:[
      'Binance initially described possible compromise of a DevOps laptop and a withdrawal-related service container, later noting additional compromise points. These are operational statements, not facts directly observable in Ethereum transactions.',
      'On 31 October 2026, the FBI publicly attributed the operation to the DPRK-associated TraderTraitor cluster. That assessment can incorporate intelligence beyond public blockchain metadata; readers cannot reproduce all such intelligence using a block explorer.',
      'We do not attribute the attack to a particular named individual. Nor should a high-confidence cluster attribution be restated as proof of a specific malware path without further evidence.'
    ],
    takeaways:[
      {heading:'Company statement',body:'An initial intrusion hypothesis, subject to revision.'},
      {heading:'FBI assessment',body:'The TraderTraitor cluster is attributed to the DPRK.'},
      {heading:'Unresolved',body:'Person, exact signing failure and complete internal timeline.'}
    ],evidence:['ADDR-01'],sources:[fbi,trm],
    question:{text:'What does the FBI attribution establish for a public case study?',options:['An official assessment of an activity cluster','The identity of every person who participated','A reproducible on-chain malware infection'],correct:0,explanation:'Cluster attribution is an official assessment; operator identity and malware mechanism require separate proof.'}
  },
  {
    id:'assessment', title:'Your assessment',subtitle:'Evaluate evidence quality',reading:'5 min',
    kicker:'Review',heading:'Write a conclusion the evidence can sustain.',
    paragraphs:[
      'A useful forensic conclusion identifies the strongest public observation, the reporting source for claims outside the chain, and the unresolved dependencies. Precision matters more than certainty.',
      'Suggested conclusion: an Ethereum type-4 authorization transaction preceded a major asset sweep involving a Binance-labeled wallet. Published investigations describe cross-chain loss and an operational intrusion scenario, while the FBI attributes the incident to TraderTraitor. The public chain does not establish the precise initial access vector.',
      'For further work, preserve exact block identifiers, verify account code at historical states with an archive node, and cross-check transaction traces and source statements. Do not infer personal identity from proximity to a suspicious address.'
    ],
    takeaways:[
      {heading:'Evidence',body:'Can another researcher reproduce the claim?'},
      {heading:'Attribution',body:'Is the entity label tied to a clear source?'},
      {heading:'Limit',body:'What remains unknowable from the examined data?'}
    ],evidence:['TX-01','TX-02'],sources:[protocol,trm,fbi],
    question:{text:'Which conclusion is most defensible?',options:['The EIP itself was cryptographically broken','The initial infection happened through a proven phishing message','The recorded authorization preceded the reported sweep; initial access remains uncertain'],correct:2,explanation:'The public records support execution sequence, but not one specific intrusion story.'}
  }
];
