import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs/esm'
import * as _ from 'lodash-es'

export function timeFormat(date: ConfigType, template = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(template)
}

export function dateFormat(date: ConfigType, template = 'YYYY-MM-DD') {
  return dayjs(date).format(template)
}

export function commafyFormat(number: string | number, separator = ',') {
  // 将数字转换为字符串并分离整数部分和小数部分
  const parts: string[] = number.toString().split('.')
  const integerPart: string = parts[0]
  const decimalPart: string = parts.length > 1 ? parts[1] : ''

  // 格式化整数部分
  const formattedIntegerPart: string = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

  // 拼接整数部分和小数部分
  return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart
}

export function decimalFormat(number: string | number, digits?: number) {
  if (_.isNil(number))
    return ''

  return digits ? commafyFormat(Number(number).toFixed(digits)) : commafyFormat(number)
}

export function amountFormat(amount: string | number, prefix = '') {
  if (_.isNil(amount))
    return ''
  return prefix ? `${prefix} ${commafyFormat(decimalFormat(amount, 2))}` : commafyFormat(decimalFormat(amount, 2))
}

export function percentFormat(number: string | number | undefined, digits?: number) {
  if (_.isNil(number))
    return ''

  return `${decimalFormat(Number(number) * 100, digits)} %`
}

export function fileSizeFormat(size: number | string) {
  if (_.isNaN(Number(size)) || Number(size) === 0)
    return ''
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let fileSize = Number(size)
  const unitIndex = fileSize === 0 ? 0 : Math.floor(Math.log(fileSize) / Math.log(1024))
  fileSize = fileSize / 1024 ** unitIndex // 1024的unitIndex次方
  return `${fileSize.toFixed(2)} ${units[unitIndex]}`
}

export function amountUnitFormat(amount: number | string) {
  if (_.isNaN(Number(amount)))
    return ''
  if (amount === 0)
    return 0
  const units = ['', '万', '亿', '万亿']
  let amountNumber = Number(amount)
  const unitIndex = Math.floor(Math.log(Math.abs(amountNumber)) / Math.log(10000))
  amountNumber = amountNumber / 10000 ** unitIndex // 10000的unitIndex次方
  return unitIndex >= 0 ? `${amountFormat(amountNumber)} ${units[unitIndex]}` : amountFormat(amountNumber)
}
