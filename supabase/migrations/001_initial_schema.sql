-- ================================
-- 消防署救急資器材管理システム
-- 初期スキーマ作成
-- ================================

-- 1. 資器材マスタテーブル
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('薬品', '器材', '消耗品', '医療機器', 'その他')),
    unit TEXT NOT NULL CHECK (unit IN ('個', '箱', '本', 'セット', 'パック', 'L')),
    min_quantity INTEGER NOT NULL DEFAULT 0 CHECK (min_quantity >= 0),
    current_quantity INTEGER NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 補充/使用履歴テーブル
CREATE TABLE inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('in', 'out')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    note TEXT,
    logged_by TEXT NOT NULL,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================
-- インデックス作成（パフォーマンス最適化）
-- ================================

-- 資器材マスタ
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_materials_name ON materials(name);
CREATE INDEX idx_materials_stock_status ON materials(current_quantity, min_quantity);

-- 在庫履歴
CREATE INDEX idx_inventory_logs_material_id ON inventory_logs(material_id);
CREATE INDEX idx_inventory_logs_logged_at ON inventory_logs(logged_at DESC);
CREATE INDEX idx_inventory_logs_type ON inventory_logs(type);

-- ================================
-- トリガー（自動更新）
-- ================================

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- ビュー（在庫不足品目）
-- ================================

CREATE VIEW low_stock_materials AS
SELECT
    id,
    name,
    category,
    current_quantity,
    min_quantity,
    (min_quantity - current_quantity) as shortage_quantity
FROM materials
WHERE current_quantity < min_quantity
ORDER BY shortage_quantity DESC;

-- ================================
-- RLS有効化（認証なしアクセス用）
-- ================================

-- materialsテーブル
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "materials_select_policy" ON materials
    FOR SELECT
    USING (true);  -- 全ユーザーに読み取り許可

CREATE POLICY "materials_insert_policy" ON materials
    FOR INSERT
    WITH CHECK (true);  -- 全ユーザーに挿入許可

CREATE POLICY "materials_update_policy" ON materials
    FOR UPDATE
    USING (true);  -- 全ユーザーに更新許可

CREATE POLICY "materials_delete_policy" ON materials
    FOR DELETE
    USING (true);  -- 全ユーザーに削除許可

-- inventory_logsテーブル
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_logs_select_policy" ON inventory_logs
    FOR SELECT
    USING (true);

CREATE POLICY "inventory_logs_insert_policy" ON inventory_logs
    FOR INSERT
    WITH CHECK (true);

-- ================================
-- コメント（ドキュメント）
-- ================================

COMMENT ON TABLE materials IS '資器材マスタテーブル';
COMMENT ON COLUMN materials.name IS '資器材名';
COMMENT ON COLUMN materials.category IS 'カテゴリ（薬品、器材、消耗品など）';
COMMENT ON COLUMN materials.unit IS '単位（個、箱、本など）';
COMMENT ON COLUMN materials.min_quantity IS '最小在庫数';
COMMENT ON COLUMN materials.current_quantity IS '現在の在庫数';

COMMENT ON TABLE inventory_logs IS '補充・使用履歴テーブル';
COMMENT ON COLUMN inventory_logs.type IS '操作タイプ（in=補充、out=使用）';
COMMENT ON COLUMN inventory_logs.quantity IS '数量';
COMMENT ON COLUMN inventory_logs.logged_by IS '記録者名';
