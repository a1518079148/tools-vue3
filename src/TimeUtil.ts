import { DateType } from './types/common'

/**
 * 时间操作工具类
 */
export default class TimeUtil {
    /**
     *  获取当前日期是周几
     */
    static getWeek() {
        let a = new Array('日', '一', '二', '三', '四', '五', '六')
        let week = new Date().getDay()
        return '周' + a[week]
    }

    /**
     * 获取当前时间之前的偏移时间
     * @param dateType
     * @param offset
     * @param time -不传表示当前
     * @returns
     */
    static getTimeOffset = (dateType: DateType, offset: number, time?: number) => {
        let timeDate: Date = time ? new Date(time) : new Date()
        let year = timeDate.getFullYear()
        let month = timeDate.getMonth()
        let day = timeDate.getDate()
        let hour = timeDate.getHours()

        switch (dateType) {
            case DateType.year:
                timeDate.setFullYear(year - offset)
                break
            case DateType.month:
                timeDate.setMonth(month - offset)
                break
            case DateType.day:
                timeDate.setDate(day - offset)
                break
            case DateType.hour:
                timeDate.setHours(hour - offset)
                break
        }
        // console.log(timeDate.Format());
        return timeDate.getTime()
    }

    /**
     * 根据时间类型获取当前时间戳
     */
    static getTime = (dateType: DateType) => {
        let timeDate: Date = new Date()
        let year = timeDate.getFullYear()
        let month = timeDate.getMonth()
        let day = timeDate.getDate()
        let hour = timeDate.getHours()

        switch (dateType) {
            case DateType.year:
                timeDate = new Date(year, 0, 1, 0, 0, 0, 0)
                break
            case DateType.month:
                timeDate = new Date(year, month, 1, 0, 0, 0, 0)
                break
            case DateType.day:
                timeDate = new Date(year, month, day, 0, 0, 0, 0)
                break
            default:
                timeDate = new Date(year, month, day, hour, 0, 0, 0)
                break
        }
        // console.log(timeDate.Format());
        return timeDate.getTime()
    }

    /**
     * 将数据处理为当前时间之前的值(即将长度截取为当前月或日或时之前的所有时间)
     * @param dataArray
     * @param timeType
     * @param time 传值时进行比较是否是当前年、月、日，如果不是直接返回
     * @returns
     */
    static parseData = (dataArray: Array<any>, timeType: DateType, time?: number) => {
        let thisDate = new Date()
        let num = 1

        let timeDate: Date = undefined as any
        if (time) timeDate = new Date(time)
        let eqYear = false
        let eqMonth = false
        let eqDate = false
        if (timeDate) {
            eqYear = timeDate.getFullYear() == thisDate.getFullYear()
            eqMonth = timeDate.getMonth() == thisDate.getMonth()
            eqDate = timeDate.getDate() == thisDate.getDate()
        }

        switch (timeType) {
            case DateType.year:
                num = thisDate.getMonth() + 1
                if (timeDate && !eqYear) return dataArray
                break
            case DateType.month:
                num = thisDate.getDate()
                if (timeDate && (!eqYear || !eqMonth)) return dataArray
                break
            case DateType.day:
                num = thisDate.getHours()
                if (timeDate && (!eqYear || !eqMonth || !eqDate)) return dataArray
                break
            case DateType.hour:
                return dataArray
            default:
                break
        }

        if (num == 1) return []

        return dataArray.splice(0, num - 1)
    }

    /**
     * 根据时间类型进行偏移1个单位转换的整数时间
     * @param option
     * @returns
     */
    static offset = (option: { time: number; timeType: DateType; formats?: boolean }) => {
        let dateT = new Date(option.time)
        let formatStr = 'MM'
        if (option.timeType === DateType.year) {
            dateT.setMonth(dateT.getMonth() - 1)
        } else if (option.timeType === DateType.month) {
            dateT.setDate(dateT.getDate() - 1)
            formatStr = 'dd'
        } else if (option.timeType === DateType.day) {
            dateT.setHours(dateT.getHours() - 1)
            formatStr = 'hh'
        }
        return option.formats ? dateT.Format() : parseInt(dateT.Format(formatStr))
    }

    /**
     * 通过时间类型格式化时间返回字符串
     * @param time
     * @param timeType
     * @returns
     */
    static format = (time: number, timeType: DateType) => {
        let format = 'yyyy-MM-dd hh:mm:ss'
        switch (timeType) {
            case DateType.year:
                format = 'yyyy'
                break
            case DateType.month:
                format = 'yyyy-MM'
                break
            case DateType.day:
                format = 'yyyy-MM-dd'
                break
            case DateType.hour:
                format = 'yyyy-MM-dd hh'
                break
            default:
                break
        }

        return new Date(time).Format(format)
    }

    /**
     * 通过时间类型格式化时间返回字符串
     * @param time
     * @param timeType
     * @returns
     */
    static formatZ = (time: number, timeType: DateType) => {
        let format = 'yyyy-MM-dd hh:mm:ss'
        let type = ''
        switch (timeType) {
            case DateType.year:
                format = 'MM'
                type = '月'
                break
            case DateType.month:
                format = 'dd'
                type = '日'
                break
            case DateType.day:
                format = 'hh'
                type = '时'
                break
            case DateType.hour:
                format = 'mm'
                type = '分'
                break
            default:
                break
        }

        return new Date(time).Format(format) + type
    }

    /**
     * 根据时间类型和开始时间得到结束时间
     * @param timeType
     * @param starttime
     * @returns
     */
    static getStarttime = (timeType: DateType, timestamp?: number) => {
        const time = timestamp ? new Date(timestamp) : new Date()

        const setYear = () => {
            timeDate = new Date(year, 0, 1, 0, 0, 0, 0)
        }
        const setMonth = () => {
            timeDate = new Date(year, month - 1, 1, 0, 0, 0, 0)
        }
        const setDay = () => {
            timeDate = new Date(year, month - 1, day, 0, 0, 0, 0)
        }
        const setHour = () => {
            timeDate = new Date(year, month - 1, day, hour, 0, 0, 0)
        }

        let timeDate: Date = new Date()
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let day = time.getDate()
        let hour = time.getHours()
        switch (timeType) {
            case DateType.year:
                setYear()
                break
            case DateType.month:
                setMonth()
                break
            case DateType.day:
                setDay()
                break
            case DateType.hour:
                setHour()
                break
            default:
                break
        }

        return timeDate.getTime()
    }

    /**
     * 根据时间类型和开始时间得到结束时间
     * @param timeType
     * @param starttime
     * @returns
     */
    static getEndtime = (timeType: DateType, starttime: number) => {
        let endTime = TimeUtil.getTimeOffset(timeType, -1, starttime)
        let thisTime = new Date().getTime()
        if (endTime > thisTime) endTime = thisTime
        return endTime
    }

    /**
     * 根据起始时间获取格式化类型
     */
    static getFormat = (startTime: number, endTime: number) => {
        const timearrSF = new Date(startTime).Format('yyyy-MM-dd')
        const timearrEF = new Date(endTime).Format('yyyy-MM-dd')
        const timearrS = timearrSF.split('-')
        const timearrE = timearrEF.split('-')
        let formatstr = 'yyyy-MM'
        if (timearrSF === timearrEF) formatstr = 'hh:mm'
        else if (timearrS[0] === timearrE[0]) formatstr = 'MM/dd'
        return formatstr
    }
}
