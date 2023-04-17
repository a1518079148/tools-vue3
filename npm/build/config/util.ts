import fs from 'fs'
import path from 'path'

//复制文件夹
export const copyDir = async (dirurl: string, todirurl: string) => {
    const dirInfo = fs.readdirSync(dirurl)
    for (let i = 0; i < dirInfo.length; i++) {
        const item = dirInfo[i]
        const _src = path.join(dirurl, item)
        const _dist = path.join(todirurl, item)
        const info = fs.statSync(_src)

        //创建文件夹
        fs.mkdirSync(path.dirname(_dist), {
            recursive: true
        })

        if (info.isDirectory()) {
            await copyDir(_src, _dist)
        } else {
            fs.writeFileSync(_dist, fs.readFileSync(_src))
        }
    }
}

//获取目录下所有文件并在读取到文件时回调
export const readDir = async (dirurl: string, filecallback: Function) => {
    const dirInfo = fs.readdirSync(dirurl)
    for (let i = 0; i < dirInfo.length; i++) {
        const item = dirInfo[i]
        const location = path.join(dirurl, item)
        const info = fs.statSync(location)
        if (info.isDirectory()) {
            if ((await readDir(location, filecallback)) === true) return true
        } else {
            if ((await filecallback(location)) === true) return true
        }
    }
}

//删除文件夹
export const deleteDir = async (dirurl: string) => {
    let files: any = []
    if (fs.existsSync(dirurl)) {
        files = fs.readdirSync(dirurl)
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            let curPath = dirurl + '/' + file
            if (fs.statSync(curPath).isDirectory()) {
                await deleteDir(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        }
        fs.rmdirSync(dirurl)
    }
}

//读取文件
export const readFile = async (filename: string) => {
    try {
        return fs.readFileSync(filename).toString()
    } catch {
        return undefined
    }
}

//写文件，自动创建目录
export const writeFile = async (filename: string, content: string) => {
    try {
        fs.mkdirSync(path.dirname(filename), {
            recursive: true
        })
        fs.writeFileSync(filename, content)
        return true
    } catch {
        return undefined
    }
}
