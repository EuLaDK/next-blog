/**
 * 根据正文段落下标生成稳定的目录锚点 ID。
 * @param index 正文段落下标
 */
export function getPostSectionId(index: number): string {
  return `section-${index + 1}`
}
