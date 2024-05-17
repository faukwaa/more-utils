import type { PackageManifest } from './types'

export const packages: PackageManifest[] = [
  {
    name: 'tree',
    display: '@more-utils/tree',
    description: 'JS Tree Structure Tool',
    cjs: true,
    mjs: true,
    iife: true,
    dts: true,
  },
]
