"use client";

import { useState } from "react";
import { useFamily } from "@/context/FamilyContext";

export default function FamilySetup() {
  const { createFamily, joinFamily } = useFamily();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    if (!familyName.trim()) return;
    setBusy(true);
    await createFamily(familyName.trim());
    setBusy(false);
  }

  async function handleJoin() {
    if (!inviteCode.trim()) return;
    setBusy(true);
    setError("");
    const result = await joinFamily(inviteCode);
    setBusy(false);
    if (result === "not_found") {
      setError("초대 코드를 찾을 수 없어요. 다시 확인해주세요.");
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-sm ring-1 ring-black/5">
        {mode === "choose" && (
          <div className="text-center">
            <h1 className="mb-2 text-xl font-bold text-foreground">
              가족 캘린더 시작하기
            </h1>
            <p className="mb-6 text-sm text-muted">
              새로운 가족 캘린더를 만들거나, 이미 있는 가족에 초대 코드로
              참여하세요.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setMode("create")}
                className="rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-[#2f5747] hover:bg-mint-dark"
              >
                새로운 가족 일정 만들기
              </button>
              <button
                onClick={() => setMode("join")}
                className="rounded-xl bg-lavender px-4 py-3 text-sm font-semibold text-[#4b3576] hover:bg-lavender-dark"
              >
                가족 일정에 참여하기
              </button>
            </div>
          </div>
        )}

        {mode === "create" && (
          <div>
            <h1 className="mb-4 text-xl font-bold text-foreground">
              가족 이름을 정해주세요
            </h1>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="예: 우리 가족"
              className="mb-4 w-full rounded-xl border border-black/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-mint-dark"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setMode("choose")}
                className="flex-1 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-muted hover:bg-black/5"
              >
                뒤로
              </button>
              <button
                onClick={handleCreate}
                disabled={busy || !familyName.trim()}
                className="flex-1 rounded-xl bg-mint px-4 py-2 text-sm font-semibold text-[#2f5747] hover:bg-mint-dark disabled:opacity-50"
              >
                {busy ? "만드는 중..." : "만들기"}
              </button>
            </div>
          </div>
        )}

        {mode === "join" && (
          <div>
            <h1 className="mb-4 text-xl font-bold text-foreground">
              초대 코드를 입력해주세요
            </h1>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="예: AB12CD"
              className="mb-2 w-full rounded-xl border border-black/10 bg-background px-3 py-2 text-center text-lg font-semibold tracking-widest text-foreground outline-none focus:border-mint-dark"
            />
            {error && <p className="mb-2 text-sm text-peach-dark">{error}</p>}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setMode("choose")}
                className="flex-1 rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-muted hover:bg-black/5"
              >
                뒤로
              </button>
              <button
                onClick={handleJoin}
                disabled={busy || !inviteCode.trim()}
                className="flex-1 rounded-xl bg-lavender px-4 py-2 text-sm font-semibold text-[#4b3576] hover:bg-lavender-dark disabled:opacity-50"
              >
                {busy ? "참여하는 중..." : "참여하기"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
