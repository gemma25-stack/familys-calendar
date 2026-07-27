export function josa(word: string, withBatchim: string, withoutBatchim: string): string {
  const lastChar = word.charCodeAt(word.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return withoutBatchim;
  const hasBatchim = (lastChar - 0xac00) % 28 !== 0;
  return hasBatchim ? withBatchim : withoutBatchim;
}
