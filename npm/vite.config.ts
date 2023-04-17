import path from 'path'
import { defineConfig } from 'vite'
import { viteProxy } from 'vite-var'
import { getBuild, getPlugins } from './build/config'
import { globalVar } from './build/env/globalVar'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = globalVar(command, mode)
    return {
        resolve: {
            alias: {
                '~/': `${path.resolve(__dirname, 'src')}/`
            }
        },
        plugins: getPlugins(env),
        server: {
            host: '0.0.0.0',
            port: 9400,
            open: false,
            https: false,
            proxy: viteProxy({
                '/api': 'http://192.168.1.101:30004'
            })
        },
        build: getBuild(env)
    }
})
