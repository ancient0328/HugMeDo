# OHRモジュール API仕様書

**文書番号**: API-002  
**作成日**: 2025-03-21  
**最終更新日**: 2025-03-22  
**バージョン**: 1.0.0  
**ステータス**: ドラフト  
**関連文書**: 
- API-001 (API概要)
- ARCH-001 (アーキテクチャ概要)
- ARCH-002 (コンテナ化モジュラーモノリス)

## 1. 概要

OHR（Online Health Room）モジュールは、HugMeDoプラットフォーム上でのビデオ通話機能を提供します。このAPIは、Amazon Chime SDKを活用して、医療従事者と患者間の安全で高品質なビデオ通信を実現します。

## 2. ベース情報

- **ベースURL**: `http://localhost:40100/api/v1`
- **ポート番号**: 40100
- **認証**: Bearer Token (JWT)

## 1. 概要

OHR（Online Health Room）モジュールは、HugMeDoプラットフォーム上でのビデオ通話機能を提供します。このAPIは、Amazon Chime SDKを活用して、医療従事者と患者間の安全で高品質なビデオ通信を実現します。

### 1.1 ベースURL

```
https://api.hugmedo.com/v1/ohr
```

開発環境:
```
http://localhost:40100
```

### 1.2 認証

すべてのAPIリクエストには、Amazon Cognitoによって発行されたJWTトークンが必要です。トークンは、HTTPリクエストの`Authorization`ヘッダーに以下の形式で含める必要があります：

```
Authorization: Bearer <token>
```

## 2. エンドポイント一覧

| メソッド | パス | 説明 |
|---------|-----|------|
| POST | /meetings | 新しい会議を作成 |
| GET | /meetings/{meetingId} | 会議情報を取得 |
| POST | /meetings/{meetingId}/attendees | 会議に参加者を追加 |
| GET | /meetings/{meetingId}/attendees | 会議の参加者一覧を取得 |
| DELETE | /meetings/{meetingId}/attendees/{attendeeId} | 参加者を会議から削除 |
| GET | /meetings/{meetingId}/attendees/{attendeeId} | 参加者情報を取得 |
| POST | /meetings/{meetingId}/end | 会議を終了 |

## 3. API詳細

### 3.1 会議作成

新しいビデオ会議を作成します。

**エンドポイント**: `POST /meetings`

**リクエスト**:

```json
{
  "title": "初診相談",
  "scheduledStartTime": "2025-04-01T10:00:00Z",
  "scheduledEndTime": "2025-04-01T10:30:00Z",
  "description": "初めての診察相談",
  "metadata": {
    "patientId": "P12345",
    "doctorId": "D98765",
    "appointmentType": "initial"
  }
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "meetingId": "abcd1234-efgh-5678-ijkl-90mnopqrstuv",
    "title": "初診相談",
    "externalMeetingId": "HugMeDo-Meeting-12345",
    "mediaRegion": "ap-northeast-1",
    "meetingArn": "arn:aws:chime:ap-northeast-1:123456789012:meeting/abcd1234-efgh-5678-ijkl-90mnopqrstuv",
    "scheduledStartTime": "2025-04-01T10:00:00Z",
    "scheduledEndTime": "2025-04-01T10:30:00Z",
    "createdAt": "2025-03-21T09:15:30Z",
    "metadata": {
      "patientId": "P12345",
      "doctorId": "D98765",
      "appointmentType": "initial"
    }
  }
}
```

**エラーレスポンス**:

```json
{
  "success": false,
  "error": {
    "code": "MEETING_CREATION_FAILED",
    "message": "会議の作成に失敗しました",
    "details": "AWS Chime SDKサービスとの通信中にエラーが発生しました"
  }
}
```

### 3.2 会議情報取得

既存の会議の詳細情報を取得します。

**エンドポイント**: `GET /meetings/{meetingId}`

**パスパラメータ**:
- `meetingId`: 会議ID

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "meetingId": "abcd1234-efgh-5678-ijkl-90mnopqrstuv",
    "title": "初診相談",
    "status": "created",
    "mediaRegion": "ap-northeast-1",
    "meetingArn": "arn:aws:chime:ap-northeast-1:123456789012:meeting/abcd1234-efgh-5678-ijkl-90mnopqrstuv",
    "scheduledStartTime": "2025-04-01T10:00:00Z",
    "scheduledEndTime": "2025-04-01T10:30:00Z",
    "createdAt": "2025-03-21T09:15:30Z",
    "attendeeCount": 0,
    "metadata": {
      "patientId": "P12345",
      "doctorId": "D98765",
      "appointmentType": "initial"
    }
  }
}
```

**エラーレスポンス**:

```json
{
  "success": false,
  "error": {
    "code": "MEETING_NOT_FOUND",
    "message": "指定された会議が見つかりません",
    "details": "meetingId: abcd1234-efgh-5678-ijkl-90mnopqrstuv"
  }
}
```

### 3.3 参加者追加

会議に新しい参加者を追加します。

**エンドポイント**: `POST /meetings/{meetingId}/attendees`

**パスパラメータ**:
- `meetingId`: 会議ID

**リクエスト**:

```json
{
  "userId": "user123",
  "displayName": "山田 太郎",
  "role": "doctor",
  "metadata": {
    "specialty": "内科",
    "licenseNumber": "12345"
  }
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "attendeeId": "wxyz9876-abcd-5432-efgh-10ijklmnopqr",
    "externalUserId": "user123",
    "displayName": "山田 太郎",
    "joinToken": "AAAA.BBBBBBBBBBBBB.CCCCCCCCCCCC",
    "role": "doctor",
    "joinUrl": "https://meetings.hugmedo.com/join?token=AAAA.BBBBBBBBBBBBB.CCCCCCCCCCCC",
    "createdAt": "2025-03-21T09:20:15Z",
    "metadata": {
      "specialty": "内科",
      "licenseNumber": "12345"
    }
  }
}
```

**エラーレスポンス**:

```json
{
  "success": false,
  "error": {
    "code": "ATTENDEE_CREATION_FAILED",
    "message": "参加者の追加に失敗しました",
    "details": "会議が既に終了しているか、最大参加者数に達しています"
  }
}
```

### 3.4 参加者一覧取得

会議の全参加者リストを取得します。

**エンドポイント**: `GET /meetings/{meetingId}/attendees`

**パスパラメータ**:
- `meetingId`: 会議ID

**クエリパラメータ**:
- `role` (オプション): 特定のロールでフィルタリング（例: "doctor", "patient"）

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "attendees": [
      {
        "attendeeId": "wxyz9876-abcd-5432-efgh-10ijklmnopqr",
        "externalUserId": "user123",
        "displayName": "山田 太郎",
        "role": "doctor",
        "joinStatus": "joined",
        "joinedAt": "2025-03-21T09:25:10Z",
        "metadata": {
          "specialty": "内科",
          "licenseNumber": "12345"
        }
      },
      {
        "attendeeId": "defg5678-hijk-9012-lmno-34pqrstuvwxy",
        "externalUserId": "user456",
        "displayName": "佐藤 花子",
        "role": "patient",
        "joinStatus": "pending",
        "metadata": {
          "patientId": "P12345"
        }
      }
    ],
    "totalCount": 2
  }
}
```

### 3.5 参加者削除

会議から特定の参加者を削除します。

**エンドポイント**: `DELETE /meetings/{meetingId}/attendees/{attendeeId}`

**パスパラメータ**:
- `meetingId`: 会議ID
- `attendeeId`: 参加者ID

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "message": "参加者が正常に削除されました",
    "attendeeId": "defg5678-hijk-9012-lmno-34pqrstuvwxy"
  }
}
```

### 3.6 参加者情報取得

特定の参加者の詳細情報を取得します。

**エンドポイント**: `GET /meetings/{meetingId}/attendees/{attendeeId}`

**パスパラメータ**:
- `meetingId`: 会議ID
- `attendeeId`: 参加者ID

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "attendeeId": "wxyz9876-abcd-5432-efgh-10ijklmnopqr",
    "externalUserId": "user123",
    "displayName": "山田 太郎",
    "role": "doctor",
    "joinStatus": "joined",
    "joinedAt": "2025-03-21T09:25:10Z",
    "lastActiveAt": "2025-03-21T09:40:22Z",
    "metadata": {
      "specialty": "内科",
      "licenseNumber": "12345"
    }
  }
}
```

### 3.7 会議終了

進行中の会議を終了します。

**エンドポイント**: `POST /meetings/{meetingId}/end`

**パスパラメータ**:
- `meetingId`: 会議ID

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "message": "会議が正常に終了しました",
    "meetingId": "abcd1234-efgh-5678-ijkl-90mnopqrstuv",
    "endedAt": "2025-03-21T10:30:45Z",
    "duration": "65m 35s"
  }
}
```

## 4. ステータスコード

| コード | 説明 |
|-------|------|
| 200 | 成功 |
| 201 | リソース作成成功 |
| 400 | 不正なリクエスト |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | リソースが見つからない |
| 409 | リソースの競合 |
| 429 | リクエスト数制限超過 |
| 500 | サーバーエラー |

## 5. エラーコード

| エラーコード | 説明 |
|------------|------|
| MEETING_CREATION_FAILED | 会議の作成に失敗 |
| MEETING_NOT_FOUND | 指定された会議が存在しない |
| MEETING_ALREADY_ENDED | 会議は既に終了している |
| ATTENDEE_CREATION_FAILED | 参加者の追加に失敗 |
| ATTENDEE_NOT_FOUND | 指定された参加者が存在しない |
| ATTENDEE_LIMIT_EXCEEDED | 参加者数の上限に達している |
| INVALID_PARAMETERS | リクエストパラメータが無効 |
| AUTHORIZATION_FAILED | 認証に失敗 |
| PERMISSION_DENIED | 操作の権限がない |
| SERVICE_UNAVAILABLE | サービスが一時的に利用できない |

## 6. データモデル

### 6.1 会議（Meeting）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| meetingId | string | 会議の一意識別子 |
| title | string | 会議のタイトル |
| externalMeetingId | string | 外部システムでの会議ID |
| status | string | 会議の状態（created, started, ended） |
| mediaRegion | string | メディアサーバーのリージョン |
| meetingArn | string | AWS Chime会議のARN |
| scheduledStartTime | datetime | 予定開始時間 |
| scheduledEndTime | datetime | 予定終了時間 |
| actualStartTime | datetime | 実際の開始時間 |
| actualEndTime | datetime | 実際の終了時間 |
| createdAt | datetime | 作成日時 |
| metadata | object | 追加メタデータ |

### 6.2 参加者（Attendee）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| attendeeId | string | 参加者の一意識別子 |
| meetingId | string | 所属する会議ID |
| externalUserId | string | 外部システムでのユーザーID |
| displayName | string | 表示名 |
| role | string | 役割（doctor, patient, etc） |
| joinToken | string | 参加トークン |
| joinStatus | string | 参加状態（pending, joined, left） |
| joinedAt | datetime | 参加日時 |
| leftAt | datetime | 退出日時 |
| lastActiveAt | datetime | 最後のアクティブ時間 |
| metadata | object | 追加メタデータ |

## 7. 使用例

### 7.1 会議作成と参加者追加のフロー

1. 会議を作成する
```bash
curl -X POST http://localhost:40100/api/v1/ohr/meetings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "定期健康相談",
    "scheduledStartTime": "2025-04-01T14:00:00Z",
    "scheduledEndTime": "2025-04-01T14:30:00Z",
    "metadata": {
      "patientId": "P12345",
      "doctorId": "D98765"
    }
  }'
```

2. 医師を参加者として追加
```bash
curl -X POST http://localhost:40100/api/v1/ohr/meetings/abcd1234-efgh-5678-ijkl-90mnopqrstuv/attendees \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "D98765",
    "displayName": "山田 太郎",
    "role": "doctor"
  }'
```

3. 患者を参加者として追加
```bash
curl -X POST http://localhost:40100/api/v1/ohr/meetings/abcd1234-efgh-5678-ijkl-90mnopqrstuv/attendees \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "P12345",
    "displayName": "佐藤 花子",
    "role": "patient"
  }'
```

## 8. セキュリティ考慮事項

### 8.1 データ保護

- すべての通信はTLS 1.3で暗号化されます
- 会議データは保存時にAES-256-GCMで暗号化されます
- 参加トークンは一時的なものであり、会議終了後に無効化されます

### 8.2 アクセス制御

- 会議作成は認証された医療従事者のみが可能です
- 参加者は自分の会議のみにアクセスできます
- 管理者は監査目的ですべての会議データにアクセスできます

### 8.3 コンプライアンス

- 医療情報システムガイドラインに準拠
- 個人情報保護法に準拠
- HIPAA（将来の国際展開用）に準拠予定

## 9. レート制限

| エンドポイント | 制限 | 期間 |
|--------------|------|------|
| 全エンドポイント | 100リクエスト | 1分あたり |
| /meetings (POST) | 10リクエスト | 1分あたり |
| /meetings/{meetingId}/attendees (POST) | 20リクエスト | 1分あたり |

レート制限を超えた場合、429ステータスコードが返されます。

## 10. バージョニング

OHR APIは、セマンティックバージョニングに従います。現在のバージョンはv1です。

将来のバージョンでは、以下の変更が予定されています：
- v1.1: 会議の録画機能の追加
- v1.2: リアルタイムの字幕機能
- v2.0: WebRTCベースの新しい通信プロトコル

---
最終更新: 2025-03-22
