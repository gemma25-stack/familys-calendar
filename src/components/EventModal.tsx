"use client";

import { useState } from "react";
import type { CalendarEvent, FamilyMember } from "@/lib/types";
import { MEMBER_COLOR_CLASSES } from "@/lib/types";

type Props = {
  event: CalendarEvent;
  members: FamilyMember[];
  currentMemberId: string;
  onClose: () => void;
  onChange: (updated: CalendarEvent) => void;
};

export default function EventModal({
  event,
  members,
  currentMemberId,
  onClose,
  onChange,
}: Props) {
  const [commentText, setCommentText] = useState("");

  const pickupPerson = members.find((m) => m.id === event.pickupPersonId);

  function updateHomework(id: string, done: boolean) {
    onChange({
      ...event,
      homework: event.homework.map((h) => (h.id === id ? { ...h, done } : h)),
    });
  }

  function addComment() {
    const text = commentText.trim();
    if (!text) return;
    const me = members.find((m) => m.id === currentMemberId);
    onChange({
      ...event,
      comments: [
        ...event.comments,
        {
          id: `c-${Date.now()}`,
          authorId: currentMemberId,
          authorName: me?.name ?? "나",
          text,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    setCommentText("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {event.title}
            </h2>
            <p className="text-sm text-muted">
              {event.date}
              {event.startTime ? ` · ${event.startTime}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-black/5"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 픽업 담당자 */}
        <section className="mb-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            🚗 픽업 담당자
          </h3>
          <div className="mb-2 flex flex-wrap gap-2">
            {members.map((m) => {
              const isSelected = event.pickupPersonId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onChange({ ...event, pickupPersonId: m.id })}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    MEMBER_COLOR_CLASSES[m.color].chip
                  } ${
                    isSelected
                      ? `ring-2 ${MEMBER_COLOR_CLASSES[m.color].ring}`
                      : "opacity-50"
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
          {pickupPerson && (
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={event.pickupChecked}
                onChange={(e) =>
                  onChange({ ...event, pickupChecked: e.target.checked })
                }
                className="h-4 w-4 accent-mint-dark"
              />
              {pickupPerson.name}가 픽업 완료했어요
            </label>
          )}
        </section>

        {/* 식사 메모 */}
        <section className="mb-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            🍚 식사 메모
          </h3>
          <input
            type="text"
            value={event.mealMemo}
            onChange={(e) => onChange({ ...event, mealMemo: e.target.value })}
            placeholder="예: 저녁은 김치찌개"
            className="mb-2 w-full rounded-xl border border-black/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-mint-dark"
          />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={event.mealChecked}
              onChange={(e) =>
                onChange({ ...event, mealChecked: e.target.checked })
              }
              className="h-4 w-4 accent-peach-dark"
            />
            식사 완료
          </label>
        </section>

        {/* 숙제 체크리스트 */}
        <section className="mb-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            📚 숙제 체크리스트
          </h3>
          {event.homework.length === 0 && (
            <p className="text-sm text-muted">등록된 숙제가 없어요.</p>
          )}
          <ul className="space-y-1">
            {event.homework.map((h) => (
              <li key={h.id}>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={h.done}
                    onChange={(e) => updateHomework(h.id, e.target.checked)}
                    className="h-4 w-4 accent-lavender-dark"
                  />
                  <span className={h.done ? "line-through text-muted" : ""}>
                    {h.text}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* 댓글 */}
        <section>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            💬 소통 댓글
          </h3>
          <ul className="mb-3 space-y-2">
            {event.comments.map((c) => (
              <li
                key={c.id}
                className="rounded-xl bg-background px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">
                  {c.authorName}
                </span>
                <span className="ml-2 text-foreground">{c.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              placeholder="댓글을 남겨보세요"
              className="flex-1 rounded-xl border border-black/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-mint-dark"
            />
            <button
              onClick={addComment}
              className="rounded-xl bg-mint px-4 py-2 text-sm font-medium text-[#2f5747] hover:bg-mint-dark"
            >
              등록
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
