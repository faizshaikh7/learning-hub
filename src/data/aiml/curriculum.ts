import type { CurriculumTopic } from '@/types'
import { AIML_P0 } from './curriculum-p0'
import { AIML_P1 } from './curriculum-p1'
import { AIML_P2 } from './curriculum-p2'
import { AIML_P3 } from './curriculum-p3'
import { AIML_P4 } from './curriculum-p4'
import { AIML_P5 } from './curriculum-p5'
import { AIML_P6 } from './curriculum-p6'
import { AIML_P7 } from './curriculum-p7'

/** Full AI/ML In-Depth curriculum: math foundations to production ML. */
export const AIML_CURRICULUM: CurriculumTopic[] = [
  ...AIML_P0, ...AIML_P1, ...AIML_P2, ...AIML_P3,
  ...AIML_P4, ...AIML_P5, ...AIML_P6, ...AIML_P7,
]
