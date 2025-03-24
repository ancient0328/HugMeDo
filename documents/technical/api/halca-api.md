# HALCAモジュール API仕様書

**文書番号**: API-003  
**作成日**: 2025-03-21  
**最終更新日**: 2025-03-22  
**バージョン**: 1.0.0  
**ステータス**: ドラフト  
**関連文書**: 
- API-001 (API概要)
- ARCH-001 (アーキテクチャ概要)
- ARCH-002 (コンテナ化モジュラーモノリス)

## 1. 概要

HALCA（Health Assessment with Linguistic Conversational Agent）モジュールは、HugMeDoプラットフォーム上でメンタルヘルスチェック機能を提供します。このAPIは、自然言語処理技術を活用して、伊勢方言を用いた自然な会話形式でメンタルヘルス評価を行います。

## 2. ベース情報

- **ベースURL**: `http://localhost:40120/api/v1`
- **ポート番号**: 40120
- **認証**: Bearer Token (JWT)

### 2.1 エンドポイント

## 3. エンドポイント一覧

| メソッド | パス | 説明 |
|---------|-----|------|
| POST | /sessions | 新しい評価セッションを作成 |
| GET | /sessions/{sessionId} | セッション情報を取得 |
| GET | /sessions/{sessionId}/questions | セッションの次の質問を取得 |
| POST | /sessions/{sessionId}/responses | 質問への回答を送信 |
| GET | /sessions/{sessionId}/results | セッションの評価結果を取得 |
| PUT | /sessions/{sessionId}/end | セッションを終了 |
| GET | /users/{userId}/history | ユーザーの評価履歴を取得 |

## 4. API詳細

### 4.1 評価セッション作成

新しいメンタルヘルス評価セッションを作成します。

**エンドポイント**: `POST /sessions`

**リクエスト**:

```json
{
  "userId": "user123",
  "assessmentType": "mPHQ",
  "dialect": "ise",
  "metadata": {
    "referringDoctorId": "D98765",
    "reason": "定期チェック"
  }
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abcd1234efgh5678",
    "userId": "user123",
    "assessmentType": "mPHQ",
    "dialect": "ise",
    "status": "started",
    "createdAt": "2025-03-21T10:15:30Z",
    "expiresAt": "2025-03-21T11:15:30Z",
    "metadata": {
      "referringDoctorId": "D98765",
      "reason": "定期チェック"
    }
  }
}
```

### 4.2 セッション情報取得

既存の評価セッションの詳細情報を取得します。

**エンドポイント**: `GET /sessions/{sessionId}`

**パスパラメータ**:
- `sessionId`: セッションID

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abcd1234efgh5678",
    "userId": "user123",
    "assessmentType": "mPHQ",
    "dialect": "ise",
    "status": "in_progress",
    "progress": {
      "completedQuestions": 3,
      "totalQuestions": 10,
      "percentComplete": 30
    },
    "createdAt": "2025-03-21T10:15:30Z",
    "lastActivityAt": "2025-03-21T10:20:45Z",
    "expiresAt": "2025-03-21T11:15:30Z",
    "metadata": {
      "referringDoctorId": "D98765",
      "reason": "定期チェック"
    }
  }
}
```

### 4.3 次の質問取得

セッションの次の質問を取得します。

**エンドポイント**: `GET /sessions/{sessionId}/questions`

**パスパラメータ**:
- `sessionId`: セッションID

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "questionId": "q_wxyz9876",
    "text": "最近、何かをするのに気力がわかんかったり、楽しみを感じんかったりすることはあったかな？",
    "responseType": "scale",
    "responseOptions": [
      {"value": 0, "text": "全然ない"},
      {"value": 1, "text": "数日ある"},
      {"value": 2, "text": "半分以上の日がある"},
      {"value": 3, "text": "ほぼ毎日ある"}
    ],
    "order": 4,
    "category": "interest",
    "followUpTrigger": {
      "condition": "value >= 2",
      "followUpQuestionId": "q_followup123"
    }
  }
}
```

### 4.4 回答送信

質問への回答を送信します。

**エンドポイント**: `POST /sessions/{sessionId}/responses`

**パスパラメータ**:
- `sessionId`: セッションID

**リクエスト**:

```json
{
  "questionId": "q_wxyz9876",
  "response": {
    "value": 1,
    "text": "数日ある"
  },
  "metadata": {
    "responseTimeMs": 4500,
    "clientTimestamp": "2025-03-21T10:21:30Z"
  }
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "responseId": "resp_12345",
    "questionId": "q_wxyz9876",
    "accepted": true,
    "nextQuestionAvailable": true,
    "feedback": "そうなんや。他にも気になることがあったら教えてな。"
  }
}
```

### 4.5 評価結果取得

セッションの評価結果を取得します。

**エンドポイント**: `GET /sessions/{sessionId}/results`

**パスパラメータ**:
- `sessionId`: セッションID

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abcd1234efgh5678",
    "userId": "user123",
    "assessmentType": "mPHQ",
    "completedAt": "2025-03-21T10:30:15Z",
    "scores": {
      "total": 8,
      "categories": {
        "interest": 1,
        "mood": 2,
        "sleep": 2,
        "energy": 1,
        "appetite": 0,
        "selfEsteem": 1,
        "concentration": 1,
        "psychomotor": 0,
        "suicidal": 0
      }
    },
    "interpretation": {
      "severity": "mild",
      "riskLevel": "low",
      "recommendations": [
        "定期的な運動を心がける",
        "睡眠の質を改善するための習慣を取り入れる",
        "気分転換になる活動を日常に取り入れる"
      ]
    },
    "followUpRequired": false,
    "summary": "軽度の抑うつ症状が見られますが、日常生活に大きな支障はないと考えられます。生活習慣の改善と定期的なチェックを継続することをお勧めします。"
  }
}
```

### 4.6 セッション終了

進行中のセッションを終了します。

**エンドポイント**: `PUT /sessions/{sessionId}/end`

**パスパラメータ**:
- `sessionId`: セッションID

**リクエスト**:

```json
{
  "reason": "completed",
  "notes": "ユーザーが全ての質問に回答"
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abcd1234efgh5678",
    "status": "completed",
    "endedAt": "2025-03-21T10:30:15Z",
    "duration": "14m 45s",
    "resultsAvailable": true,
    "resultsUrl": "/sessions/sess_abcd1234efgh5678/results"
  }
}
```

### 4.7 評価履歴取得

ユーザーのメンタルヘルス評価履歴を取得します。

**エンドポイント**: `GET /users/{userId}/history`

**パスパラメータ**:
- `userId`: ユーザーID

**クエリパラメータ**:
- `limit` (オプション): 取得する最大セッション数（デフォルト: 10）
- `offset` (オプション): ページネーションオフセット（デフォルト: 0）
- `assessmentType` (オプション): 特定の評価タイプでフィルタリング

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "sessions": [
      {
        "sessionId": "sess_abcd1234efgh5678",
        "assessmentType": "mPHQ",
        "status": "completed",
        "createdAt": "2025-03-21T10:15:30Z",
        "completedAt": "2025-03-21T10:30:15Z",
        "score": {
          "total": 8,
          "severity": "mild"
        }
      },
      {
        "sessionId": "sess_ijkl9012mnop3456",
        "assessmentType": "mPHQ",
        "status": "completed",
        "createdAt": "2025-02-21T14:20:10Z",
        "completedAt": "2025-02-21T14:35:22Z",
        "score": {
          "total": 12,
          "severity": "moderate"
        }
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    },
    "trends": {
      "direction": "improving",
      "percentChange": -33.3,
      "periodMonths": 1
    }
  }
}
```

## 5. ステータスコード

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

## 6. エラーコード

| エラーコード | 説明 |
|------------|------|
| SESSION_CREATION_FAILED | セッションの作成に失敗 |
| SESSION_NOT_FOUND | 指定されたセッションが存在しない |
| SESSION_EXPIRED | セッションの有効期限が切れている |
| SESSION_ALREADY_COMPLETED | セッションは既に完了している |
| QUESTION_NOT_FOUND | 指定された質問が存在しない |
| INVALID_RESPONSE | 無効な回答フォーマット |
| RESULTS_NOT_AVAILABLE | 結果がまだ利用できない |
| USER_NOT_FOUND | 指定されたユーザーが存在しない |
| INVALID_PARAMETERS | リクエストパラメータが無効 |
| AUTHORIZATION_FAILED | 認証に失敗 |
| PERMISSION_DENIED | 操作の権限がない |
| SERVICE_UNAVAILABLE | サービスが一時的に利用できない |

## 7. データモデル

### 7.1 セッション（Session）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| sessionId | string | セッションの一意識別子 |
| userId | string | ユーザーID |
| assessmentType | string | 評価タイプ（mPHQ, SWTPHQ-10等） |
| dialect | string | 使用する方言（ise, standard等） |
| status | string | セッションの状態（started, in_progress, completed, abandoned） |
| createdAt | datetime | 作成日時 |
| lastActivityAt | datetime | 最後のアクティビティ日時 |
| completedAt | datetime | 完了日時 |
| expiresAt | datetime | 有効期限 |
| metadata | object | 追加メタデータ |

### 7.2 質問（Question）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| questionId | string | 質問の一意識別子 |
| text | string | 質問テキスト |
| responseType | string | 回答タイプ（scale, text, boolean等） |
| responseOptions | array | 回答オプション（該当する場合） |
| order | integer | 質問の順序 |
| category | string | 質問カテゴリ |
| followUpTrigger | object | フォローアップ質問のトリガー条件 |

### 7.3 回答（Response）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| responseId | string | 回答の一意識別子 |
| sessionId | string | セッションID |
| questionId | string | 質問ID |
| response | object | 回答データ |
| timestamp | datetime | 回答日時 |
| metadata | object | 追加メタデータ |

### 7.4 結果（Result）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| sessionId | string | セッションID |
| scores | object | スコア詳細 |
| interpretation | object | 結果の解釈 |
| recommendations | array | 推奨事項 |
| followUpRequired | boolean | フォローアップが必要か |
| summary | string | 結果の要約 |
| createdAt | datetime | 結果生成日時 |

## 8. 使用例

### 8.1 評価セッションのフロー

1. セッションを作成する
```bash
curl -X POST http://localhost:40120/api/v1/halca/sessions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "assessmentType": "mPHQ",
    "dialect": "ise"
  }'
```

2. 最初の質問を取得
```bash
curl -X GET http://localhost:40120/api/v1/halca/sessions/sess_abcd1234efgh5678/questions \
  -H "Authorization: Bearer <token>"
```

3. 回答を送信
```bash
curl -X POST http://localhost:40120/api/v1/halca/sessions/sess_abcd1234efgh5678/responses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "q_wxyz9876",
    "response": {
      "value": 1,
      "text": "数日ある"
    }
  }'
```

4. 次の質問を取得（ステップ2と3を繰り返す）

5. セッションを終了
```bash
curl -X PUT http://localhost:40120/api/v1/halca/sessions/sess_abcd1234efgh5678/end \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "completed"
  }'
```

6. 結果を取得
```bash
curl -X GET http://localhost:40120/api/v1/halca/sessions/sess_abcd1234efgh5678/results \
  -H "Authorization: Bearer <token>"
```

## 9. 評価タイプ

HALCAモジュールは、以下の評価タイプをサポートしています：

### 9.1 mPHQ（修正版Patient Health Questionnaire）

標準的なPHQ-9を基に、より自然な会話形式に適応させた評価です。抑うつ症状のスクリーニングに使用されます。

| スコア範囲 | 重症度 | 解釈 |
|----------|-------|------|
| 0-4 | 最小限 | 臨床的に有意な抑うつの可能性は低い |
| 5-9 | 軽度 | 軽度の抑うつ症状 |
| 10-14 | 中等度 | 中等度の抑うつ症状 |
| 15-19 | 中等度から重度 | 臨床的介入が必要な可能性が高い |
| 20-27 | 重度 | 早急な臨床的介入が必要 |

### 9.2 SWTPHQ-10（Social Well-being and Thought Pattern Health Questionnaire）

社会的健康と思考パターンに焦点を当てた10項目の評価です。

| スコア範囲 | 解釈 |
|----------|------|
| 0-10 | 健康的な社会的関係と思考パターン |
| 11-20 | 軽度の社会的孤立と否定的思考 |
| 21-30 | 中等度の社会的問題と思考パターンの歪み |

### 9.3 SWBPHQ-10（Social Well-being and Behavioral Pattern Health Questionnaire）

社会的健康と行動パターンに焦点を当てた10項目の評価です。

| スコア範囲 | 解釈 |
|----------|------|
| 0-10 | 健康的な社会的関係と行動パターン |
| 11-20 | 軽度の社会的孤立と行動の変化 |
| 21-30 | 中等度の社会的問題と行動パターンの問題 |

## 10. 方言サポート

HALCAモジュールは、以下の方言をサポートしています：

| 方言コード | 説明 |
|----------|------|
| ise | 伊勢方言（三重県伊勢地方） |
| standard | 標準日本語 |
| kansai | 関西弁 |
| tohoku | 東北方言 |

伊勢方言の例：
- 標準語: 「最近、何かをするのに興味がわかなかったり、楽しみを感じなかったりすることはありましたか？」
- 伊勢方言: 「最近、何かをするのに気力がわかんかったり、楽しみを感じんかったりすることはあったかな？」

## 11. セキュリティ考慮事項

### 11.1 データ保護

- すべての通信はTLS 1.3で暗号化されます
- 評価データは保存時にAES-256-GCMで暗号化されます
- 個人を特定できる情報は、必要な場合のみ収集され、適切に保護されます

### 11.2 アクセス制御

- ユーザーは自分の評価データのみにアクセスできます
- 医療従事者は、明示的に許可されたユーザーの評価データのみにアクセスできます
- 管理者は監査目的で匿名化されたデータにアクセスできます

### 11.3 コンプライアンス

- 医療情報システムガイドラインに準拠
- 個人情報保護法に準拠
- HIPAA（将来の国際展開用）に準拠予定

## 12. レート制限

| エンドポイント | 制限 | 期間 |
|--------------|------|------|
| 全エンドポイント | 100リクエスト | 1分あたり |
| /sessions (POST) | 5リクエスト | 1分あたり |
| /sessions/{sessionId}/responses (POST) | 30リクエスト | 1分あたり |

レート制限を超えた場合、429ステータスコードが返されます。

## 13. バージョニング

HALCA APIは、セマンティックバージョニングに従います。現在のバージョンはv1です。

将来のバージョンでは、以下の変更が予定されています：
- v1.1: 追加の評価タイプのサポート
- v1.2: より多様な方言のサポート
- v2.0: 音声入力と自然言語理解の強化

最終更新日: 2025-03-22
