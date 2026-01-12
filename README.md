# 消防署救急資器材管理システム

Next.js 15 + TypeScript + Supabaseで構築された、消防署向けの救急資器材在庫管理システムです。

## 主な機能

- **ダッシュボード**: 在庫サマリと最近の補充/使用履歴を表示
- **資器材一覧**: カテゴリ別フィルタリングと在庫不足アラート表示
- **補充・使用登録**: 資器材の補充と使用を記録し、自動的に在庫数を更新

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **認証**: なし（初期バージョン）

## セットアップ手順

### 1. 環境変数の設定

`.env.example`を`.env.local`にコピーして、Supabaseの認証情報を設定します。

```bash
cp .env.example .env.local
```

`.env.local`を編集:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセスしてプロジェクトを作成
2. プロジェクトのURL APIキーを`.env.local`に設定

### 3. データベースのセットアップ

Supabaseダッシュボードの「SQL Editor」で以下のSQLスクリプトを実行:

1. `supabase/migrations/001_initial_schema.sql` - テーブル作成、インデックス、RLSポリシー
2. `supabase/seed.sql` - サンプルデータ投入

### 4. 依存パッケージのインストール

```bash
npm install
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスします。

## データベース構造

### materialsテーブル（品目マスタ）

- `id`: UUID（主キー）
- `name`: 資器材名
- `category`: カテゴリ（薬品、器材、消耗品、医療機器、その他）
- `unit`: 単位（個、箱、本、セット、パック、L）
- `min_quantity`: 最小在庫数
- `current_quantity`: 現在の在庫数
- `description`: 説明・備考
- `created_at`, `updated_at`: タイムスタンプ

### inventory_logsテーブル（補充/使用履歴）

- `id`: UUID（主キー）
- `material_id`: UUID（外部キー → materials）
- `type`: 'in'（補充）または 'out'（使用）
- `quantity`: 数量
- `note`: メモ
- `logged_by`: 記録者名
- `logged_at`: タイムスタンプ

### low_stock_materialsビュー（在庫不足品目）

現在の在庫数が最小在庫数を下回っている資器材を自動抽出するビューです。

## ディレクトリ構成

```
fire-equipment-mgmt/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # ルートレイアウト
│   │   ├── page.tsx              # ダッシュボード
│   │   ├── materials/            # 資器材一覧
│   │   └── inventory/add/        # 補充登録フォーム
│   ├── components/               # Reactコンポーネント
│   │   ├── ui/                   # 基本UIコンポーネント
│   │   ├── dashboard/            # ダッシュボード専用
│   │   ├── materials/            # 資器材一覧専用
│   │   └── inventory/            # 補充登録専用
│   ├── lib/                      # ユーティリティ
│   │   ├── supabase/             # Supabaseクライアント
│   │   └── utils.ts              # 汎用関数
│   └── types/                    # TypeScript型定義
├── supabase/                     # Supabase設定
│   ├── migrations/               # マイグレーションSQL
│   └── seed.sql                  # サンプルデータ
└── public/                       # 静的ファイル
```

## 使用方法

### ダッシュボード（/）

- 総資器材数、在庫不足の品目数、今日の補充/使用件数を表示
- 最近の履歴10件を一覧表示

### 資器材一覧（/materials）

- カテゴリボタンでフィルタリング
- 在庫不足の品目は赤色でハイライト表示

### 補充・使用登録（/inventory/add）

1. 資器材を選択
2. 操作タイプ（補充 or 使用）を選択
3. 数量、メモ、記録者名を入力
4. 登録ボタンをクリック
5. 自動的に在庫数が更新され、ダッシュボードに遷移

## 将来の拡張機能

- 認証機能（Supabase Auth）
- リアルタイム更新（Supabase Realtime）
- 使用期限管理
- 点検記録機能
- バーコードスキャン
- PDFレポート生成

## ライセンス

MIT License

## サポート

問題が発生した場合は、プロジェクトのIssueページで報告してください。
