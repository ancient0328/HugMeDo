# CI/CD パイプライン設定ガイド

**文書番号**: GUIDE-006  
**作成日**: 2025-03-22  
**最終更新日**: 2025-03-22  
**バージョン**: 1.0.0  
**ステータス**: 確定  
**関連文書**: 
- ARCH-001 (アーキテクチャ概要)
- DEV-001 (開発環境セットアップ)
- GUIDE-005 (Docker Compose設定ガイド)

## 1. 概要

本ドキュメントでは、HugMeDoプロジェクトのCI/CD（継続的インテグレーション/継続的デリバリー）パイプラインについて説明します。GitHub Actionsを使用して、コードの品質管理から本番環境へのデプロイまでを自動化する方法を詳述します。

## 2. CI/CDパイプラインの概要

HugMeDoプロジェクトでは、以下の2つの主要なワークフローを使用しています：

1. **CI Pipeline (Develop)**: `develop`ブランチへのプッシュまたはプルリクエスト時に実行される継続的インテグレーションパイプライン
2. **CD Pipeline (Main)**: `main`ブランチへのプッシュ時に実行される継続的デリバリーパイプライン

## 3. CI Pipeline (Develop)

### 3.1 トリガー

- `develop`ブランチへのプッシュ
- `develop`ブランチへのプルリクエスト

### 3.2 ジョブとステップ

#### 3.2.1 Lint

コードの品質チェックを行います。

1. コードのチェックアウト
2. Node.jsのセットアップ
3. pnpmのセットアップとキャッシュ
4. 依存関係のインストール
5. リントの実行（`pnpm lint`）

#### 3.2.2 Test

ユニットテストを実行します。

1. コードのチェックアウト
2. Node.jsのセットアップ
3. pnpmのセットアップとキャッシュ
4. 依存関係のインストール
5. テストの実行（`pnpm test`）

#### 3.2.3 Build

アプリケーションのビルドを行います。

1. コードのチェックアウト
2. Node.jsのセットアップ
3. pnpmのセットアップとキャッシュ
4. 依存関係のインストール
5. ビルドの実行（`pnpm build`）
6. ビルド成果物のアップロード

#### 3.2.4 Docker Build

各サービスのDockerイメージをビルドします（プッシュはしません）。

1. コードのチェックアウト
2. Docker Buildxのセットアップ
3. 各サービス（APIゲートウェイ、OHRモジュール、Chatモジュール、Webフロントエンド、モバイルフロントエンド）のDockerイメージビルド

#### 3.2.5 Integration Test

統合テストを実行します。

1. PostgreSQLとRedisのサービスコンテナの起動
2. コードのチェックアウト
3. Node.jsのセットアップ
4. pnpmのセットアップとキャッシュ
5. 依存関係のインストール
6. 統合テストの実行（`pnpm test:integration`）

## 4. CD Pipeline (Main)

### 4.1 トリガー

- `main`ブランチへのプッシュ
- 手動トリガー（`workflow_dispatch`）

### 4.2 ジョブとステップ

#### 4.2.1 Lint

CIパイプラインと同様のリント処理を行います。

#### 4.2.2 Test

CIパイプラインと同様のテスト処理を行います。

#### 4.2.3 Build

CIパイプラインと同様のビルド処理を行います。

#### 4.2.4 Docker Build and Push

各サービスのDockerイメージをビルドし、Docker Hubにプッシュします。

1. コードのチェックアウト
2. Docker Buildxのセットアップ
3. Docker Hubへのログイン
4. Docker用メタデータの抽出（タグ、ラベル）
5. 各サービスのDockerイメージのビルドとプッシュ

#### 4.2.5 Deploy to AWS

AWSへのデプロイを行います。

1. コードのチェックアウト
2. AWS認証情報の設定
3. Amazon ECRへのログイン
4. ECSタスク定義のダウンロード
5. 新しいイメージIDでのタスク定義の更新
6. Amazon ECSへのタスク定義のデプロイ

#### 4.2.6 Notify

デプロイ完了後の通知を行います。

1. Slack通知の送信

## 5. 環境変数とシークレット

CI/CDパイプラインでは、以下の環境変数とシークレットを使用します：

### 5.1 Docker Hub関連

- `DOCKER_HUB_USERNAME`: Docker Hubのユーザー名
- `DOCKER_HUB_TOKEN`: Docker Hubのアクセストークン

### 5.2 AWS関連

- `AWS_ACCESS_KEY_ID`: AWSアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: AWSシークレットアクセスキー

### 5.3 通知関連

- `SLACK_WEBHOOK_URL`: Slack通知用のWebhook URL

## 6. シークレットの設定方法

GitHub Actionsでシークレットを設定するには：

1. GitHubリポジトリの「Settings」タブを開く
2. 左側のメニューから「Secrets and variables」→「Actions」を選択
3. 「New repository secret」ボタンをクリック
4. シークレットの名前と値を入力して保存

## 7. ワークフローのカスタマイズ

### 7.1 テスト戦略の変更

テスト戦略を変更する場合は、`.github/workflows/ci-develop.yml`と`.github/workflows/cd-main.yml`の`test`ジョブを修正します。

### 7.2 デプロイ先の変更

AWS以外の環境にデプロイする場合は、`.github/workflows/cd-main.yml`の`deploy-aws`ジョブを対象の環境に合わせて修正します。

### 7.3 通知方法の変更

Slack以外の通知方法を使用する場合は、`.github/workflows/cd-main.yml`の`notify`ジョブを対象のサービスに合わせて修正します。

## 8. トラブルシューティング

### 8.1 ワークフローの失敗

ワークフローが失敗した場合は、以下の点を確認してください：

1. GitHub Actionsのログを確認
2. 必要なシークレットが正しく設定されているか確認
3. 依存関係が正しくインストールされているか確認
4. テストが正しく実行されているか確認

### 8.2 デプロイの失敗

デプロイが失敗した場合は、以下の点を確認してください：

1. AWS認証情報が正しく設定されているか確認
2. ECSタスク定義が正しく設定されているか確認
3. ECRリポジトリが存在するか確認
4. VPCやセキュリティグループの設定を確認

## 9. ベストプラクティス

1. プルリクエストを使用して変更を`develop`ブランチにマージする
2. 自動テストが成功した変更のみを`main`ブランチにマージする
3. シークレットを定期的にローテーションする
4. ワークフローの実行時間を監視し、必要に応じて最適化する
5. デプロイ前に統合テストを実行する

## 10. 参考リンク

- [GitHub Actions ドキュメント](https://docs.github.com/ja/actions)
- [Docker Hub ドキュメント](https://docs.docker.com/docker-hub/)
- [AWS ECS デプロイドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/deployment-types.html)

---

*このドキュメントはHugMeDoプロジェクトのCI/CDパイプライン設定ガイドとして作成されたものであり、プロジェクトの進行に伴い更新される可能性があります。*
