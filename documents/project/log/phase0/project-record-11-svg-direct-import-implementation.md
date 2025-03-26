# SVGファイルの直接インポート方式の実装

**文書番号**: RECORD-11  
**作成日**: 2025-03-25  
**作成者**: 開発チーム  
**ステータス**: 完了  
**関連文書**: 
- RECORD-08 (UIパッケージの統合)
- RECORD-09 (ログイン画面の改善)

## 1. 概要

HugMeDoプロジェクトにおいて、SVGファイルの参照方法を静的パス参照方式から直接インポート方式に変更しました。この変更により、型安全性の向上、ビルド時の最適化、およびパス解決の信頼性向上が実現されました。

## 2. 背景と目的

### 2.1 従来の方法

従来は静的パス参照方式を使用していました：

```svelte
<img src="/images/hugmedo-frog-logo.svg" alt="HugMeDo カエルロゴ" class="logo-icon">
<img src="/images/hugmedo-text-logo.svg" alt="HugMeDo テキストロゴ" class="logo-text">
```

この方法には以下の課題がありました：
- TypeScriptによるパスの型チェックができない
- ビルド時の最適化が限定的
- ファイル移動時に参照が壊れるリスクが高い

### 2.2 目的

- TypeScriptの型安全性を活用したアセット管理
- ビルド時の最適化によるパフォーマンス向上
- リファクタリング時の安全性確保
- コード品質と保守性の向上

## 3. 実装内容

### 3.1 型定義ファイルの作成

`packages/ui/svelte.d.ts`にSVGファイルの型定義を追加：

```typescript
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}
```

### 3.2 Vite設定の更新

`apps/web/vite.config.ts`および`apps/mobile/vite.config.ts`にSVGファイルのサポートを追加：

```typescript
export default defineConfig({
  plugins: [
    sveltekit(),
  ],
  assetsInclude: ['**/*.svg'],
  optimizeDeps: {
    include: ['@hugmedo/ui']
  },
  // その他の設定...
});
```

### 3.3 SVGファイルの配置

SVGファイルを`packages/ui/assets/images/`ディレクトリにコピー：

```bash
cp /apps/web/static/images/*.svg /packages/ui/assets/images/
```

### 3.4 コンポーネントでの直接インポート

`packages/ui/pages/auth/Login.svelte`でSVGファイルを直接インポート：

```svelte
<script lang="ts">
  import LoginForm from '../../components/auth/LoginForm.svelte';
  import { authStore } from '../../stores/auth';
  import { onMount } from 'svelte';
  import frogLogo from '../../assets/images/hugmedo-frog-logo.svg';
  import textLogo from '../../assets/images/hugmedo-text-logo.svg';
  
  // その他のコード...
</script>

<div class="login-container">
  <div class="login-form">
    <div class="logo-container">
      <img src={frogLogo} alt="HugMeDo カエルロゴ" width="120" height="120" class="logo-icon">
      <img src={textLogo} alt="HugMeDo テキストロゴ" class="logo-text">
    </div>
    
    <!-- その他のコード... -->
  </div>
</div>
```

## 4. 実装過程での課題と解決策

### 4.1 パス解決の問題

最初に試みた相対パス`../../../assets/images/`が正しく解決されず、以下のエラーが発生：

```
[plugin:vite:import-analysis] Failed to resolve import "../../../assets/images/hugmedo-frog-logo.svg" from "../../packages/ui/pages/auth/Login.svelte". Does the file exist?
```

**解決策**：
- SVGファイルの正確な場所を確認
- 正しい相対パス`../../assets/images/`に修正
- SVGファイルをUIパッケージ内の適切な場所にコピー

### 4.2 TypeScriptエラー

直接インポート実装時に以下のTypeScriptエラーが発生：

```
Cannot find module '../../assets/images/hugmedo-frog-logo.svg' or its corresponding type declarations.
```

**解決策**：
- 型定義ファイル（`svelte.d.ts`）でSVGファイルの型定義を追加
- 開発サーバー再起動によるTypeScript設定の再読み込み

## 5. 得られた効果

### 5.1 技術的メリット

- **型安全性の向上**：TypeScriptによるパスの正確性チェック
- **ビルド最適化**：Viteが使用されているアセットのみをバンドルに含める
- **リファクタリング安全性**：ファイル移動時にIDEが参照を自動更新可能
- **コード品質向上**：明示的なインポートによるコードの可読性向上
- **クロスプラットフォーム対応**：WebアプリとMobileアプリの両方で同じ実装が正常に動作

### 5.2 開発効率の向上

- パス解決エラーの早期発見
- リファクタリング時の安全性確保
- アセット管理の一元化

## 6. 今後の展望

- 他のコンポーネントでも同様の直接インポート方式を採用
- 画像最適化プラグインの導入検討
- アセット管理の体系化と標準化

## 7. まとめ

SVGファイルの直接インポート方式の導入により、型安全性、ビルド最適化、コード品質が向上しました。この方法は他のアセットタイプ（PNG、JPG等）にも適用可能であり、プロジェクト全体のアセット管理の標準として採用することを推奨します。
