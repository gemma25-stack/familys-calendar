"use client";

import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import EventModal from "@/components/EventModal";
import FamilySetup from "@/components/FamilySetup";
import LoginScreen from "@/components/LoginScreen";
import { useAuth } from "@/context/AuthContext";
import { useFamily, type FontChoice } from "@/context/FamilyContext";
import { useFamilyEvents } from "@/hooks/useFamilyEvents";
import { toDateKey } from "@/lib/date";
import { MEMBER_COLOR_CLASSES, MEMBER_COLOR_ORDER } from "@/lib/types";
import type { CalendarEvent } from "@/lib/types";

const FONT_OPTIONS: { key: FontChoice; label: string; className: string }[] = [
  { key: "default", label: "기본", className: "font-choice-default" },
  { key: "gowun", label: "둥근고딕", className: "font-choice-gowun" },
  { key: "gaegu", label: "손글씨", className: "font-choice-gaegu" },
  { key: "nanum", label: "나눔고딕", className: "font-choice-nanum" },
];

function emptyEvent(id: string, date: string): CalendarEvent {
  return {
    id,
    date,
    title: "",
    pickupPersonId: null,
    pickupChecked: false,
    pickupMemo: "",
    mealMemo: "",
    mealChecked: false,
    homework: [],
    comments: [],
  };
}

const DEFAULT_DESCRIPTION = "함께 보는 일정, 함께 챙기는 픽업과 숙제";

export default function Home() {
  const { user, profile, loading: authLoading, signOutUser } = useAuth();
  const {
    family,
    members,
    loading: familyLoading,
    updateDescription,
    updateNotice,
    updateFontChoice,
    updateMemberColor,
  } = useFamily();
  const { events, saveEvent, removeEvent, newDraftId } = useFamilyEvents(
    family?.id ?? null
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <p className="text-muted">불러오는 중...</p>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  if (familyLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <p className="text-muted">불러오는 중...</p>
      </div>
    );
  }

  if (!profile?.familyId || !family) return <FamilySetup />;

  const selectedEvent = events.find((e) => e.id === selectedId) ?? null;

  function handleAddEvent(dateKey: string) {
    const id = newDraftId();
    saveEvent(emptyEvent(id, dateKey));
    setSelectedId(id);
  }

  async function handleDelete() {
    if (!selectedId) return;
    await removeEvent(selectedId);
    setSelectedId(null);
  }

  async function handleRepeat(base: CalendarEvent, weeks: number) {
    const recurrenceId = base.recurrenceId ?? base.id;
    await saveEvent({ ...base, recurrenceId });
    const baseDate = new Date(`${base.date}T00:00:00`);
    for (let i = 1; i < weeks; i++) {
      const id = newDraftId();
      const d = new Date(baseDate);
      d.setDate(d.getDate() + 7 * i);
      await saveEvent({
        ...base,
        id,
        date: toDateKey(d),
        recurrenceId,
        pickupChecked: false,
        mealChecked: false,
        homework: base.homework.map((h) => ({ ...h, done: false })),
        comments: [],
      });
    }
  }

  function copyInviteCode() {
    if (!family) return;
    navigator.clipboard.writeText(family.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const myColor = members.find((m) => m.id === user.uid)?.color;
  const fontClassName =
    FONT_OPTIONS.find((f) => f.key === (family.fontChoice ?? "default"))
      ?.className ?? "font-choice-default";

  return (
    <div
      className={`flex flex-1 flex-col items-center bg-background px-4 py-8 sm:py-12 ${fontClassName}`}
    >
      <div className="w-full max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {family.name} 🗓️
            </h1>
            {editingDescription ? (
              <input
                type="text"
                autoFocus
                value={descriptionDraft}
                onChange={(e) => setDescriptionDraft(e.target.value)}
                onBlur={() => {
                  setEditingDescription(false);
                  updateDescription(descriptionDraft);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className="mt-1 w-full max-w-xs rounded-md bg-background px-1 py-0.5 text-sm text-foreground outline-none"
              />
            ) : (
              <button
                onClick={() => {
                  setDescriptionDraft(family.description ?? DEFAULT_DESCRIPTION);
                  setEditingDescription(true);
                }}
                className="group mt-1 flex items-center gap-1 text-left text-sm text-muted"
              >
                {family.description ?? DEFAULT_DESCRIPTION}
                <span className="opacity-0 transition group-hover:opacity-100">
                  ✏️
                </span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-muted hover:bg-black/5"
              aria-label="설정"
            >
              ⚙️
            </button>
            <button
              onClick={() => setShowInvite((v) => !v)}
              className="rounded-full bg-lavender px-3 py-1.5 text-xs font-medium text-[#4b3576] hover:bg-lavender-dark"
            >
              가족 초대
            </button>
            <button
              onClick={() => signOutUser()}
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-muted hover:bg-black/5"
            >
              로그아웃
            </button>
          </div>
        </header>

        {showSettings && (
          <div className="mb-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              글꼴
            </h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => updateFontChoice(opt.key)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${opt.className} ${
                    (family.fontChoice ?? "default") === opt.key
                      ? "border-mint-dark bg-mint/30 text-foreground"
                      : "border-black/10 text-muted hover:bg-black/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              내 색상
            </h3>
            <div className="flex flex-wrap gap-2">
              {MEMBER_COLOR_ORDER.map((color) => (
                <button
                  key={color}
                  onClick={() => updateMemberColor(color)}
                  aria-label={color}
                  className={`h-8 w-8 rounded-full ${MEMBER_COLOR_CLASSES[color].swatch} ${
                    myColor === color
                      ? `ring-2 ring-offset-2 ${MEMBER_COLOR_CLASSES[color].ring}`
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {showInvite && (
          <div className="mb-4 rounded-2xl bg-card p-4 text-center shadow-sm ring-1 ring-black/5">
            <p className="mb-2 text-sm text-muted">
              아래 초대 코드를 가족에게 공유해주세요
            </p>
            <div className="mb-2 text-2xl font-bold tracking-widest text-foreground">
              {family.inviteCode}
            </div>
            <button
              onClick={copyInviteCode}
              className="rounded-full bg-mint px-4 py-1.5 text-xs font-medium text-[#2f5747] hover:bg-mint-dark"
            >
              {copied ? "복사됨!" : "코드 복사"}
            </button>
          </div>
        )}

        <CalendarView
          events={events}
          members={members}
          onSelectEvent={(evt) => setSelectedId(evt.id)}
          onAddEvent={handleAddEvent}
          notice={family.notice ?? ""}
          onNoticeChange={updateNotice}
        />
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          members={members}
          currentMemberId={user.uid}
          onClose={() => setSelectedId(null)}
          onChange={(updated) => saveEvent(updated)}
          onDelete={handleDelete}
          onRepeat={(weeks) => handleRepeat(selectedEvent, weeks)}
        />
      )}
    </div>
  );
}
