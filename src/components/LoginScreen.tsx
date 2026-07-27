"use client";

import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-black/5">
        <div className="mb-4 text-4xl">🗓️</div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          우리 가족 캘린더
        </h1>
        <p className="mb-8 text-sm text-muted">
          우리 가족의 일정을 함께 공유해요
        </p>
        <button
          onClick={() => signInWithGoogle()}
          className="w-full rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-[#2f5747] transition hover:bg-mint-dark"
        >
          Google로 로그인
        </button>
      </div>
    </div>
  );
}
