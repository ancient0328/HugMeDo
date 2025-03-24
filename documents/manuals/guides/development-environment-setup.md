# 開発環境セットアップガイド

**文書番号**: GUIDE-002  
**作成日**: 2025-03-21  
**最終更新日**: 2025-03-22  
**バージョン**: 1.0.0  
**ステータス**: ドラフト  
**関連文書**: 
- ARCH-001 (アーキテクチャ概要)
- GUIDE-001 (AWSデプロイガイド)

## 1. 概要

このガイドは、HugMeDoプロジェクトの開発環境をセットアップするための手順を提供します。コンテナ化モジュラーモノリスに基づいたDocker Compose環境の構築方法と、各種開発ツールの設定について説明します。

## 2. 前提条件

### 2.1 必要なツール

以下のツールが開発環境にインストールされている必要があります：

- **Git**: バージョン管理（2.30.0以上）
- **Docker**: コンテナ化（20.10.0以上）
- **Docker Compose**: マルチコンテナ管理（2.0.0以上）
- **Node.js**: JavaScript実行環境（18.0.0以上）
- **pnpm**: パッケージマネージャー（7.0.0以上）
- **Visual Studio Code**: 推奨エディタ（最新版）

### 2.2 推奨VSCode拡張機能

- ESLint: JavaScript/TypeScriptのリンター
- Prettier: コードフォーマッター
- Docker: Dockerファイルとコンテナの管理
- Svelte for VS Code: Svelteファイルのサポート
- GitLens: Git統合の強化
- REST Client: APIテスト用

## 3. リポジトリのクローン

```bash
# メインリポジトリをクローン
git clone https://github.com/hugmedo/HugMeDo.git
cd HugMeDo

# サブモジュールの初期化（必要な場合）
git submodule update --init --recursive
```

## 4. 環境変数の設定

### 4.1 環境変数ファイルの作成

プロジェクトルートディレクトリに `.env.local` ファイルを作成し、以下の内容を設定します：

```bash
# .env.local ファイルの例
NODE_ENV=development

# データベース設定
POSTGRES_USER=hugmedo_dev
POSTGRES_PASSWORD=devpassword
POSTGRES_DB=hugmedo_dev
DATABASE_URL=postgres://hugmedo_dev:devpassword@postgres:5432/hugmedo_dev

# Redisキャッシュ
REDIS_URL=redis://redis:6379

# 認証設定（開発用）
JWT_SECRET=dev_jwt_secret_key_change_in_production
COGNITO_USER_POOL_ID=ap-northeast-1_xxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# OHRモジュール設定
CHIME_AWS_REGION=ap-northeast-1
CHIME_AWS_ACCESS_KEY_ID=dummy_key_for_local_dev
CHIME_AWS_SECRET_ACCESS_KEY=dummy_secret_for_local_dev

# HALCAモジュール設定
OPENAI_API_KEY=your_openai_api_key
```

**注意**: `.env.local` ファイルは `.gitignore` に含まれており、リポジトリにコミットされません。これは機密情報を保護するためです。

### 4.2 サンプル環境変数ファイル

プロジェクトには `.env.example` ファイルが含まれています。このファイルをコピーして `.env.local` を作成することもできます：

```bash
cp .env.example .env.local
# 必要に応じて値を編集
```

## 5. 依存関係のインストール

HugMeDoプロジェクトは **pnpm** をパッケージマネージャーとして使用します。npm や yarn は使用しないでください。

```bash
# pnpmのインストール（未インストールの場合）
npm install -g pnpm

# 依存関係のインストール
pnpm install
```

### 5.1 ワークスペース構造

HugMeDoはpnpmワークスペースを使用したモノレポ構造を採用しています：

```
HugMeDo/
├── apps/              # アプリケーション
│   ├── web/           # Webアプリケーション（SvelteKit）
│   └── mobile/        # モバイルアプリケーション
│
├── modules/           # 機能モジュール
│   ├── api-gateway/   # APIゲートウェイ（認証実装を含む）
│   ├── ohr/           # ビデオ通話モジュール
│   ├── chat/          # チャットモジュール
│   └── halca/         # メンタルヘルスチェックモジュール
│
└── packages/          # 共有パッケージ
    ├── core/          # コアライブラリ
    │   ├── auth/      # 認証関連のインターフェースと型
    │   ├── api/       # API関連のユーティリティ
    │   └── types/     # 型定義
    ├── ui/            # UIコンポーネント
    └── utils/         # ユーティリティ関数
```

### 5.2 モジュール固有の依存関係

特定のモジュールに依存関係を追加する場合は、そのディレクトリに移動してからインストールします：

```bash
# OHRモジュールに依存関係を追加
cd modules/ohr
pnpm add @aws-sdk/client-chime

# HALCAモジュールに依存関係を追加
cd modules/halca
pnpm add openai
```

### 5.3 開発依存関係

開発依存関係はワークスペースのルートに追加します：

```bash
# ルートディレクトリで実行
pnpm add -Dw typescript eslint prettier
```

## 6. Docker Compose環境の起動

### 6.1 Docker Composeファイル

プロジェクトルートの `docker-compose.yml` ファイルには、開発に必要なすべてのサービスが定義されています：

```yaml
version: '3.8'

services:
  # Webアプリケーション
  web:
    build:
      context: .
      dockerfile: ./apps/web/Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis
      - ohr
      - halca

  # OHRモジュール（ビデオ通話）
  ohr:
    build:
      context: .
      dockerfile: ./modules/ohr/Dockerfile.dev
    ports:
      - "40100:40100"
    volumes:
      - ./:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  # HALCAモジュール（メンタルヘルスチェック）
  halca:
    build:
      context: .
      dockerfile: ./modules/halca/Dockerfile.dev
    ports:
      - "40120:40120"
    volumes:
      - ./:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  # PostgreSQLデータベース
  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}

  # Redisキャッシュ
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 6.2 環境の起動

Docker Compose環境を起動するには、以下のコマンドを実行します：

```bash
# 開発環境を起動
docker-compose up

# バックグラウンドで起動する場合
docker-compose up -d

# 特定のサービスのみ起動
docker-compose up web postgres redis
```

### 6.3 環境の停止

```bash
# 環境を停止（コンテナを保持）
docker-compose stop

# 環境を停止して削除（ボリュームは保持）
docker-compose down

# 環境を停止してボリュームも削除
docker-compose down -v
```

## 7. データベース管理

### 7.1 マイグレーション

データベースのマイグレーションには [Prisma](https://www.prisma.io/) を使用しています：

```bash
# マイグレーションの作成
pnpm prisma migrate dev --name init

# マイグレーションの適用
pnpm prisma migrate deploy

# データベーススキーマの生成
pnpm prisma generate
```

### 7.2 シードデータ

開発用のシードデータを投入するには：

```bash
# シードデータの投入
pnpm prisma db seed
```

### 7.3 データベース接続

開発中にデータベースに直接接続するには：

```bash
# PostgreSQLコンテナに接続
docker-compose exec postgres psql -U hugmedo_dev -d hugmedo_dev
```

または、[Prisma Studio](https://www.prisma.io/studio) を使用してGUIでデータベースを管理できます：

```bash
pnpm prisma studio
```

## 8. 開発サーバーへのアクセス

開発環境が起動したら、以下のURLでアクセスできます：

- **Webアプリケーション**: http://localhost:3000
- **OHRモジュールAPI**: http://localhost:40100
- **HALCAモジュールAPI**: http://localhost:40120
- **Prisma Studio**: http://localhost:5555 (起動時)

## 9. テスト実行

### 9.1 ユニットテスト

```bash
# すべてのテストを実行
pnpm test

# 特定のモジュールのテストを実行
pnpm test --filter=ohr

# ウォッチモードでテストを実行
pnpm test:watch
```

### 9.2 E2Eテスト

E2Eテストには [Playwright](https://playwright.dev/) を使用しています：

```bash
# E2Eテストを実行
pnpm test:e2e

# UIモードでE2Eテストを実行
pnpm test:e2e:ui
```

## 10. リント・フォーマット

### 10.1 コードリント

```bash
# リントチェック
pnpm lint

# リント自動修正
pnpm lint:fix
```

### 10.2 コードフォーマット

```bash
# フォーマットチェック
pnpm format:check

# フォーマット適用
pnpm format
```

## 11. ビルド

本番用ビルドを作成するには：

```bash
# すべてのパッケージをビルド
pnpm build

# 特定のアプリをビルド
pnpm build --filter=web
```

## 12. トラブルシューティング

### 12.1 一般的な問題と解決策

| 問題 | 考えられる原因 | 解決策 |
|------|--------------|--------|
| `pnpm install` が失敗する | Node.jsバージョンの不一致 | Node.js v18以上を使用しているか確認 |
| コンテナ起動エラー | ポートの競合 | 使用中のポートを確認し、必要に応じて変更 |
| データベース接続エラー | 環境変数の設定ミス | `.env.local`ファイルの設定を確認 |
| モジュール間通信エラー | ネットワーク設定の問題 | Docker Composeネットワーク設定を確認 |

### 12.2 ログの確認

```bash
# 特定のサービスのログを表示
docker-compose logs web

# リアルタイムでログをフォロー
docker-compose logs -f ohr

# 直近の100行のログを表示
docker-compose logs --tail=100 halca
```

### 12.3 コンテナシェルへのアクセス

```bash
# Webアプリケーションコンテナのシェルにアクセス
docker-compose exec web sh

# PostgreSQLコンテナのシェルにアクセス
docker-compose exec postgres bash
```

## 13. 開発ワークフロー

### 13.1 機能開発

1. 新しいブランチを作成
   ```bash
   git checkout -b feature/new-feature
   ```

2. 変更を実装

3. テストを実行
   ```bash
   pnpm test
   ```

4. リントとフォーマットを適用
   ```bash
   pnpm lint:fix
   pnpm format
   ```

5. 変更をコミット
   ```bash
   git add .
   git commit -m "feat: 新機能の実装"
   ```

6. リモートにプッシュ
   ```bash
   git push origin feature/new-feature
   ```

7. プルリクエストを作成

### 13.2 コミットメッセージ規約

HugMeDoプロジェクトでは、以下のコミットメッセージ規約を採用しています：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメントのみの変更
- `style:` コードの意味に影響しない変更（空白、フォーマット、セミコロンの欠落など）
- `refactor:` バグを修正せず機能も追加しないコード変更
- `test:` テストの追加または修正
- `chore:` ビルドプロセスやツールの変更

## 14. 開発環境のカスタマイズ

### 14.1 ポート変更

デフォルトのポート設定を変更する場合は、`docker-compose.yml`ファイルを編集します：

```yaml
services:
  web:
    ports:
      - "8080:3000"  # ローカルの8080ポートをコンテナの3000ポートにマッピング
```

### 14.2 ボリュームマウント

追加のボリュームをマウントする場合：

```yaml
services:
  web:
    volumes:
      - ./:/app
      - /app/node_modules
      - ./logs:/app/logs  # ログディレクトリをマウント
```

### 14.3 環境変数のオーバーライド

特定の環境変数をオーバーライドするには、`.env.local.override`ファイルを作成します：

```bash
# .env.local.override
DATABASE_URL=postgres://custom_user:custom_password@localhost:5432/custom_db
```

## 15. VSCode設定

### 15.1 推奨ワークスペース設定

プロジェクトには`.vscode/settings.json`ファイルが含まれており、推奨設定が定義されています：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "svelte"
  ],
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  }
}
```

### 15.2 デバッグ設定

VSCodeでのデバッグを設定するには、`.vscode/launch.json`ファイルを使用します：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Web",
      "port": 9229,
      "restart": true,
      "sourceMaps": true
    }
  ]
}
```

## 16. CI/CD統合

### 16.1 GitHub Actions

プロジェクトには`.github/workflows/ci.yml`ファイルが含まれており、CI/CDパイプラインが定義されています：

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 7
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
```

## 17. 参考リソース

- [Docker ドキュメント](https://docs.docker.com/)
- [pnpm ドキュメント](https://pnpm.io/ja/)
- [SvelteKit ドキュメント](https://kit.svelte.dev/)
- [Prisma ドキュメント](https://www.prisma.io/docs/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

---

*このガイドは、HugMeDoプロジェクトの開発環境セットアップ手順を提供するものです。環境やバージョンによって一部手順が異なる場合があります。*

最終更新: 2025-03-22
