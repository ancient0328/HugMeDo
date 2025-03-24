# HugMeDo_DCM 開発サポートツール

このディレクトリには、HugMeDo_DCMプロジェクトの開発をサポートするためのツールやガイドラインが含まれています。これらのツールを活用することで、プロジェクト固有のルールに確実に準拠したコードを作成できます。

## ファイル一覧

1. **svelte5-guidelines.md**
   - Svelte 5のイベント構文に関するガイドライン
   - 古い構文（`on:event`）から新しい構文（`onevent`）への変換例

2. **coding-checklist.md**
   - プロジェクト全体のコーディング規約チェックリスト
   - ファイル命名、コード命名、パッケージ管理などの基本ルール

3. **svelte-edit-template.md**
   - Svelteコンポーネント編集前に使用するテンプレート
   - 修正計画と確認事項のテンプレート

4. **check-svelte-syntax.js**
   - Svelte 5の古いイベント構文を自動的に検出するスクリプト
   - 修正が必要な箇所のリストと修正方法を提示

## 使用方法

### Svelte 5イベント構文チェック

プロジェクト内のSvelteファイルをスキャンし、古いイベント構文を検出します：

```bash
cd /Users/ancient0328/Development/GitHub/HugMeDo_DCM
node .hugmedo/check-svelte-syntax.js
```

### コーディング前の準備

1. 新しいコンポーネントを作成する前に、`coding-checklist.md`を確認
2. 既存のコンポーネントを編集する前に、`svelte-edit-template.md`をコピーして使用
3. Svelte 5の構文に関する疑問がある場合は、`svelte5-guidelines.md`を参照

### 自動修正（注意：バックアップ後に実行）

以下のコマンドで、プロジェクト内のSvelteファイルの古いイベント構文を一括置換できます：

```bash
# モバイルアプリのSvelteファイルを修正
find apps/mobile/src -name "*.svelte" -exec sed -i '' 's/on:\(submit\|click\|input\|change\|keydown\|keyup\|keypress\|focus\|blur\)/on\1/g' {} \;

# Webアプリのファイルを修正
find apps/web/src -name "*.svelte" -exec sed -i '' 's/on:\(submit\|click\|input\|change\|keydown\|keyup\|keypress\|focus\|blur\)/on\1/g' {} \;

# UIパッケージのファイルを修正
find packages/ui/src -name "*.svelte" -exec sed -i '' 's/on:\(submit\|click\|input\|change\|keydown\|keyup\|keypress\|focus\|blur\)/on\1/g' {} \;
```

## 注意事項

- スクリプトを実行する前に、必ずコードのバックアップを取ってください
- 自動置換は慎重に行い、置換後は必ず動作確認を行ってください
- これらのツールはプロジェクトルールの遵守をサポートするものであり、コードレビューの代替にはなりません
