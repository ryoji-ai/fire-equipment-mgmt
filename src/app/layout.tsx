import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { MobileNav } from "@/components/ui/MobileNav";

export const metadata: Metadata = {
  title: "消防署救急資器材管理システム",
  description: "救急資器材の在庫管理と補充/使用履歴を記録するシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <Link href="/">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                    <span className="hidden sm:inline">消防署救急資器材管理</span>
                    <span className="sm:hidden">資器材管理</span>
                  </h1>
                </Link>
                {/* デスクトップナビ */}
                <nav className="hidden md:flex gap-6">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    ダッシュボード
                  </Link>
                  <Link
                    href="/materials"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    資器材一覧
                  </Link>
                  <Link
                    href="/inventory/add"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    補充・使用登録
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="container mx-auto px-4 py-4 md:py-8">
            {children}
          </main>

          {/* モバイル用フッターナビ */}
          <MobileNav />

          {/* デスクトップ用フッター */}
          <footer className="hidden md:block bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
              &copy; 2026 消防署救急資器材管理システム
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
