import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "けむりゼロ — 吸わなかった分だけ、貯まっていく",
  description: "禁煙で浮いたお金と体の回復をリアルタイムで見える化。吸いたくなったらSOSボタンで3分間を乗り切ろう。",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#121613" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
