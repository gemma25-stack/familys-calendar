"use client";

import { useEffect, useState } from "react";
import { josa } from "@/lib/korean";
import type { CalendarEvent, FamilyMember } from "@/lib/types";
import { MEMBER_COLOR_CLASSES } from "@/lib/types";

type Props = {
  event: CalendarEvent;
  members: FamilyMember[];
  currentMemberId: string;
  onClose: () => void;
  onChange: (updated: CalendarEvent) => void;
  onDelete: () => void;
  onRepeat: (weeks: number) => void;
};

type SectionKey = "pickup" | "meal" | "homework";

const SECTION_OPTIONS: { key: SectionKey; label: string; emoji: string }[] = [
  { key: "pickup", label: "픽업", emoji: "🚗" },
  { key: "meal", label: "식사", emoji: "🍚" },
  { key: "homework", label: "숙제", emoji: "📚" },
];

function computeActiveSections(event: CalendarEvent): Set<SectionKey> {
  const s = new Set<SectionKey>();
  if (event.pickupPersonId || event.pickupMemo) s.add("pickup");
  if (event.mealMemo || event.mealChecked) s.add("meal");
  if (event.homework.length > 0) s.add("homework");
  return s;
}

export default function EventModal({
  event,
  members,
  currentMemberId,
  onClose,
  onChange,
  onDelete,
  onRepeat,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [homeworkText, setHomeworkText] = useState("");
  const [repeatApplied, setRepeatApplied] = useState(false);

  const [titleDraft, setTitleDraft] = useState(event.title);
  const [startTimeDraft, setStartTimeDraft] = useState(event.startTime ?? "");
  const [mealMemoDraft, setMealMemoDraft] = useState(event.mealMemo);
  const [pickupMemoDraft, setPickupMemoDraft] = useState(event.pickupMemo);

  const [activeSections, setActiveSections] = useState<Set<SectionKey>>(() =>
    computeActiveSections(event)
  );
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    setTitleDraft(event.title);
    setStartTimeDraft(event.startTime ?? "");
    setMealMemoDraft(event.mealMemo);
    setPickupMemoDraft(event.pickupMemo);
    setActiveSections(computeActiveSections(event));
    setShowAddMenu(false);
    setRepeatApplied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const pickupPerson = members.find((m) => m.id === event.pickupPersonId);

  function addSection(key: SectionKey) {
    setActiveSections((prev) => new Set(prev).add(key));
    setShowAddMenu(false);
  }

  function removeSection(key: SectionKey) {
    setActiveSections((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    if (key === "pickup") {
      setPickupMemoDraft("");
      onChange({
        ...event,
        pickupPersonId: null,
        pickupChecked: false,
        pickupMemo: "",
      });
    } else if (key === "meal") {
      setMealMemoDraft("");
      onChange({ ...event, mealMemo: "", mealChecked: false });
    } else if (key === "homework") {
      onChange({ ...event, homework: [] });
    }
  }

  function updateHomework(id: string, done: boolean) {
    onChange({
      ...event,
      homework: event.homework.map((h) => (h.id === id ? { ...h, done } : h)),
    });
  }

  function addHomework() {
    const text = homeworkText.trim();
    if (!text) return;
    onChange({
      ...event,
      homework: [
        ...event.homework,
        { id: `hw-${Date.now()}`, text, done: false },
      ],
    });
    setHomeworkText("");
  }

  function removeHomework(id: string) {
    onChange({
      ...event,
      homework: event.homework.filter((h) => h.id !== id),
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

  const availableToAdd = SECTION_OPTIONS.filter(
    (opt) => !activeSections.has(opt.key)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-xl ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex-1">
            <label className="px-1 text-xs font-medium text-muted">
              일정 이름
            </label>
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={() => onChange({ ...event, title: titleDraft })}
              placeholder="예: 태권도 학원 픽업"
              className="w-full rounded-lg px-1 -mx-1 text-xl font-bold text-foreground outline-none focus:bg-background"
            />
            <div className="mt-1 flex items-center gap-2 px-1 text-sm text-muted">
              <span>{event.date}</span>
              <input
                type="time"
                value={startTimeDraft}
                onChange={(e) => setStartTimeDraft(e.target.value)}
                onBlur={() => onChange({ ...event, startTime: startTimeDraft })}
                className="rounded-md bg-background px-1 py-0.5 text-sm text-foreground outline-none"
              />
            </div>
            <div className="mt-1 flex items-center gap-2 px-1">
              <label className="text-xs text-muted">🔁 반복</label>
              <select
                value={repeatApplied ? "weekly" : "none"}
                onChange={(e) => {
                  if (e.target.value === "weekly" && !repeatApplied) {
                    setRepeatApplied(true);
                    onRepeat(8);
                  }
                }}
                disabled={repeatApplied}
                className="rounded-md bg-background px-1 py-0.5 text-xs text-foreground outline-none disabled:opacity-60"
              >
                <option value="none">반복 안 함</option>
                <option value="weekly">매주 반복 (8주)</option>
              </select>
              {repeatApplied && (
                <span className="text-xs text-mint-dark">
                  8주 일정이 생성됐어요
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-black/5"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 픽업 */}
        {activeSections.has("pickup") && (
          <section className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                🚗 픽업
              </h3>
              <button
                onClick={() => removeSection("pickup")}
                className="text-xs text-muted hover:text-peach-dark"
              >
                제거
              </button>
            </div>
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
            <input
              type="text"
              value={pickupMemoDraft}
              onChange={(e) => setPickupMemoDraft(e.target.value)}
              onBlur={() =>
                onChange({ ...event, pickupMemo: pickupMemoDraft })
              }
              placeholder="예: 3시까지 학원 앞으로"
              className="mb-2 w-full rounded-xl border border-black/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-mint-dark"
            />
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
                {pickupPerson.name}
                {josa(pickupPerson.name, "이", "가")} 픽업 완료했어요
              </label>
            )}
          </section>
        )}

        {/* 식사 */}
        {activeSections.has("meal") && (
          <section className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                🍚 식사
              </h3>
              <button
                onClick={() => removeSection("meal")}
                className="text-xs text-muted hover:text-peach-dark"
              >
                제거
              </button>
            </div>
            <input
              type="text"
              value={mealMemoDraft}
              onChange={(e) => setMealMemoDraft(e.target.value)}
              onBlur={() => onChange({ ...event, mealMemo: mealMemoDraft })}
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
        )}

        {/* 숙제 */}
        {activeSections.has("homework") && (
          <section className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                📚 숙제
              </h3>
              <button
                onClick={() => removeSection("homework")}
                className="text-xs text-muted hover:text-peach-dark"
              >
                제거
              </button>
            </div>
            {event.homework.length === 0 && (
              <p className="mb-2 text-sm text-muted">등록된 숙제가 없어요.</p>
            )}
            <ul className="mb-2 space-y-1">
              {event.homework.map((h) => (
                <li key={h.id} className="flex items-center gap-2">
                  <label className="flex flex-1 items-center gap-2 text-sm text-foreground">
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
                  <button
                    onClick={() => removeHomework(h.id)}
                    className="text-xs text-muted hover:text-peach-dark"
                    aria-label="숙제 삭제"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={homeworkText}
                onChange={(e) => setHomeworkText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHomework()}
                placeholder="숙제를 추가해보세요"
                className="flex-1 rounded-xl border border-black/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-mint-dark"
              />
              <button
                onClick={addHomework}
                className="rounded-xl bg-lavender px-4 py-2 text-sm font-medium text-[#4b3576] hover:bg-lavender-dark"
              >
                추가
              </button>
            </div>
          </section>
        )}

        {/* 항목 추가 */}
        {availableToAdd.length > 0 && (
          <div className="mb-5">
            {!showAddMenu ? (
              <button
                onClick={() => setShowAddMenu(true)}
                className="w-full rounded-xl border border-dashed border-black/15 py-2 text-sm font-medium text-muted hover:border-mint-dark hover:text-mint-dark"
              >
                + 항목 추가
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableToAdd.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => addSection(opt.key)}
                    className="whitespace-nowrap rounded-xl border border-black/10 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-black/5"
                  >
                    <span aria-hidden="true">{opt.emoji}</span>
                    <span className="ml-1">{opt.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="rounded-xl px-3 py-2 text-sm text-muted hover:bg-black/5"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        )}

        {/* 댓글 */}
        <section>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            💬 댓글
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

        <div className="mt-6 border-t border-black/5 pt-4 text-center">
          <button
            onClick={() => {
              if (confirm("이 일정을 삭제할까요?")) onDelete();
            }}
            className="text-sm font-medium text-muted hover:text-peach-dark"
          >
            일정 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
