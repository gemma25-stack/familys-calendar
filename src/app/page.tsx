"use client";

import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import EventModal from "@/components/EventModal";
import { MOCK_EVENTS, MOCK_MEMBERS } from "@/lib/mockData";
import type { CalendarEvent } from "@/lib/types";

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedId) ?? null;

  function handleChange(updated: CalendarEvent) {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-background px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            우리 가족 캘린더 🗓️
          </h1>
          <p className="mt-2 text-muted">
            함께 보는 일정, 함께 챙기는 픽업과 숙제
          </p>
        </header>

        <CalendarView
          events={events}
          members={MOCK_MEMBERS}
          onSelectEvent={(evt) => setSelectedId(evt.id)}
        />
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          members={MOCK_MEMBERS}
          currentMemberId="me"
          onClose={() => setSelectedId(null)}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
