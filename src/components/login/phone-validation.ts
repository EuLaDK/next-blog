/**
 * 判断输入内容是否为中国大陆手机号格式。
 * @param phoneNumber 用户输入的手机号
 */
export function isMainlandChinaPhoneNumber(phoneNumber: string): boolean {
  return /^1[3-9]\d{9}$/.test(phoneNumber)
}
