# HugMeDo_DCM プロジェクトコーディングチェックリスト

## 基本規則

### ファイル命名規則
- □ コンポーネント: PascalCase（例: `CircularProgress.svelte`）
- □ 通常ファイル: kebab-case（例: `auth-manager.ts`）
- □ 設定ファイル: camelCase（例: `tsconfig.json`）
- □ Dockerファイル: Dockerfile.service（例: `Dockerfile.api`）

### コード命名規則
- □ 変数/関数: camelCase（例: `getUserData`）
- □ 定数: UPPER_SNAKE_CASE（例: `MAX_RETRY_COUNT`）
- □ クラス/型: PascalCase（例: `AuthManager`）
- □ インターフェース: PascalCase（例: `UserConfig`）
- □ コンテナ名: kebab-case（例: `hugmedo-dcm-api`）

### パッケージ管理
- □ pnpmのみ使用（npm/yarn禁止）
- □ グローバル依存関係: `-w`フラグを使用（例: `pnpm add -Dw typescript`）
- □ モジュール固有の依存関係: 各モジュールディレクトリで追加

## Svelte 5固有の規則

### イベント構文
- □ 古い構文（`on:event`）から新しい構文（`onevent`）に変換
- □ 詳細は `.hugmedo/svelte5-guidelines.md` を参照

### リアクティビティ
- □ 状態管理には `$state` を使用
- □ 派生値には `$:` を使用
- □ ストアの値は `$` プレフィックスでアクセス

## コード品質チェック

### 一般
- □ コードは読みやすく、自己説明的か
- □ 不要なコメントやコードは削除されているか
- □ エラーハンドリングは適切に実装されているか
- □ 非同期処理は async/await を使用しているか

### TypeScript
- □ 適切な型定義がされているか
- □ any型の使用を避けているか
- □ インターフェースと型エイリアスを適切に使い分けているか

### パフォーマット
- □ インデント: スペース2つ
- □ 行の長さ: 最大100文字
- □ セミコロン: 必須

## セキュリティチェック

- □ 入力値は適切に検証されているか
- □ 機密情報は環境変数で管理されているか
- □ 認証・認可は適切に実装されているか

## パフォーマンスチェック

- □ 不要な再レンダリングを避けているか
- □ メモ化を適切に使用しているか
- □ 大きなコンポーネントは適切に分割されているか
