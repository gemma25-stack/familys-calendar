export type FamilyMember = {
  id: string;
  name: string;
  color: "mint" | "peach" | "lavender" | "sky";
};

export type HomeworkItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
};

export type CalendarEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  startTime?: string;
  endTime?: string;
  pickupPersonId: string | null;
  pickupChecked: boolean;
  mealMemo: string;
  mealChecked: boolean;
  homework: HomeworkItem[];
  comments: Comment[];
};

export const MEMBER_COLOR_CLASSES: Record<
  FamilyMember["color"],
  { chip: string; ring: string }
> = {
  mint: { chip: "bg-mint text-[#2f5747]", ring: "ring-mint-dark" },
  peach: { chip: "bg-peach text-[#7a4a1a]", ring: "ring-peach-dark" },
  lavender: { chip: "bg-lavender text-[#4b3576]", ring: "ring-lavender-dark" },
  sky: { chip: "bg-sky-200 text-sky-900", ring: "ring-sky-400" },
};
