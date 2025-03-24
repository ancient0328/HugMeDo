# インスタグラム風ログイン画面デザイン仕様書

## 文書情報

**文書番号**: DESIGN-002
**作成日**: 2025年03月24日
**作成者**: HugMeDoチーム
**ステータス**: ドラフト
**関連文書**: 
- DESIGN-001（ログイン画面デザイン仕様書）
- instagram-style-ui-roadmap.md（インスタグラム風UIデザインマイクロロードマップ）
**最終更新日**: 2025年03月24日

## 1. 概要

本文書は、HugMeDoアプリケーションのインスタグラム風ログイン画面のデザイン仕様を定義します。このデザインは、WebアプリケーションおよびモバイルアプリケーションのUI実装の基準となり、全体的なインスタグラム風UIデザインと一貫性を持たせます。

## 2. デザイン要素

### 2.1 ロゴ

- **メインロゴ**: カエルのキャラクターと「HugMeDo」テキストの組み合わせ
- **配置**: 画面中央上部に大きく表示
- **アニメーション**: 初回表示時に軽微なフェードインアニメーション
- **フォーマット**: SVG（ベクターグラフィック）

### 2.2 カラーパレット

インスタグラム風UIデザインマイクロロードマップで定義されたカラーパレットを使用：

- **プライマリカラー**: #2E7D32（深緑）- 信頼と安心感
- **セカンダリカラー**: #FF8F00（アンバー）- アクションと注意喚起
- **アクセントカラー**: #0288D1（青）- 情報と補助的要素
- **ニュートラル**: 
  - 背景: #FFFFFF（白）
  - テキスト: #212121（濃いグレー）
  - 入力フィールド背景: #F5F5F5（薄いグレー）
  - 区切り線: #E0E0E0（中間グレー）

### 2.3 タイポグラフィ

- **アプリケーションフォント**: 
  - 日本語: Noto Sans JP
  - 英数字: Roboto
- **フォントウェイト**:
  - ロゴ: Bold (700)
  - 入力ラベル: Regular (400)
  - ボタンテキスト: Medium (500)
  - リンクテキスト: Regular (400)
- **フォントサイズ**:
  - ロゴテキスト: 32px
  - 入力ラベル: 14px
  - ボタンテキスト: 16px
  - リンクテキスト: 14px
  - エラーメッセージ: 12px

## 3. ログイン画面レイアウト

### 3.1 共通レイアウト（モバイル・Web）

```
+----------------------------------------------------------+
|                                                          |
|                                                          |
|                      [HugMeDoロゴ]                        |
|                                                          |
|                                                          |
|  +------------------------------------------------------+  |
|  |                メールアドレスまたはID                   |  |
|  +------------------------------------------------------+  |
|                                                          |
|  +------------------------------------------------------+  |
|  |                    パスワード                         |  |
|  +------------------------------------------------------+  |
|                                                          |
|  +------------------------------------------------------+  |
|  |                     ログイン                          |  |
|  +------------------------------------------------------+  |
|                                                          |
|                                                          |
|                パスワードをお忘れの方は                    |
|                      [こちら]                            |
|                                                          |
|  --------------------------------------------------------  |
|                                                          |
|                アカウントをお持ちでない方は                |
|                    [新規登録]                            |
|                                                          |
+----------------------------------------------------------+
```

### 3.2 モバイルレイアウト詳細

- **ロゴセクション**: 画面上部から25%の位置に配置
  - ロゴサイズ: 幅240px
  - 余白: 上下40px
- **入力フォーム**: ロゴの下に配置
  - 入力フィールド幅: 画面幅の85%
  - 入力フィールド高さ: 48px
  - フィールド間の余白: 16px
  - 角丸: 8px
  - 枠線: なし（影効果のみ）
- **ログインボタン**: 入力フォームの下に配置
  - 幅: 入力フィールドと同じ
  - 高さ: 48px
  - 背景色: プライマリカラー（#2E7D32）
  - テキスト色: 白色
  - 角丸: 8px
  - 余白: 上部24px
- **補助リンク**: 
  - 「パスワードをお忘れの方は」: ログインボタンの下40px
  - 区切り線: 水平線（幅85%、色: #E0E0E0）
  - 「アカウントをお持ちでない方は」: 区切り線の下24px
  - リンク色: アクセントカラー（#0288D1）

### 3.3 Webレイアウト詳細

- モバイルレイアウトを基本とし、以下の調整を行う
- **コンテナ**: 
  - 幅: 400px
  - 背景色: 白色
  - 影効果: 軽微な影（box-shadow: 0 2px 10px rgba(0,0,0,0.1)）
  - 角丸: 12px
- **中央配置**: 画面中央に配置
- **背景**: 薄いグレー（#FAFAFA）

## 4. インタラクション仕様

### 4.1 入力フィールド

- **デフォルト状態**: 
  - 背景色: #F5F5F5
  - 枠線: なし
  - 内部パディング: 左右16px、上下12px
- **フォーカス時**: 
  - 背景色: #FFFFFF
  - 枠線: 1px solid #E0E0E0
  - 微細な拡大アニメーション（scale: 1.01）
- **エラー時**: 
  - 背景色: #FFF8F8
  - 枠線: 1px solid #FF5252
  - エラーメッセージ: フィールド下に赤色テキスト
- **プレースホルダー**: 
  - 色: #9E9E9E
  - テキスト: 「メールアドレスまたはID」「パスワード」

### 4.2 ボタン

- **通常状態**: 
  - 背景色: プライマリカラー（#2E7D32）
  - テキスト色: 白色
- **ホバー時**（Webのみ）: 
  - 背景色: やや暗い緑（#1B5E20）
  - 微細な拡大アニメーション（scale: 1.02）
- **タップ/クリック時**: 
  - 背景色: さらに暗い緑（#0A3D0A）
  - 軽微な縮小アニメーション（scale: 0.98）
- **無効状態**: 
  - 背景色: #BDBDBD
  - テキスト色: #F5F5F5
  - 操作不可

### 4.3 リンク

- **通常状態**: 
  - テキスト色: アクセントカラー（#0288D1）
  - 下線: なし
- **ホバー時**（Webのみ）: 
  - テキスト色: 濃い青（#01579B）
  - 下線: あり
- **タップ/クリック時**: 
  - テキスト色: 濃い青（#01579B）
  - 軽微な不透明度変化（opacity: 0.8）

## 5. アニメーションとトランジション

- **画面表示時**: 
  - ロゴが上からフェードイン（duration: 500ms）
  - 入力フィールドが順番に下からフェードイン（staggered、各300ms）
- **フィールド間の移動**: 
  - スムーズなフォーカス移動（duration: 200ms）
- **ボタン押下時**: 
  - リップルエフェクト（インスタグラム風）
- **エラー表示**: 
  - エラーメッセージが軽微に震える（shake animation）

## 6. アクセシビリティ

- **コントラスト比**: WCAG AA基準（4.5:1以上）を満たす
- **スクリーンリーダー対応**: 
  - 適切なaria属性の実装
  - フォーム要素のラベル関連付け
- **キーボードナビゲーション**: 
  - Tabキーによる論理的な移動順序
  - フォーカス状態の視覚的明示
- **フォントサイズ調整**: 
  - ユーザー設定に応じたサイズ変更対応
  - 最小フォントサイズ12px保証

## 7. 実装ガイドライン

### 7.1 コンポーネント構成

- ログイン画面は以下のコンポーネントで構成:
  - `Logo.svelte`: ロゴ表示コンポーネント
  - `TextInput.svelte`: テキスト入力コンポーネント
  - `PasswordInput.svelte`: パスワード入力コンポーネント（表示/非表示切替機能付き）
  - `Button.svelte`: 汎用ボタンコンポーネント
  - `Divider.svelte`: 区切り線コンポーネント
  - `Link.svelte`: リンクコンポーネント

### 7.2 実装ファイル

```
packages/ui/
  ├── components/
  │   ├── auth/
  │   │   ├── LoginForm.svelte       # ログインフォームコンポーネント
  │   │   └── PasswordInput.svelte   # パスワード入力コンポーネント
  │   ├── common/
  │   │   ├── Button.svelte          # ボタンコンポーネント
  │   │   ├── TextInput.svelte       # テキスト入力コンポーネント
  │   │   ├── Divider.svelte         # 区切り線コンポーネント
  │   │   └── Link.svelte            # リンクコンポーネント
  │   └── branding/
  │       └── Logo.svelte            # ロゴコンポーネント
  └── pages/
      └── auth/
          └── Login.svelte           # ログインページ
```

### 7.3 レスポンシブデザイン

- モバイルファースト設計
- メディアクエリブレイクポイント:
  - スマートフォン: 〜480px
  - タブレット: 481px〜768px
  - デスクトップ: 769px〜

## 8. 実装サンプルコード

### 8.1 LoginForm.svelte（概略）

```svelte
<script>
  import { navigate } from 'svelte-routing';
  import TextInput from '../common/TextInput.svelte';
  import PasswordInput from './PasswordInput.svelte';
  import Button from '../common/Button.svelte';
  import Divider from '../common/Divider.svelte';
  import Link from '../common/Link.svelte';
  import Logo from '../branding/Logo.svelte';
  
  let username = '';
  let password = '';
  let isLoading = false;
  let error = null;
  
  async function handleLogin() {
    if (!username || !password) {
      error = 'ユーザー名とパスワードを入力してください';
      return;
    }
    
    isLoading = true;
    error = null;
    
    try {
      // ログイン処理（実際の実装はAuth APIに依存）
      await authService.login(username, password);
      navigate('/dashboard');
    } catch (err) {
      error = 'ログインに失敗しました。認証情報を確認してください。';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="logo-container">
    <Logo size="large" />
  </div>
  
  <form on:submit|preventDefault={handleLogin} class="login-form">
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <TextInput
      label="メールアドレスまたはID"
      bind:value={username}
      placeholder="メールアドレスまたはID"
      required
    />
    
    <PasswordInput
      bind:value={password}
      placeholder="パスワード"
      required
    />
    
    <Button
      type="submit"
      variant="primary"
      fullWidth
      disabled={isLoading}
      loading={isLoading}
    >
      ログイン
    </Button>
  </form>
  
  <div class="forgot-password">
    <Link href="/forgot-password">パスワードをお忘れの方はこちら</Link>
  </div>
  
  <Divider text="または" />
  
  <div class="signup">
    <span class="signup-text">アカウントをお持ちでない方は</span>
    <Link href="/signup" variant="accent">新規登録</Link>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.5rem;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .logo-container {
    margin-bottom: 2.5rem;
    margin-top: 2rem;
  }
  
  .login-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .error-message {
    color: #FF5252;
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
    animation: shake 0.5s;
  }
  
  .forgot-password {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .signup {
    margin-top: 1.5rem;
    text-align: center;
  }
  
  .signup-text {
    margin-right: 0.5rem;
    color: #757575;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
  }
  
  @media (min-width: 769px) {
    .login-container {
      background-color: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-top: 2rem;
    }
  }
</style>
```

## 9. 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|----------|---------|-------|
| 2025-03-24 | 1.0.0 | 初版作成 | HugMeDoチーム |

## 10. 参考資料

- DESIGN-001（ログイン画面デザイン仕様書）
- instagram-style-ui-roadmap.md（インスタグラム風UIデザインマイクロロードマップ）
- Material Design Guidelines
- Instagram UI/UX パターン
