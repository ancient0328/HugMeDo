# ログイン画面の共通コンポーネント化計画

**文書番号**: RECORD-10  
**作成日**: 2025-03-25  
**作成者**: 開発チーム  
**ステータス**: 計画  
**関連文書**: 
- RECORD-09 (ログイン画面の改善)
- ARCH-001 (システムアーキテクチャ概要)

## 1. 概要

WebアプリとMobileアプリで現在別々に実装されているログイン画面を、共通コンポーネントとして`packages/ui`パッケージに統合する計画です。これにより、コードの重複を排除し、保守性の向上と一貫したユーザー体験の提供を実現します。

## 2. 現状分析

### 2.1 現在の実装

現在、ログイン画面は以下の2つのファイルで別々に実装されています：

- `/apps/web/src/routes/login/+page.svelte`
- `/apps/mobile/src/routes/login/+page.svelte`

両方の実装は類似していますが、微妙な違いがあり、保守の際に両方を更新する必要があります。

### 2.2 既存の共通コンポーネント

`packages/ui`パッケージには既に以下のコンポーネントが存在しています：

- `/packages/ui/components/auth/LoginForm.svelte` - ログインフォームのコンポーネント
- `/packages/ui/pages/auth/Login.svelte` - 基本的なログインページのラッパー

しかし、現在の`Login.svelte`は最小限の実装であり、ロゴの配置やスタイリングなどの詳細な要素が含まれていません。

## 3. 共通コンポーネント化の計画

### 3.1 目標

- コード重複の排除
- 保守性の向上
- 一貫したユーザー体験の提供
- プロジェクトアーキテクチャ原則との整合性確保

### 3.2 実装方針

1. **既存の`Login.svelte`コンポーネントの拡張**
   - ロゴの配置とスタイリングを追加
   - レスポンシブデザインの対応
   - プラットフォーム固有のカスタマイズオプションの提供

2. **WebアプリとMobileアプリからの参照方法**
   ```svelte
   <script>
     import { Login } from '@hugmedo/ui/pages/auth';
     // アプリ固有のロジック（認証状態チェックなど）
   </script>

   <Login />
   ```

3. **プラットフォーム固有の調整**
   - プロパティを通じてカスタマイズ可能にする
   - 例：`<Login platform="mobile" />`

### 3.3 具体的な実装内容

```svelte
<!-- packages/ui/pages/auth/Login.svelte -->
<script>
  import LoginForm from '../../components/auth/LoginForm.svelte';
  
  // プロパティの定義
  let { platform = 'web' } = $props();
  
  // プラットフォーム固有のスタイル調整
  $: isMobile = platform === 'mobile';
</script>

<div class="login-container" class:mobile={isMobile}>
  <div class="logo-container">
    <div class="logo-icon">
      <img src="/images/hugmedo-frog-logo.svg" alt="HugMeDo Frog Logo" />
    </div>
    <div class="logo-text">
      <img src="/images/hugmedo-text-logo.svg" alt="HugMeDo Text Logo" />
    </div>
  </div>
  
  <div class="form-container">
    <LoginForm />
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #FAFAFA;
    padding: 1rem;
    width: 100%;
  }
  
  .logo-container {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin-bottom: 0.25rem;
  }
  
  .logo-icon img {
    width: 100px;
    height: 100px;
  }
  
  .logo-text img {
    max-width: 200px;
  }
  
  /* モバイル向け調整 */
  @media (max-width: 480px) {
    .logo-container {
      flex-direction: column;
      align-items: center;
    }
  }
  
  /* プラットフォーム固有のスタイル */
  .mobile {
    /* モバイルアプリ固有のスタイル */
  }
</style>
```

## 4. Capacitorとの互換性

Capacitorでネイティブアプリ化する場合、静的アセットの参照方法などプラットフォーム固有の調整が必要になります。これらの調整は以下の方法で対応します：

1. **静的アセットの参照**
   - 環境変数やコンテキストを通じてパスを動的に設定
   - プラットフォーム検出ロジックの実装

2. **プラットフォーム固有の振る舞い**
   - プロパティを通じて制御
   - 条件付きレンダリングの活用

## 5. 実装スケジュール

1. **フェーズ1**: 共通コンポーネントの実装と基本機能の確認
   - 既存の`Login.svelte`の拡張
   - スタイリングとレスポンシブデザインの実装

2. **フェーズ2**: WebアプリとMobileアプリの統合
   - 個別実装から共通コンポーネントへの移行
   - 動作確認とバグ修正

3. **フェーズ3**: プラットフォーム固有の最適化
   - Capacitor対応の調整
   - パフォーマンス最適化

## 6. 期待される効果

- **開発効率の向上**: 1箇所の変更で両方のアプリに反映
- **一貫性の確保**: UIとUXの統一
- **保守性の向上**: バグ修正やアップデートの効率化
- **アーキテクチャの整合性**: プロジェクト設計原則との整合性確保

## 7. リスクと対策

| リスク | 対策 |
|-------|------|
| プラットフォーム固有の要件対応 | プロパティによるカスタマイズ機能の提供 |
| 静的アセットの参照問題 | 環境に応じた動的パス設定の実装 |
| パフォーマンスへの影響 | コンポーネントの最適化とレンダリング効率の確保 |

## 8. 結論

ログイン画面を共通コンポーネントとして実装することで、コードの重複を排除し、保守性の向上と一貫したユーザー体験の提供を実現します。この方針はプロジェクトのアーキテクチャ原則にも合致しており、長期的な開発効率の向上にも寄与します。

---

**承認者**: [承認者名]  
**承認日**: [承認日]
