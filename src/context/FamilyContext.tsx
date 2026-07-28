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
import type { FamilyMember, MemberColor } from "@/lib/types";
import { useAuth } from "./AuthContext";

export type FontChoice = "default" | "gowun" | "gaegu" | "nanum";

type FamilyDoc = {
  id: string;
  name: string;
  description?: string;
  notice?: string;
  fontChoice?: FontChoice;
  inviteCode: string;
  memberIds: string[];
  members: Record<string, { name: string; color: MemberColor }>;
};

type FamilyContextValue = {
  family: FamilyDoc | null;
  members: FamilyMember[];
  loading: boolean;
  createFamily: (name: string) => Promise<void>;
  joinFamily: (inviteCode: string) => Promise<"ok" | "not_found">;
  updateDescription: (description: string) => Promise<void>;
  updateNotice: (notice: string) => Promise<void>;
  updateFontChoice: (fontChoice: FontChoice) => Promise<void>;
  updateMemberColor: (color: MemberColor) => Promise<void>;
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

  async function updateDescription(description: string) {
    if (!family) return;
    await updateDoc(doc(db, "families", family.id), { description });
  }

  async function updateNotice(notice: string) {
    if (!family) return;
    await updateDoc(doc(db, "families", family.id), { notice });
  }

  async function updateFontChoice(fontChoice: FontChoice) {
    if (!family) return;
    await updateDoc(doc(db, "families", family.id), { fontChoice });
  }

  async function updateMemberColor(color: MemberColor) {
    if (!family || !user) return;
    await updateDoc(doc(db, "families", family.id), {
      [`members.${user.uid}.color`]: color,
    });
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
      value={{
        family,
        members,
        loading,
        createFamily,
        joinFamily,
        updateDescription,
        updateNotice,
        updateFontChoice,
        updateMemberColor,
      }}
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
