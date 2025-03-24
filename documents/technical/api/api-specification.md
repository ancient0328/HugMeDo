# HugMeDo API仕様書

**文書番号**: API-002  
**作成日**: 2025年3月21日  
**最終更新**: 2025年3月22日  
**バージョン**: 1.0.1  
**ステータス**: ドラフト  
**関連文書**: ARCH-001（アーキテクチャ概要）, DEC-001（認証システム選定）

## 1. 概要

この文書は、コンテナ化モジュラーモノリスアーキテクチャを採用したHugMeDoアプリケーションのAPI仕様を定義します。HugMeDoはRESTful APIとGraphQL APIを組み合わせて使用し、モジュール間の通信にはgRPCを採用しています。また、リアルタイム機能にはWebSocketを使用しています。

### 1.1 開発フェーズとAPI実装計画

HugMeDoプロジェクトは以下のバージョニング体系に従ってAPIを段階的に実装します：

- **v0.0.0**: 基盤構築フェーズ
  - 認証・認可API
  - ユーザー管理API
  - 基本的なヘルスチェックAPI

- **v0.0.0**: コアモジュール実装フェーズ
  - OHRモジュールAPI（ビデオ通話）
  - ChatモジュールAPI（リアルタイムチャット）
  - 基本的なダッシュボードAPI

- **v0.0.0**: 機能強化フェーズ
  - OHRモジュールの拡張API
  - Chatモジュールの拡張API
  - モジュール間連携API

- **v0.0.0**: 統合・安定化フェーズ
  - 全APIの統合とテスト
  - パフォーマンス最適化
  - APIドキュメントの完成

- **v0.0.0**: 本番リリースフェーズ
  - 全APIの本番稼働

- **v0.0.0以降**: 拡張フェーズ
  - HALCAモジュールAPI
  - HugmemoモジュールAPI
  - 追加機能のAPI

### 1.2 優先実装モジュール

v0.0.0までの開発では、以下の2つのコアモジュールのAPIに焦点を当てます：

1. **OHRモジュール（ビデオ通話）API**
   - ビデオセッション管理
   - 通話録画・再生
   - 待合室管理

2. **Chatモジュール（リアルタイムチャット）API**
   - メッセージング
   - ファイル共有
   - チャットルーム管理

## 2. API設計原則

HugMeDoのAPIは以下の設計原則に従います：

1. **モジュール化**: 各機能モジュールは独立したAPIを提供
2. **一貫性**: 共通のレスポンス形式とエラー処理を採用
3. **バージョニング**: 明示的なAPIバージョニングを実装
4. **ドキュメント化**: OpenAPI/Swagger仕様に準拠
5. **セキュリティ**: 認証・認可の厳格な実装
6. **パフォーマンス**: 効率的なデータ転送と処理

## 3. 認証と認可

### 3.1 認証方式

HugMeDoは以下の認証方式をサポートしています：

1. **JWT認証**:
   - Amazon Cognito（プライマリ）
   - Keycloak（セカンダリ/フォールバック）
   - トークン形式: `Authorization: Bearer <JWT_TOKEN>`

2. **APIキー認証**:
   - サービス間連携用
   - ヘッダー形式: `X-API-Key: <API_KEY>`

3. **相互TLS認証**:
   - 重要なバックエンドサービス間の通信に使用
   - クライアント証明書による認証

### 3.2 認可モデル

- **ロールベースアクセス制御（RBAC）**: 
  - ADMIN, DOCTOR, NURSE, CAREGIVER, PARENT など
- **属性ベースアクセス制御（ABAC）**:
  - 特定の条件に基づくきめ細かいアクセス制御

## 4. API種別とエンドポイント

### 4.1 RESTful API

#### ベースURL

| 環境 | URL |
|------|-----|
| 開発環境 | `http://localhost:3000/api/v1` |
| ステージング環境 | `https://staging.hugmedo.com/api/v1` |
| 本番環境 | `https://api.hugmedo.com/v1` |

#### 主要エンドポイント

| リソース | メソッド | エンドポイント | 説明 |
|---------|--------|--------------|------|
| ユーザー | GET | `/users` | ユーザー一覧取得 |
| ユーザー | GET | `/users/{id}` | 特定ユーザー取得 |
| ユーザー | POST | `/users` | ユーザー作成 |
| ユーザー | PUT | `/users/{id}` | ユーザー更新 |
| ユーザー | DELETE | `/users/{id}` | ユーザー削除 |
| 予約 | GET | `/appointments` | 予約一覧取得 |
| 予約 | POST | `/appointments` | 予約作成 |
| 予約 | PUT | `/appointments/{id}` | 予約更新 |
| 通知 | GET | `/notifications` | 通知一覧取得 |
| 通知 | POST | `/notifications/send` | 通知送信 |

### 4.2 GraphQL API

#### エンドポイント

| 環境 | URL |
|------|-----|
| 開発環境 | `http://localhost:3000/graphql` |
| ステージング環境 | `https://staging.hugmedo.com/graphql` |
| 本番環境 | `https://api.hugmedo.com/graphql` |

#### 主要スキーマ

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  avatar: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum UserRole {
  ADMIN
  DOCTOR
  NURSE
  CAREGIVER
  PARENT
}

type ChatRoom {
  id: ID!
  name: String!
  participants: [User!]!
  messages: [Message!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Message {
  id: ID!
  roomId: ID!
  senderId: ID!
  sender: User!
  content: String!
  attachments: [Attachment]
  createdAt: DateTime!
}

type Attachment {
  id: ID!
  type: AttachmentType!
  url: String!
  name: String
  size: Int
}

enum AttachmentType {
  IMAGE
  VIDEO
  DOCUMENT
  AUDIO
}

type Query {
  getUser(id: ID!): User
  listUsers(filter: UserFilter, limit: Int, nextToken: String): UserConnection
  getChatRoom(id: ID!): ChatRoom
  listChatRooms(limit: Int, nextToken: String): ChatRoomConnection
  getMessages(roomId: ID!, limit: Int, nextToken: String): MessageConnection
}

type Mutation {
  createUser(input: CreateUserInput!): User
  updateUser(id: ID!, input: UpdateUserInput!): User
  deleteUser(id: ID!): Boolean
  createChatRoom(input: CreateChatRoomInput!): ChatRoom
  addUserToChatRoom(roomId: ID!, userId: ID!): ChatRoom
  removeUserFromChatRoom(roomId: ID!, userId: ID!): ChatRoom
  sendMessage(input: SendMessageInput!): Message
}

type Subscription {
  onCreateMessage(roomId: ID!): Message
  onUserStatusChange(userId: ID!): UserStatus
}
```

### 4.3 WebSocket API

#### エンドポイント

| 環境 | URL |
|------|-----|
| 開発環境 | `ws://localhost:3000/ws` |
| ステージング環境 | `wss://staging.hugmedo.com/ws` |
| 本番環境 | `wss://api.hugmedo.com/ws` |

#### イベント

| イベント | 説明 |
|---------|------|
| `message` | チャットメッセージ受信 |
| `presence` | ユーザーオンライン状態変更 |
| `typing` | タイピング状態通知 |
| `call` | ビデオ通話イベント |
| `notification` | システム通知 |

### 4.4 モジュール間API（gRPC）

コンテナ化モジュラーモノリスアーキテクチャでは、モジュール間の通信にgRPCを使用します。

#### 主要サービス

| サービス | 説明 |
|---------|------|
| `UserService` | ユーザー管理 |
| `AuthService` | 認証・認可 |
| `OhrService` | ビデオ通話 |
| `HalcaService` | メンタルヘルスチェック |
| `NotificationService` | 通知管理 |
| `AppointmentService` | 予約管理 |

## 5. データモデル

### 5.1 共通データ型

| データ型 | 説明 | 例 |
|---------|------|-----|
| `ID` | 一意識別子 | `"usr_123456789"` |
| `DateTime` | ISO 8601形式の日時 | `"2025-03-21T13:45:30Z"` |
| `Email` | メールアドレス | `"user@example.com"` |
| `PhoneNumber` | E.164形式の電話番号 | `"+819012345678"` |

### 5.2 主要エンティティ

- **User**: システムユーザー（医師、看護師、介護者、親など）
- **Patient**: 患者情報
- **Appointment**: 予約情報
- **ChatRoom**: チャットルーム
- **Message**: チャットメッセージ
- **Assessment**: 評価・アセスメント
- **Notification**: 通知

## 6. エラー処理

### 6.1 RESTful APIエラーレスポンス

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": { ... }  // 追加情報（オプション）
  }
}
```

### 6.2 GraphQLエラー

```json
{
  "errors": [
    {
      "message": "エラーメッセージ",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["query", "field"],
      "extensions": {
        "code": "ERROR_CODE",
        "details": { ... }
      }
    }
  ],
  "data": null
}
```

### 6.3 エラーコード

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| `INVALID_REQUEST` | 400 | リクエストパラメータが無効 |
| `UNAUTHORIZED` | 401 | 認証情報が無効または不足 |
| `FORBIDDEN` | 403 | 権限不足 |
| `NOT_FOUND` | 404 | リソースが見つからない |
| `CONFLICT` | 409 | リソースの競合 |
| `VALIDATION_ERROR` | 422 | バリデーションエラー |
| `RATE_LIMITED` | 429 | レート制限超過 |
| `SERVER_ERROR` | 500 | サーバー内部エラー |
| `SERVICE_UNAVAILABLE` | 503 | サービス一時停止中 |

## 7. セキュリティ

### 7.1 通信セキュリティ

- すべてのAPIエンドポイントはTLS 1.3を使用したHTTPS経由でアクセス
- HSTS（HTTP Strict Transport Security）の実装
- 証明書の自動更新（Let's Encryptを使用）

### 7.2 データセキュリティ

- 機密データはAES-256-GCMで暗号化
- 医療情報は特別な保護対象として扱い、追加の暗号化層を実装
- AWS KMSを使用した鍵管理

### 7.3 APIセキュリティ

- CSRFトークンの実装
- レート制限の適用
- IPベースのアクセス制限（管理API）
- WAF（Web Application Firewall）の実装

## 8. コンテナ環境での考慮事項

### 8.1 サービスディスカバリ

- Kubernetes Service/DNS
- 環境変数による動的設定
- ヘルスチェックエンドポイント: `/health`

### 8.2 ロギングと監視

- 構造化ログ（JSON形式）
- 分散トレーシング（OpenTelemetry）
- メトリクスエンドポイント: `/metrics`

### 8.3 スケーリング

- 水平スケーリングのサポート
- ステートレスな設計
- セッション管理の分離

## 9. API開発ライフサイクル

### 9.1 バージョニング戦略

- URLパスベースのバージョニング（例: `/api/v1/resource`）
- 下位互換性の維持
- 非推奨APIの段階的廃止プロセス

### 9.2 テスト

- 単体テスト
- 統合テスト
- 負荷テスト
- セキュリティテスト

### 9.3 ドキュメント

- OpenAPI/Swagger仕様
- APIプレイグラウンド
- コード例とチュートリアル

## 10. 開発者リソース

- [Postmanコレクション](https://github.com/hugmedo/api-docs/postman)
- [OpenAPI仕様](https://github.com/hugmedo/api-docs/openapi)
- [APIプレイグラウンド](https://developers.hugmedo.com/playground)
- [サンプルコード](https://github.com/hugmedo/api-examples)

---

*このドキュメントは、コンテナ化モジュラーモノリスアーキテクチャを採用したHugMeDoアプリケーションのAPI仕様を定義するものです。詳細な各APIエンドポイントの仕様については、個別のAPIドキュメントを参照してください。*

最終更新: 2025年3月22日
