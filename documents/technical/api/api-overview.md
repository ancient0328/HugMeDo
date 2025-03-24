# HugMeDo API 概要

**文書番号**: API-001  
**作成日**: 2025-03-21  
**最終更新日**: 2025-03-22  
**バージョン**: 1.0.0  
**ステータス**: ドラフト  
**関連文書**: 
- ARCH-001 (アーキテクチャ概要)
- ARCH-002 (コンテナ化モジュラーモノリス)
- DEC-001 (ディレクトリ構造設計)

## 1. はじめに

このドキュメントは、HugMeDoアプリケーションのAPI仕様を定義します。HugMeDoはコンテナ化モジュラーモノリスアーキテクチャを採用しており、コアサービスと複数のモジュール（OHR、Chat、HALCA、Hugmemo）から構成されています。このAPIドキュメントは開発者がHugMeDoのバックエンドサービスと効率的に連携するための参照として機能します。

## 2. API概要

### 2.1 ベースURL

| 環境 | URL |
|------|-----|
| 開発環境 | `http://localhost:3000/api` |
| ステージング環境 | `https://staging.hugmedo.com/api` |
| 本番環境 | `https://hugmedo.com/api` |

### 2.2 認証

HugMeDoのAPIは、Amazon Cognitoを使用した認証システムを採用しています。APIリクエストには、以下のいずれかの認証方法が必要です：

1. **Bearer認証**：HTTPヘッダーに`Authorization: Bearer <token>`形式でJWTトークンを含める
2. **APIキー認証**：HTTPヘッダーに`X-API-Key: <api-key>`形式でAPIキーを含める（特定のサービス間連携用）

### 2.3 レスポンス形式

すべてのAPIレスポンスは、一貫したJSON形式で返されます：

```json
{
  "success": true|false,
  "data": { ... },  // 成功時のレスポンスデータ
  "error": {        // エラー時のみ存在
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  },
  "meta": {         // ページネーションなどのメタ情報（該当する場合）
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### 2.4 エラーコード

| HTTPステータス | エラーコード | 説明 |
|--------------|------------|------|
| 400 | INVALID_REQUEST | リクエストパラメータが無効 |
| 401 | UNAUTHORIZED | 認証情報が無効または不足 |
| 403 | FORBIDDEN | 権限不足 |
| 404 | NOT_FOUND | リソースが見つからない |
| 409 | CONFLICT | リソースの競合 |
| 422 | VALIDATION_ERROR | バリデーションエラー |
| 429 | RATE_LIMITED | レート制限超過 |
| 500 | SERVER_ERROR | サーバー内部エラー |
| 503 | SERVICE_UNAVAILABLE | サービス一時停止中 |

### 2.5 APIバージョニング

APIはURLパスでバージョニングされています。現在サポートされているバージョンは：

- `/api/v1/` - 現行バージョン

## 3. サービスエンドポイント

各モジュールは以下のベースURLで提供されます：

| モジュール | 説明 | 開発環境URL | ポート番号 |
|----------|------|------------|----------|
| API Gateway | 認証・ルーティング | http://localhost:40000 | 40000 |
| OHR | ビデオ通話モジュール | http://localhost:40100 | 40100 |
| Chat | リアルタイムチャットモジュール | http://localhost:40110 | 40110 |
| HALCA | メンタルヘルスチェックモジュール | http://localhost:40120 | 40120 |
| Hugmemo | 医療記録管理モジュール | http://localhost:40130 | 40130 |

## 4. API機能グループ

HugMeDoのAPIは、以下の機能グループに分類されます：

1. **認証API** - ユーザー登録、ログイン、トークン管理
2. **ユーザーAPI** - ユーザープロファイル管理
3. **OHRモジュールAPI** - ビデオ通話、会議管理
4. **ChatモジュールAPI** - チャット機能
5. **HALCAモジュールAPI** - メンタルヘルスチェック、質問応答
6. **HugmemoモジュールAPI** - メモ管理
7. **予約API** - 予約作成、管理、通知
8. **管理API** - システム管理、統計、レポート

各APIグループの詳細は、個別のAPIドキュメントを参照してください：

- [認証API仕様](./auth-api.md)
- [ユーザーAPI仕様](./user-api.md)
- [OHRモジュールAPI仕様](./ohr-api.md)
- [ChatモジュールAPI仕様](./chat-api.md)
- [HALCAモジュールAPI仕様](./halca-api.md)
- [HugmemoモジュールAPI仕様](./hugmemo-api.md)
- [予約API仕様](./appointment-api.md)
- [管理API仕様](./admin-api.md)

## 5. 共通パラメータ

### 5.1 ページネーション

リスト取得APIでは、以下のクエリパラメータがサポートされています：

| パラメータ | 型 | デフォルト | 説明 |
|----------|---|----------|------|
| page | 整数 | 1 | ページ番号 |
| limit | 整数 | 10 | 1ページあたりの項目数（最大100） |
| sort | 文字列 | createdAt:desc | ソートフィールドと方向（field:asc/desc） |

### 5.2 フィルタリング

リスト取得APIでは、以下のフィルタリングパラメータがサポートされています：

| パラメータ | 説明 | 例 |
|----------|------|-----|
| filter[field] | 特定フィールドでフィルタリング | filter[status]=active |
| search | 全文検索 | search=keyword |
| from | 日付範囲（開始） | from=2025-01-01 |
| to | 日付範囲（終了） | to=2025-01-31 |

## 6. レート制限

APIリクエストには以下のレート制限が適用されます：

| APIグループ | 制限 | 期間 |
|-----------|------|------|
| 認証API | 10リクエスト | 1分 |
| 一般API | 60リクエスト | 1分 |
| 管理API | 120リクエスト | 1分 |

レート制限を超過した場合、429ステータスコードが返されます。`Retry-After`ヘッダーには、次のリクエストを試行するまでの待機時間（秒）が含まれます。

## 7. セキュリティ考慮事項

### 7.1 データ保護

- すべてのAPIリクエストはHTTPS経由で送信する必要があります
- 機密データはAES-256-GCMで暗号化されます
- 医療情報は特別な保護対象として扱われます

### 7.2 トークン管理

- アクセストークンの有効期限は24時間
- リフレッシュトークンの有効期限は30日
- トークンはJWTフォーマットで、RS256アルゴリズムで署名

### 7.3 APIキー管理

- APIキーは管理コンソールから生成可能
- キーには読み取り専用/読み書き可能の権限レベルを設定可能
- キーの有効期限は最大1年

## 8. 開発者リソース

### 8.1 APIクライアント

以下の言語用APIクライアントが提供されています：

- JavaScript/TypeScript
- Python
- Ruby
- Swift
- Kotlin

### 8.2 開発者ツール

- [Postmanコレクション](https://github.com/hugmedo/api-docs/postman)
- [OpenAPI仕様](https://github.com/hugmedo/api-docs/openapi)
- [APIプレイグラウンド](https://developers.hugmedo.com/playground)

## 9. サポートとフィードバック

APIに関する質問やフィードバックは、以下の方法で提供できます：

- GitHub Issue: [https://github.com/hugmedo/api/issues](https://github.com/hugmedo/api/issues)
- 開発者フォーラム: [https://developers.hugmedo.com/forum](https://developers.hugmedo.com/forum)
- メール: api-support@hugmedo.com

---

*このドキュメントは、HugMeDoアプリケーションのAPI概要を提供するものです。詳細な各APIエンドポイントの仕様については、個別のAPIドキュメントを参照してください。*

最終更新: 2025-03-22
