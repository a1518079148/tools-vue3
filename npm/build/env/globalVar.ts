import dev from './_dev'
import pro from './_pro'
import proview from './_proview'
import _var from './_var'

const getConf = () => {
    return {
        dev,
        pro,
        proview
    } as any
}

export const globalVar = (command: string, mode: string) => {
    const env: envType = Object.assign(getConf()[mode])
    return Object.assign(_var, { env })
}

export type envType = typeof dev & typeof pro & typeof proview
export type globalType = typeof _var & {
    /**
     * 环境变量
     */
    env: envType
}
