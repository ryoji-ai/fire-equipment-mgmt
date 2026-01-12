import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
        <div className="min-h-screen bg-gray-50">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  消防署救急資器材管理
                </h1>
                <nav className="flex gap-6">
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
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {/* フッター */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
              &copy; 2026 消防署救急資器材管理システム
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
