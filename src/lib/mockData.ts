import type { CalendarEvent, FamilyMember } from "./types";

export const MOCK_MEMBERS: FamilyMember[] = [
  { id: "mom", name: "엄마", color: "mint" },
  { id: "dad", name: "아빠", color: "peach" },
  { id: "grandma", name: "할머니", color: "lavender" },
  { id: "me", name: "나", color: "sky" },
];

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "evt-1",
    date: "2026-07-27",
    title: "태권도 학원 픽업",
    startTime: "16:30",
    pickupPersonId: "mom",
    pickupChecked: false,
    mealMemo: "저녁은 김치찌개",
    mealChecked: false,
    homework: [
      { id: "hw-1", text: "수학 문제집 3쪽", done: false },
      { id: "hw-2", text: "일기 쓰기", done: true },
    ],
    comments: [
      {
        id: "c-1",
        authorId: "dad",
        authorName: "아빠",
        text: "오늘 회의가 늦게 끝나서 픽업 어려울 것 같아요, 엄마 부탁드려요!",
        createdAt: "2026-07-26T09:00:00Z",
      },
    ],
  },
  {
    id: "evt-2",
    date: "2026-07-29",
    title: "피아노 레슨",
    startTime: "15:00",
    pickupPersonId: "grandma",
    pickupChecked: false,
    mealMemo: "",
    mealChecked: false,
    homework: [],
    comments: [],
  },
];
