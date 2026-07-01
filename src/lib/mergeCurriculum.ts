import type { CurriculumTopic } from '@/types'

/**
 * Weaves extra topics into a base curriculum at the correct pedagogical
 * position — each extra is placed immediately after its "anchor" topic so the
 * learning sequence (and prev/next navigation) stays perfectly linked, rather
 * than tacked on at the end.
 *
 * @param base     The ordered base curriculum.
 * @param extras   Additional topics to weave in.
 * @param anchors  Map of `extraTopicId -> anchorTopicId` (insert extra AFTER anchor).
 *                 If an anchor isn't found, the extra is appended to the end.
 */
export function weaveTopics(
  base: CurriculumTopic[],
  extras: CurriculumTopic[],
  anchors: Record<string, string>,
): CurriculumTopic[] {
  const result = [...base]
  for (const extra of extras) {
    const anchorId = anchors[extra.id]
    const idx = anchorId ? result.findIndex(t => t.id === anchorId) : -1
    if (idx === -1) result.push(extra)
    else result.splice(idx + 1, 0, extra)
  }
  // Renumber orderIndex within each phase so it reflects the real sequence
  const perPhase = new Map<string, number>()
  return result.map(t => {
    const next = (perPhase.get(t.phaseName) ?? 0) + 1
    perPhase.set(t.phaseName, next)
    return { ...t, orderIndex: next }
  })
}
