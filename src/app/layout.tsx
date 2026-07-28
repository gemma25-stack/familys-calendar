import type { Metadata } from "next";
import { Gaegu, Geist, Geist_Mono, Gowun_Dodum, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gowunDodum = Gowun_Dodum({
  variable: "--font-gowun",
  weight: "400",
  subsets: ["latin"],
});

const gaegu = Gaegu({
  variable: "--font-gaegu",
  weight: "400",
  subsets: ["latin"],
});

const nanumGothic = Nanum_Gothic({
  variable: "--font-nanum",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "우리 가족 캘린더",
  description: "가족 공유 캘린더 & 픽업 케어 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${gowunDodum.variable} ${gaegu.variable} ${nanumGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
