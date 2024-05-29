import process from 'node:process'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import type { RollupOptions } from 'rollup'

interface PackageInfo {
  name: string
  cjs?: boolean
  mjs?: boolean
  dts?: boolean
  external?: string[]
}
const pkgs: PackageInfo[] = [
  {
    name: 'all',
  },
  {
    name: 'color',
    external: ['lodash-es', 'dayjs'],
  },
  {
    name: 'format',
  },
  {
    name: 'tree',
    external: ['dayjs'],
  },
]

const pkgMap: Record<string, RollupOptions[]> = {}
for (const pkg of pkgs) {
  const config: RollupOptions[] = []
  const input = `packages/${pkg.name}/index.ts`
  if (pkg.cjs !== false) {
    config.push({
      input,
      output: {
        file: `packages/${pkg.name}/dist/index.cjs`,
        format: 'cjs',
      },
      plugins: [
        esbuild(),
        json(),
        resolve(),
      ],
      external: pkg.external || [],
    })
  }

  if (pkg.mjs !== false) {
    config.push({
      input,
      output: {
        file: `packages/${pkg.name}/dist/index.mjs`,
        format: 'es',
      },
      plugins: [
        esbuild(),
        json(),
        resolve(),
      ],
      external: pkg.external || [],
    })
  }

  if (pkg.dts !== false) {
    config.push({
      input,
      output: [
        { file: `packages/${pkg.name}/dist/index.d.cts` },
        { file: `packages/${pkg.name}/dist/index.d.mts` },
        { file: `packages/${pkg.name}/dist/index.d.ts` },
      ],
      plugins: [
        dts(),
        resolve(),
      ],
      external: pkg.external || [],
    })
  }

  pkgMap[pkg.name] = config
}

// 使用环境变量选择特定的 package 配置
const selectedPackage = process.env.PACKAGE

export default pkgMap[selectedPackage as keyof typeof pkgMap] as RollupOptions[]
