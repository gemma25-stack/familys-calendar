export type MemberColor =
  | "mint"
  | "peach"
  | "lavender"
  | "sky"
  | "rose"
  | "lemon"
  | "grape";

export type FamilyMember = {
  id: string;
  name: string;
  color: MemberColor;
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
  pickupMemo: string;
  mealMemo: string;
  mealChecked: boolean;
  homework: HomeworkItem[];
  comments: Comment[];
  recurrenceId?: string;
};

export const MEMBER_COLOR_CLASSES: Record<
  MemberColor,
  { chip: string; ring: string; swatch: string }
> = {
  mint: {
    chip: "bg-mint text-[#2f5747]",
    ring: "ring-mint-dark",
    swatch: "bg-mint",
  },
  peach: {
    chip: "bg-peach text-[#7a4a1a]",
    ring: "ring-peach-dark",
    swatch: "bg-peach",
  },
  lavender: {
    chip: "bg-lavender text-[#4b3576]",
    ring: "ring-lavender-dark",
    swatch: "bg-lavender",
  },
  sky: {
    chip: "bg-sky-200 text-sky-900",
    ring: "ring-sky-400",
    swatch: "bg-sky-200",
  },
  rose: {
    chip: "bg-rose text-[#8a3552]",
    ring: "ring-rose-dark",
    swatch: "bg-rose",
  },
  lemon: {
    chip: "bg-lemon text-[#7a6a10]",
    ring: "ring-lemon-dark",
    swatch: "bg-lemon",
  },
  grape: {
    chip: "bg-grape text-[#5a3a75]",
    ring: "ring-grape-dark",
    swatch: "bg-grape",
  },
};

export const MEMBER_COLOR_ORDER: MemberColor[] = [
  "mint",
  "peach",
  "lavender",
  "sky",
  "rose",
  "lemon",
  "grape",
];
