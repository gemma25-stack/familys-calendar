import { MEMBER_COLOR_ORDER, type MemberColor } from "./types";

export function nextMemberColor(usedCount: number): MemberColor {
  return MEMBER_COLOR_ORDER[usedCount % MEMBER_COLOR_ORDER.length];
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
