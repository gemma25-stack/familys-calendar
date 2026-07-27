export default function Home() {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const tags = [
    { label: "엄마 픽업", color: "bg-mint text-[#2f5747]" },
    { label: "아빠 픽업", color: "bg-peach text-[#7a4a1a]" },
    { label: "할머니 픽업", color: "bg-lavender text-[#4b3576]" },
  ];

  return (
    <div className="flex flex-1 flex-col items-center bg-background px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            우리 가족 캘린더 🗓️
          </h1>
          <p className="mt-2 text-muted">
            함께 보는 일정, 함께 챙기는 픽업과 숙제
          </p>
        </header>

        <section className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">
              2026년 7월
            </span>
            <div className="flex gap-2 text-sm">
              <span className="rounded-full bg-mint px-3 py-1 font-medium text-[#2f5747]">
                월간
              </span>
              <span className="rounded-full px-3 py-1 font-medium text-muted">
                주간
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted">
            {days.map((d) => (
              <div key={d} className="py-2 font-medium">
                {d}
              </div>
            ))}
            {Array.from({ length: 28 }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={`flex h-14 items-center justify-center rounded-xl text-foreground ${
                  n === 27
                    ? "bg-peach font-bold text-[#7a4a1a] ring-2 ring-peach-dark"
                    : "bg-background hover:bg-mint/30"
                }`}
              >
                {n}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-card p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-3 text-base font-semibold text-foreground">
            픽업 담당자 태그 예시
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t.label}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${t.color}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
