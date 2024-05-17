import process from 'node:process'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import type { RollupOptions } from 'rollup'

const packages = {
  tree: {
    input: 'packages/tree/index.ts',
    output: [
      {
        file: 'packages/tree/dist/index.mjs',
        format: 'es',
      },
      {
        file: 'packages/tree/dist/index.cjs',
        format: 'cjs',
      },
      {
        file: 'packages/tree/dist/index.d.mts',
      },
      {
        file: 'packages/tree/dist/index.d.cts',
      },
      {
        file: 'packages/tree/dist/index.d.ts',
      },
    ],
    plugins: [
      esbuild(),
      json(),
      dts(),
    ],
    external: ['lodash-es'],
  },
}

// 使用环境变量选择特定的 package 配置
const selectedPackage = process.env.PACKAGE

export default (selectedPackage ? [packages[selectedPackage as keyof typeof packages]] : Object.values(packages)) as RollupOptions
