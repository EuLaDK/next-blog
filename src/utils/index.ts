/**
 * 把日期对象格式化为 yyyy-MM-dd 字符串。
 * @param dateInput 需要格式化的日期，允许为空
 */
export function formatDateToYYYYMMDD(dateInput: Date | null): string {
  if (!dateInput) {
    return ""
  }

  const date = new Date(dateInput)

  // 检查日期是否有效
  if (Number.isNaN(date.getTime())) {
    throw new Error("无效的日期输入")
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}
