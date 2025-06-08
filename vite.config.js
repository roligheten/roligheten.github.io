/** @type {import('vite').UserConfig} */
import { resolve } from 'node:path'

export default {
    server: {
        port: 3000,
    },
    base: '/',
    build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
            card: resolve(__dirname, 'card/index.html'),
            math: resolve(__dirname, 'math/index.html'),
          },
        },
      },
}
