/** 前台 + API 共用手機格式檢查（寬鬆、國際可用） */

export function countPhoneDigits(phone: string): number {
  return phone.replace(/\D/g, "").length;
}

/** 至少 8、至多 15 位數字（含 +886 等） */
export function isPhoneLikelyValid(phone: string): boolean {
  const n = countPhoneDigits(phone);
  return n >= 8 && n <= 15;
}
