"use client";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import type { CalendarEvent } from "@/lib/types";

export function useFamilyEvents(familyId: string | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!familyId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "families", familyId, "events"),
      orderBy("date", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setEvents(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CalendarEvent)
      );
      setLoading(false);
    });
    return unsub;
  }, [familyId]);

  function newDraftId() {
    if (!familyId) throw new Error("no family");
    return doc(collection(db, "families", familyId, "events")).id;
  }

  async function saveEvent(event: CalendarEvent) {
    if (!familyId) return;
    const ref = doc(db, "families", familyId, "events", event.id);
    const { id, ...data } = event;
    void id;
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  }

  async function removeEvent(eventId: string) {
    if (!familyId) return;
    await deleteDoc(doc(db, "families", familyId, "events", eventId));
  }

  return { events, loading, saveEvent, removeEvent, newDraftId };
}
