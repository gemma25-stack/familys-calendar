"use client";

import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import EventModal from "@/components/EventModal";
import FamilySetup from "@/components/FamilySetup";
import LoginScreen from "@/components/LoginScreen";
import { useAuth } from "@/context/AuthContext";
import { useFamily } from "@/context/FamilyContext";
import { useFamilyEvents } from "@/hooks/useFamilyEvents";
import type { CalendarEvent } from "@/lib/types";

function emptyEvent(id: string, date: string): CalendarEvent {
  return {
    id,
    date,
    title: "",
    pickupPersonId: null,
    pickupChecked: false,
    mealMemo: "",
    mealChecked: false,
    homework: [],
    comments: [],
  };
}

export default function Home() {
  const { user, profile, loading: authLoading, signOutUser } = useAuth();
  const { family, members, loading: familyLoading } = useFamily();
  const { events, saveEvent, removeEvent, newDraftId } = useFamilyEvents(
    family?.id ?? null
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

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

  function copyInviteCode() {
    if (!family) return;
    navigator.clipboard.writeText(family.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-background px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {family.name} 🗓️
            </h1>
            <p className="mt-1 text-sm text-muted">
              함께 보는 일정, 함께 챙기는 픽업과 숙제
            </p>
          </div>
          <div className="flex items-center gap-2">
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
        />
      )}
    </div>
  );
}
