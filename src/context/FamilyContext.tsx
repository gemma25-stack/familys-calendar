"use client";

import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { db } from "@/lib/firebase";
import { generateInviteCode, nextMemberColor } from "@/lib/family";
import type { FamilyMember } from "@/lib/types";
import { useAuth } from "./AuthContext";

type FamilyDoc = {
  id: string;
  name: string;
  inviteCode: string;
  memberIds: string[];
  members: Record<string, { name: string; color: FamilyMember["color"] }>;
};

type FamilyContextValue = {
  family: FamilyDoc | null;
  members: FamilyMember[];
  loading: boolean;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (inviteCode: string) => Promise<"ok" | "not_found">;
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [family, setFamily] = useState<FamilyDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.familyId) {
      setFamily(null);
      setLoading(false);
      return;
    }
    const ref = doc(db, "families", profile.familyId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setFamily({ id: snap.id, ...(snap.data() as Omit<FamilyDoc, "id">) });
      } else {
        setFamily(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [profile?.familyId]);

  async function createFamily(name: string) {
    if (!user || !profile) return;
    const familyRef = doc(collection(db, "families"));
    const color = nextMemberColor(0);
    await setDoc(familyRef, {
      name,
      inviteCode: generateInviteCode(),
      ownerId: user.uid,
      memberIds: [user.uid],
      members: {
        [user.uid]: { name: profile.name, color },
      },
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "users", user.uid), { familyId: familyRef.id });
  }

  async function joinFamily(inviteCode: string): Promise<"ok" | "not_found"> {
    if (!user || !profile) return "not_found";
    const q = query(
      collection(db, "families"),
      where("inviteCode", "==", inviteCode.trim().toUpperCase())
    );
    const snap = await getDocs(q);
    if (snap.empty) return "not_found";

    const familyDoc = snap.docs[0];
    const existing = familyDoc.data() as Omit<FamilyDoc, "id">;
    const usedCount = existing.memberIds?.length ?? 0;
    const color = nextMemberColor(usedCount);

    await updateDoc(familyDoc.ref, {
      memberIds: arrayUnion(user.uid),
      [`members.${user.uid}`]: { name: profile.name, color },
    });
    await updateDoc(doc(db, "users", user.uid), { familyId: familyDoc.id });
    return "ok";
  }

  const members: FamilyMember[] = family
    ? Object.entries(family.members).map(([id, m]) => ({
        id,
        name: m.name,
        color: m.color,
      }))
    : [];

  return (
    <FamilyContext.Provider
      value={{ family, members, loading, createFamily, joinFamily }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily must be used within FamilyProvider");
  return ctx;
}
