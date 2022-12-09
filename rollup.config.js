import commonjs from '@rollup/plugin-commonjs'
import clear from 'rollup-plugin-clear'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import fs from 'fs'
import path from 'path'
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')))

const pkgName = pkg.name

function generateOutput(type) {
  if (type === 'dts') {
    return {
      file: 'lib/index.d.ts',
      format: 'es',
      name: pkgName,
    }
  }
  return {
    file: `lib/index.${type === 'es' ? 'm' : ''}js`,
    format: type,
    name: pkgName,
  }
}

export default [
  {
    input: 'src/index.ts',
    output: [generateOutput('cjs'), generateOutput('es')],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      clear({
        targets: ['lib'],
      }),
      commonjs(),
      esbuild(),
    ],
  },
  {
    input: 'src/index.ts',
    output: generateOutput('dts'),
    plugins: [dts()],
  },
]
