import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts', // Entry point
  output: [
    {
      file: 'dist/plotlab.cjs.js',
      format: 'cjs', // CommonJS format
      sourcemap: true,
    },
    {
      file: 'dist/plotlab.esm.js',
      format: 'esm', // ES Module format
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),              // Resolves node_modules imports
    commonjs(),             // Converts CommonJS modules to ES6
    typescript(),           // Compiles TypeScript
  ],
};
