import type { FamilyMember } from "./types";

const COLOR_ORDER: FamilyMember["color"][] = [
  "mint",
  "peach",
  "lavender",
  "sky",
];

export function nextMemberColor(usedCount: number): FamilyMember["color"] {
  return COLOR_ORDER[usedCount % COLOR_ORDER.length];
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
