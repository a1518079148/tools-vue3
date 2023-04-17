import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { siconPlugin } from 'sicon-plugin'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { PluginOption } from 'vite'
import { viteVar, viteDef } from 'vite-var'
import { globalType } from '../env/globalVar'
export const getPlugins = (env: globalType) => {
    const isBuild = env.env.pro === 'build'
    const plugin: PluginOption[] = [
        viteVar(env),
        viteDef(env.env.pro),
        siconPlugin({
            isBuild,
            comUrl: './src/components/sicon',
            include: {
                'Ant': ['plus']
            }
        }),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith('lottie-') || tag.startsWith('marquee')
                }
            }
        }),
        visualizer({
            open: env.env.BUILDVIEW,
            gzipSize: true,
            brotliSize: true
        }) as any
    ]
    if (isBuild) {
        plugin.push(
            AutoImport({
                dts: './build/auto/auto-imports.d.ts',
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                dts: './build/auto/components.d.ts',
                resolvers: [ElementPlusResolver()]
            })
        )
    }
    return plugin
}
