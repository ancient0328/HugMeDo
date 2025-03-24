# UIパッケージの統合と依存関係管理

## 概要

日付: 2025年3月24日

HugMeDoプロジェクトにおける`/packages/ui`の効率的な活用と、`/apps/web`および`/apps/mobile`からのコンポーネント共有方法について設計しました。モノレポ構造におけるpnpmワークスペースを活用した依存関係管理の仕組みを確立し、UIコンポーネントの再利用性を高めます。

## 実施した設計

1. **pnpmワークスペース構成**
   - プロジェクトルートの`pnpm-workspace.yaml`で適切なパッケージディレクトリを定義
   - 各パッケージ間の依存関係を明示的に管理
   - ワークスペース全体の依存関係には`-w`フラグを使用

2. **UIパッケージの設計**
   - `/packages/ui`をプロジェクト内の共有UIコンポーネントライブラリとして構成
   - コンポーネント、ページ、アセットを適切にエクスポート
   - 再利用可能なコンポーネントの標準化

3. **アプリケーションからの参照方法**
   - `/apps/web`および`/apps/mobile`からのインポート方法の標準化
   - アセット（画像、スタイル）の効率的な共有方法
   - TypeScriptの型定義による安全性確保

## 技術的詳細

### pnpmワークスペースの設定

プロジェクトルートに以下の`pnpm-workspace.yaml`を配置：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### UIパッケージの設定

`/packages/ui/package.json`での設定例：

```json
{
  "name": "@hugmedo/ui",
  "version": "0.0.1",
  "exports": {
    ".": "./index.js",
    "./components/*": "./components/*",
    "./pages/*": "./pages/*",
    "./assets/*": "./assets/*"
  }
}
```

### アプリケーションからの参照

アプリケーションからUIパッケージを依存関係として追加：

```bash
# Webアプリの場合
cd /apps/web
pnpm add @hugmedo/ui

# モバイルアプリの場合
cd /apps/mobile
pnpm add @hugmedo/ui
```

### コンポーネントのインポート例

```javascript
// コンポーネントのインポート
import Button from '@hugmedo/ui/components/common/Button.svelte';
import LoginPage from '@hugmedo/ui/pages/auth/Login.svelte';

// アセットのインポート
import logoImage from '@hugmedo/ui/assets/images/hugmedo-text-logo.svg';
```

### アセット参照の方法

1. **直接インポート方式**（推奨）:
   ```javascript
   import logoImage from '@hugmedo/ui/assets/images/hugmedo-text-logo.svg';
   
   // 使用例
   <img src={logoImage} alt="HugMeDo" />
   ```

2. **パブリックディレクトリ方式**:
   ビルド時にアセットをパブリックディレクトリにコピーし、相対パスで参照。

## 注意点と推奨事項

1. **ビルド設定**：
   - Viteなどのビルドツールで、エイリアスやモジュール解決の設定が必要
   - アセットのバンドル方法を適切に設定

2. **TypeScript対応**：
   - 型定義ファイルを適切に提供
   - コンポーネントのpropsに型を付与

3. **モバイル特有の考慮事項**：
   - Reactネイティブなどのモバイルアプリでは、Webと異なる画像の扱いが必要
   - プラットフォーム固有の実装を考慮

4. **バージョン管理**：
   - UIパッケージの変更がアプリケーションに与える影響を考慮
   - 破壊的変更を行う場合はバージョン番号を適切に上げる

## 今後の展望

1. **コンポーネントカタログの作成**：
   - Storybookなどを活用したUIコンポーネントの可視化
   - 使用方法のドキュメント整備

2. **テスト自動化**：
   - UIコンポーネントの単体テスト
   - ビジュアルリグレッションテスト

3. **デザインシステムの確立**：
   - デザイントークンの標準化
   - アクセシビリティガイドラインの整備

## 関連ドキュメント

- [コンテナ化モジュラーモノリス設計](/documents/architecture/containerized-modular-monolith.md)
- [開発環境セットアップガイド](/documents/guides/development-environment-setup.md)
- [コーディング規約](/documents/guides/coding-standards.md)
