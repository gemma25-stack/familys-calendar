"use client";

import { useMemo, useState } from "react";
import type { CalendarEvent, FamilyMember } from "@/lib/types";
import { MEMBER_COLOR_CLASSES } from "@/lib/types";
import {
  addMonths,
  addWeeks,
  format,
  getMonthGrid,
  getWeekGrid,
  isSameDay,
  isSameMonth,
  isToday,
  subMonths,
  subWeeks,
  toDateKey,
} from "@/lib/date";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type Props = {
  events: CalendarEvent[];
  members: FamilyMember[];
  onSelectEvent: (event: CalendarEvent) => void;
};

export default function CalendarView({
  events,
  members,
  onSelectEvent,
}: Props) {
  const [mode, setMode] = useState<"month" | "week">("month");
  const [anchor, setAnchor] = useState(new Date());

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const evt of events) {
      const list = map.get(evt.date) ?? [];
      list.push(evt);
      map.set(evt.date, list);
    }
    return map;
  }, [events]);

  const days = useMemo(
    () => (mode === "month" ? getMonthGrid(anchor) : getWeekGrid(anchor)),
    [mode, anchor]
  );

  function goPrev() {
    setAnchor((d) => (mode === "month" ? subMonths(d, 1) : subWeeks(d, 1)));
  }
  function goNext() {
    setAnchor((d) => (mode === "month" ? addMonths(d, 1) : addWeeks(d, 1)));
  }
  function goToday() {
    setAnchor(new Date());
  }

  function memberFor(id: string | null) {
    return members.find((m) => m.id === id);
  }

  return (
    <section className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="rounded-full px-2 py-1 text-muted hover:bg-black/5"
            aria-label="이전"
          >
            ‹
          </button>
          <span className="min-w-[110px] text-center text-lg font-semibold text-foreground">
            {format(anchor, mode === "month" ? "yyyy년 M월" : "yyyy년 M월")}
          </span>
          <button
            onClick={goNext}
            className="rounded-full px-2 py-1 text-muted hover:bg-black/5"
            aria-label="다음"
          >
            ›
          </button>
          <button
            onClick={goToday}
            className="ml-1 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-muted hover:bg-black/5"
          >
            오늘
          </button>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setMode("month")}
            className={`rounded-full px-3 py-1 font-medium ${
              mode === "month"
                ? "bg-mint text-[#2f5747]"
                : "text-muted hover:bg-black/5"
            }`}
          >
            월간
          </button>
          <button
            onClick={() => setMode("week")}
            className={`rounded-full px-3 py-1 font-medium ${
              mode === "week"
                ? "bg-mint text-[#2f5747]"
                : "text-muted hover:bg-black/5"
            }`}
          >
            주간
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted sm:text-sm">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="py-1 font-medium">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = toDateKey(day);
          const dayEvents = eventsByDate.get(key) ?? [];
          const outOfMonth = mode === "month" && !isSameMonth(day, anchor);
          const today = isToday(day);

          return (
            <div
              key={key}
              className={`flex min-h-[64px] flex-col gap-1 rounded-xl p-1 sm:min-h-[88px] sm:p-2 ${
                today
                  ? "bg-peach/40 ring-2 ring-peach-dark"
                  : "bg-background"
              } ${outOfMonth ? "opacity-35" : ""}`}
            >
              <span
                className={`text-xs font-semibold sm:text-sm ${
                  today ? "text-peach-dark" : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((evt) => {
                  const person = memberFor(evt.pickupPersonId);
                  return (
                    <button
                      key={evt.id}
                      onClick={() => onSelectEvent(evt)}
                      className={`truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-medium sm:text-xs ${
                        person
                          ? MEMBER_COLOR_CLASSES[person.color].chip
                          : "bg-black/5 text-foreground"
                      }`}
                      title={evt.title}
                    >
                      {evt.title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
