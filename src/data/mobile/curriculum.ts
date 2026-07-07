import type { CurriculumTopic } from '@/types'
import { MOBILE_P0 } from './curriculum-p0'
import { MOBILE_P1 } from './curriculum-p1'
import { MOBILE_P2 } from './curriculum-p2'
import { MOBILE_P3 } from './curriculum-p3'
import { MOBILE_P4 } from './curriculum-p4'
import { MOBILE_P5 } from './curriculum-p5'
import { MOBILE_P6 } from './curriculum-p6'
import { MOBILE_P7 } from './curriculum-p7'
import { MOBILE_P8 } from './curriculum-p8'
import { MOBILE_P9 } from './curriculum-p9'
import { MOBILE_P10 } from './curriculum-p10'

/** Full Mobile Development curriculum: concept-first, framework-agnostic — from OS layers to release. */
export const MOBILE_CURRICULUM: CurriculumTopic[] = [
  ...MOBILE_P0, ...MOBILE_P1, ...MOBILE_P2, ...MOBILE_P3,
  ...MOBILE_P4, ...MOBILE_P5, ...MOBILE_P6, ...MOBILE_P7,
  ...MOBILE_P8, ...MOBILE_P9, ...MOBILE_P10,
]
