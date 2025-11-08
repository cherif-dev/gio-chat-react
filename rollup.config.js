import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const isWatchMode = process.env.ROLLUP_WATCH === 'true' || process.argv.includes('--watch');

const baseConfig = {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      svgr({
        exportAsDefault: false,
        svgo: true,
        titleProp: true,
        ref: true,
        include: ['**/*.svg'],
      }),
      url({
        include: [
          '**/*.png',
          '**/*.jpg',
          '**/*.jpeg',
          '**/*.gif',
          '**/*.webp',
          '**/*.mp3',
          '**/*.wav',
        ],
        limit: 8192, // Files smaller than 8KB will be inlined as base64
        fileName: '[name][extname]',
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: ['react', 'react-dom', 'axios', '@supabase/supabase-js', 'date-fns'],
  };

const dtsConfig = {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css$/],
  };

export default isWatchMode ? [baseConfig] : [baseConfig, dtsConfig];
