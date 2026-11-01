export type ChapterId = 'brief' | 'timeline' | 'authorization' | 'execution' | 'tracing' | 'attribution' | 'assessment';
export type Confidence = 'On-chain' | 'Reported' | 'Unresolved';
export type Evidence = { id: string; title: string; address: string; url: string; classification: Confidence; note: string };
export type Chapter = {
 id: ChapterId; title: string; subtitle: string; reading: string;
 kicker: string; heading: string; paragraphs: string[];
 takeaways: { heading: string; body: string }[];
 evidence: string[]; sources: { label: string; href: string }[];
 question?: { text: string; options: string[]; correct: number; explanation: string };
};
