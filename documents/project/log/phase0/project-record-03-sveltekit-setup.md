# SvelteKitセットアップ記録

## 文書情報

**文書番号** RECORD-003
**作成日** 2025年03月22日
**作成者** HugMeDoチーム
**ステータス** 完了
**関連文書** GUIDE-002（開発環境セットアップガイド）、PROJECT_RULES.md、GUIDE-004（ドキュメント作成ガイドライン）
**最終更新日** 2025年03月23日

## 1. 概要

本記録は、HugMeDoプロジェクトにおけるSvelteKitの初期セットアップ作業の詳細を記録したものです。WebアプリケーションとモバイルアプリケーションのSvelteKit環境を構築し、プロジェクトルールに従ったポート設定を行いました。また、モバイルアプリケーション用のCapacitor環境も初期化しました。

## 2. 実施内容

### 2.1 Webアプリケーションのセットアップ

```bash
# SvelteKitプロジェクトの作成
pnpm dlx sv create apps/web

# 選択したオプション
- SvelteKit minimal (barebones scaffolding)
- TypeScript
- ESLint
- Prettier
- Vitest
- Playwright
- TailwindCSS (typography, forms)
- SvelteKit adapter (node)
```

ポート設定の調整（vite.config.ts）:
```typescript
server: {
  port: 40000,
  strictPort: true
}
```

### 2.2 モバイルアプリケーションのセットアップ

```bash
# SvelteKitプロジェクトの作成
pnpm dlx sv create apps/mobile

# 選択したオプション
- SvelteKit minimal (barebones scaffolding)
- TypeScript
- ESLint
- Prettier
- TailwindCSS (forms)
- SvelteKit adapter (static)
```

ポート設定の調整（vite.config.ts）:
```typescript
server: {
  port: 40010,
  strictPort: true
}
```

### 2.3 Capacitorの初期化

```bash
# Capacitor関連パッケージのインストール
cd apps/mobile
pnpm add -D @capacitor/cli
pnpm add @capacitor/core @capacitor/ios @capacitor/android

# Capacitorプロジェクトの初期化
pnpm exec cap init HugMeDo jp.co.hugmedo.app --web-dir=build
```

## 3. 結果

- Webアプリケーション（`apps/web`）とモバイルアプリケーション（`apps/mobile`）のSvelteKit環境が構築されました
- プロジェクトルールに従い、Webアプリケーションはポート40000、モバイルアプリケーションはポート40010で実行されるように設定されました
- モバイルアプリケーション用のCapacitor環境が初期化されました

## 4. 次のステップ

以下の順序で開発を進めることを推奨します：

1. **バックエンドモジュールの基本構造設定**
   - APIゲートウェイ（ポート40040）
   - OHRモジュール（ポート40100）
   - Chatモジュール（ポート40110）

2. **共有パッケージの設定**
   - コアライブラリ
   - UIコンポーネント
   - ユーティリティ関数

3. **Webアプリの基本機能実装**
   - APIとの連携
   - 認証機能（Amazon Cognito）
   - 基本UI

4. **モバイルアプリのプラットフォーム追加**
   - iOSとAndroidのプラットフォーム追加
   - 必要なプラグインのインストール
   - Webアプリと同様の機能実装

## 5. 注意点

- 認証システムはAmazon Cognitoを使用します（auth-system-selection.mdの決定に基づく）
- 各モジュールのポート番号は厳密に守る必要があります
- パッケージ管理にはpnpmを使用し、グローバル依存関係は`-w`フラグで追加します

## 6. 技術的検討事項

### 6.1 SvelteKitとCapacitorの選択理由

SvelteKitとCapacitorの組み合わせは、以下の理由から選択されました：

1. **開発効率**：
   - Svelteの反応性システムにより、コード量を削減
   - 単一のコードベースでWebとモバイルの両方をカバー
   - 高速な開発サイクルと優れた開発者体験

2. **パフォーマンス**：
   - Svelteのコンパイル時最適化による高速な実行
   - バンドルサイズの最小化
   - モバイルデバイスでの効率的な動作

3. **拡張性**：
   - モジュラー構造による機能の段階的追加
   - TypeScriptによる型安全性
   - プラグインエコシステムによる機能拡張

### 6.2 アダプター選択の根拠

- **Webアプリケーション**: `adapter-node`
  - サーバーサイドレンダリングによるSEO最適化
  - APIとの直接連携が可能
  - AWS ECSでのデプロイを想定

- **モバイルアプリケーション**: `adapter-static`
  - Capacitorとの最適な互換性
  - オフライン機能のサポート
  - ネイティブ機能へのアクセス

## 7. Vite設定の修正

### 7.1 発生した問題

Webアプリケーションおよびモバイルアプリケーションの開発サーバー起動時に、以下のエラーが発生しました：

```
Expected token }
```

このエラーは、Vite設定ファイル（vite.config.ts）の構文に問題があることを示していました。

### 7.2 問題の原因

調査の結果、以下の問題が特定されました：

1. **Webアプリケーション（apps/web）**:
   - `test.workspace`設定内に自己参照（`extends: './vite.config.ts'`）が含まれており、循環参照が発生していた
   - この循環参照により、Viteが設定ファイルを正しく解析できなかった

2. **モバイルアプリケーション（apps/mobile）**:
   - `@tailwindcss/vite`のインポート方法が正しくなかった
   - 名前付きインポートではなく、デフォルトインポートを使用する必要があった
   - オブジェクトの最後のプロパティにカンマがないことによる構文エラーの可能性

### 7.3 修正内容

#### Webアプリケーション（apps/web/vite.config.ts）

```typescript
// 修正前
test: {
  workspace: [
    {
      extends: './vite.config.ts', // 循環参照の原因
      plugins: [svelteTesting()],
      // ...
    },
    {
      extends: './vite.config.ts', // 循環参照の原因
      // ...
    }
  ]
}

// 修正後
test: {
  workspace: [
    {
      plugins: [svelteTesting()],
      // ...
    },
    {
      // ...
    }
  ]
}
```

#### モバイルアプリケーション（apps/mobile/vite.config.ts）

```typescript
// 修正前
import { tailwindcss } from '@tailwindcss/vite';

// 修正後
import tailwindcss from '@tailwindcss/vite';
```

また、モバイルアプリケーションのvite.config.tsでは、オブジェクトの最後のプロパティにカンマがないことによる構文エラーの可能性も考慮しました：

```typescript
// 問題のあるコード
server: {
  port: 40010,
  strictPort: true
} // ここにカンマがないとエラーになる可能性がある
```

この問題は、JavaScriptやTypeScriptのオブジェクト構文に関するもので、将来的に他のプロパティを追加する可能性を考慮すると、カンマを追加しておくことが推奨されます。ただし、最終的なプロパティの場合はカンマがなくても構文エラーにはなりません。

### 7.4 修正結果

上記の修正により、両アプリケーションの開発サーバーが正常に起動するようになりました：

- Webアプリケーション: http://localhost:40000/
- モバイルアプリケーション: http://localhost:40010/

### 7.5 学んだ教訓

- Vite/Vitest設定ファイルでは循環参照を避ける
- パッケージのインポート方法は公式ドキュメントに従う
- エラーメッセージが不明確な場合は、構文の基本的な問題から調査を始める
- JavaScriptオブジェクトでは、将来の拡張性を考慮して最後のプロパティの後にもカンマを入れることを検討する

## 8. 参考リソース

- [SvelteKit公式ドキュメント](https://kit.svelte.dev/docs)
- [Capacitor公式ドキュメント](https://capacitorjs.com/docs)
- [TailwindCSS公式ドキュメント](https://tailwindcss.com/docs)
- [Amazon Cognito開発者ガイド](https://docs.aws.amazon.com/cognito/latest/developerguide/)
- [Vitest設定ドキュメント](https://vitest.dev/config/)

## 9. ドキュメント作成ガイドラインの整備

SvelteKitセットアップ作業と並行して、プロジェクト全体のドキュメント作成ガイドラインを整備しました。

### 9.1 実施内容

1. **ドキュメント作成ガイドラインの作成**
   - 文書: `/documents/guides/documentation-guidelines.md`
   - 内容: 文書の種類、命名規則、フォーマット、構造、更新履歴管理など
   - 遵守のための仕組み: プルリクエストレビュー、自動チェック、定期的なレビュー

2. **文書テンプレートの作成**
   - プロジェクト記録: `/documents/templates/project-record-template.md`
   - 決定記録: `/documents/templates/decision-record-template.md`
   - テンプレート説明: `/documents/templates/README.md`

### 9.2 結果

これらの整備により、以下の効果が期待されます：

- プロジェクト全体で一貫性のある高品質な文書の維持
- 新しい開発者の参加時の学習コスト削減
- 文書作成プロセスの標準化と効率化
- プロジェクト知識の適切な保存と活用

### 9.3 今後の取り組み

- 四半期ごとの全ドキュメントの包括的なレビュー実施
- GitHubアクションを使用した文書フォーマットの自動チェック導入
- 必要に応じて新しいテンプレートの追加
