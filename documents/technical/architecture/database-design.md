# データベース設計書

## 文書情報

| 項目 | 内容 |
|------|------|
| 文書番号 | ARCH-002 |
| 作成日 | 2025-03-21 |
| 作成者 | HugMeDoチーム |
| ステータス | ドラフト |
| 関連文書 | ARCH-001（アーキテクチャ概要）, API-001（API概要） |

## 1. 概要

本文書は、HugMeDoプラットフォームのデータベース設計を定義します。コンテナ化モジュラーモノリスアーキテクチャに基づき、コアデータベースと各モジュール（OHR、HALCA）のデータモデルを説明します。

## 2. データベース構成

### 2.1 物理構成

HugMeDoプラットフォームは、以下のデータベースを使用します：

| データベース | 種類 | 用途 | 環境 |
|------------|------|------|------|
| hugmedo_core | PostgreSQL | コアデータ（ユーザー、認証等） | 本番/開発 |
| hugmedo_ohr | PostgreSQL | OHRモジュールデータ（ビデオ通話） | 本番/開発 |
| hugmedo_halca | PostgreSQL | HALCAモジュールデータ（メンタルヘルス） | 本番/開発 |
| hugmedo_cache | Redis | キャッシュデータ | 本番/開発 |

### 2.2 論理構成

データモデルは以下の主要なドメインに分かれています：

1. **コアドメイン**：ユーザー管理、認証、権限
2. **OHRドメイン**：ビデオ通話、会議、参加者
3. **HALCAドメイン**：メンタルヘルス評価、質問、回答
4. **共通ドメイン**：監査ログ、設定、通知

## 3. コアデータモデル

### 3.1 ユーザーモデル

#### users

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | ユーザーID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| cognito_id | VARCHAR(255) | UNIQUE | Amazon Cognito ID |
| first_name | VARCHAR(100) | NOT NULL | 名 |
| last_name | VARCHAR(100) | NOT NULL | 姓 |
| role | VARCHAR(50) | NOT NULL | 役割（patient, doctor, admin） |
| status | VARCHAR(50) | NOT NULL | ステータス（active, inactive, suspended） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |
| last_login_at | TIMESTAMP | | 最終ログイン日時 |
| metadata | JSONB | | 追加メタデータ |

#### user_profiles

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | プロファイルID |
| user_id | UUID | FK(users.id), NOT NULL | ユーザーID |
| phone_number | VARCHAR(20) | | 電話番号 |
| date_of_birth | DATE | | 生年月日 |
| gender | VARCHAR(50) | | 性別 |
| address | JSONB | | 住所情報 |
| profile_image_url | VARCHAR(255) | | プロフィール画像URL |
| medical_history | JSONB | | 医療履歴（患者のみ） |
| specialties | VARCHAR[] | | 専門分野（医師のみ） |
| license_number | VARCHAR(100) | | 免許番号（医師のみ） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

#### user_settings

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 設定ID |
| user_id | UUID | FK(users.id), NOT NULL | ユーザーID |
| notification_preferences | JSONB | NOT NULL | 通知設定 |
| language | VARCHAR(10) | NOT NULL | 言語設定 |
| theme | VARCHAR(50) | | テーマ設定 |
| timezone | VARCHAR(50) | NOT NULL | タイムゾーン |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

### 3.2 認証モデル

#### refresh_tokens

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | トークンID |
| user_id | UUID | FK(users.id), NOT NULL | ユーザーID |
| token | VARCHAR(255) | UNIQUE, NOT NULL | リフレッシュトークン |
| expires_at | TIMESTAMP | NOT NULL | 有効期限 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| revoked | BOOLEAN | NOT NULL | 無効化フラグ |
| revoked_at | TIMESTAMP | | 無効化日時 |
| ip_address | VARCHAR(45) | | 発行元IPアドレス |
| user_agent | TEXT | | 発行元ユーザーエージェント |

#### password_reset_tokens

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | トークンID |
| user_id | UUID | FK(users.id), NOT NULL | ユーザーID |
| token | VARCHAR(255) | UNIQUE, NOT NULL | リセットトークン |
| expires_at | TIMESTAMP | NOT NULL | 有効期限 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| used | BOOLEAN | NOT NULL | 使用済みフラグ |
| used_at | TIMESTAMP | | 使用日時 |
| ip_address | VARCHAR(45) | | 発行元IPアドレス |

### 3.3 権限モデル

#### roles

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 役割ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | 役割名 |
| description | TEXT | | 説明 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

#### permissions

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 権限ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | 権限名 |
| description | TEXT | | 説明 |
| resource | VARCHAR(100) | NOT NULL | リソース名 |
| action | VARCHAR(100) | NOT NULL | アクション名 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

#### role_permissions

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 関連ID |
| role_id | UUID | FK(roles.id), NOT NULL | 役割ID |
| permission_id | UUID | FK(permissions.id), NOT NULL | 権限ID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

## 4. OHRデータモデル

### 4.1 会議モデル

#### meetings

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 会議ID |
| external_meeting_id | VARCHAR(255) | UNIQUE, NOT NULL | 外部会議ID |
| title | VARCHAR(255) | NOT NULL | 会議タイトル |
| status | VARCHAR(50) | NOT NULL | ステータス（created, started, ended） |
| media_region | VARCHAR(50) | NOT NULL | メディアリージョン |
| meeting_arn | VARCHAR(255) | | AWS Chime会議ARN |
| scheduled_start_time | TIMESTAMP | NOT NULL | 予定開始時間 |
| scheduled_end_time | TIMESTAMP | NOT NULL | 予定終了時間 |
| actual_start_time | TIMESTAMP | | 実際の開始時間 |
| actual_end_time | TIMESTAMP | | 実際の終了時間 |
| created_by | UUID | FK(users.id), NOT NULL | 作成者ID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |
| metadata | JSONB | | 追加メタデータ |

#### attendees

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 参加者ID |
| meeting_id | UUID | FK(meetings.id), NOT NULL | 会議ID |
| user_id | UUID | FK(users.id), NOT NULL | ユーザーID |
| external_user_id | VARCHAR(255) | NOT NULL | 外部ユーザーID |
| display_name | VARCHAR(255) | NOT NULL | 表示名 |
| role | VARCHAR(50) | NOT NULL | 役割（doctor, patient, etc） |
| join_token | VARCHAR(255) | UNIQUE, NOT NULL | 参加トークン |
| join_status | VARCHAR(50) | NOT NULL | 参加状態（pending, joined, left） |
| joined_at | TIMESTAMP | | 参加日時 |
| left_at | TIMESTAMP | | 退出日時 |
| last_active_at | TIMESTAMP | | 最後のアクティブ時間 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |
| metadata | JSONB | | 追加メタデータ |

#### meeting_events

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | イベントID |
| meeting_id | UUID | FK(meetings.id), NOT NULL | 会議ID |
| attendee_id | UUID | FK(attendees.id) | 参加者ID |
| event_type | VARCHAR(100) | NOT NULL | イベントタイプ |
| event_data | JSONB | NOT NULL | イベントデータ |
| timestamp | TIMESTAMP | NOT NULL | タイムスタンプ |

### 4.2 チャットモデル

#### chat_messages

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | メッセージID |
| meeting_id | UUID | FK(meetings.id), NOT NULL | 会議ID |
| sender_id | UUID | FK(attendees.id), NOT NULL | 送信者ID |
| content | TEXT | NOT NULL | メッセージ内容 |
| content_type | VARCHAR(50) | NOT NULL | コンテンツタイプ（text, file, etc） |
| sent_at | TIMESTAMP | NOT NULL | 送信日時 |
| read_by | UUID[] | | 既読者ID |
| metadata | JSONB | | 追加メタデータ |

## 5. HALCAデータモデル

### 5.1 評価セッションモデル

#### assessment_sessions

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | セッションID |
| user_id | UUID | FK(users.id), NOT NULL | ユーザーID |
| assessment_type | VARCHAR(50) | NOT NULL | 評価タイプ（mPHQ, SWTPHQ-10等） |
| dialect | VARCHAR(50) | NOT NULL | 方言（ise, standard等） |
| status | VARCHAR(50) | NOT NULL | ステータス（started, in_progress, completed, abandoned） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| last_activity_at | TIMESTAMP | NOT NULL | 最後のアクティビティ日時 |
| completed_at | TIMESTAMP | | 完了日時 |
| expires_at | TIMESTAMP | NOT NULL | 有効期限 |
| created_by | UUID | FK(users.id) | 作成者ID（医師等） |
| metadata | JSONB | | 追加メタデータ |

#### assessment_questions

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 質問ID |
| assessment_type | VARCHAR(50) | NOT NULL | 評価タイプ |
| text | TEXT | NOT NULL | 質問テキスト |
| dialect_texts | JSONB | | 方言別テキスト |
| response_type | VARCHAR(50) | NOT NULL | 回答タイプ（scale, text, boolean等） |
| response_options | JSONB | | 回答オプション |
| order | INTEGER | NOT NULL | 質問の順序 |
| category | VARCHAR(100) | NOT NULL | 質問カテゴリ |
| follow_up_trigger | JSONB | | フォローアップ質問のトリガー条件 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |
| active | BOOLEAN | NOT NULL | アクティブフラグ |

#### assessment_responses

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 回答ID |
| session_id | UUID | FK(assessment_sessions.id), NOT NULL | セッションID |
| question_id | UUID | FK(assessment_questions.id), NOT NULL | 質問ID |
| response_data | JSONB | NOT NULL | 回答データ |
| response_time_ms | INTEGER | | 回答時間（ミリ秒） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| metadata | JSONB | | 追加メタデータ |

#### assessment_results

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 結果ID |
| session_id | UUID | FK(assessment_sessions.id), UNIQUE, NOT NULL | セッションID |
| scores | JSONB | NOT NULL | スコア詳細 |
| interpretation | JSONB | NOT NULL | 結果の解釈 |
| recommendations | JSONB | | 推奨事項 |
| follow_up_required | BOOLEAN | NOT NULL | フォローアップが必要か |
| summary | TEXT | | 結果の要約 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |
| reviewed_by | UUID | FK(users.id) | レビュー者ID（医師） |
| reviewed_at | TIMESTAMP | | レビュー日時 |

## 6. 共通データモデル

### 6.1 予約モデル

#### appointments

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 予約ID |
| patient_id | UUID | FK(users.id), NOT NULL | 患者ID |
| doctor_id | UUID | FK(users.id), NOT NULL | 医師ID |
| title | VARCHAR(255) | NOT NULL | 予約タイトル |
| description | TEXT | | 説明 |
| start_time | TIMESTAMP | NOT NULL | 開始時間 |
| end_time | TIMESTAMP | NOT NULL | 終了時間 |
| status | VARCHAR(50) | NOT NULL | ステータス（scheduled, confirmed, cancelled, completed） |
| appointment_type | VARCHAR(100) | NOT NULL | 予約タイプ（initial, follow_up, etc） |
| meeting_id | UUID | FK(meetings.id) | 関連会議ID |
| assessment_session_id | UUID | FK(assessment_sessions.id) | 関連評価セッションID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |
| cancelled_by | UUID | FK(users.id) | キャンセル者ID |
| cancellation_reason | TEXT | | キャンセル理由 |
| metadata | JSONB | | 追加メタデータ |

### 6.2 通知モデル

#### notifications

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | 通知ID |
| user_id | UUID | FK(users.id), NOT NULL | ユーザーID |
| type | VARCHAR(100) | NOT NULL | 通知タイプ |
| title | VARCHAR(255) | NOT NULL | タイトル |
| content | TEXT | NOT NULL | 内容 |
| read | BOOLEAN | NOT NULL | 既読フラグ |
| read_at | TIMESTAMP | | 既読日時 |
| data | JSONB | | 追加データ |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| expires_at | TIMESTAMP | | 有効期限 |

### 6.3 監査ログモデル

#### audit_logs

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PK | ログID |
| user_id | UUID | FK(users.id) | ユーザーID |
| action | VARCHAR(100) | NOT NULL | アクション |
| resource_type | VARCHAR(100) | NOT NULL | リソースタイプ |
| resource_id | UUID | | リソースID |
| description | TEXT | | 説明 |
| ip_address | VARCHAR(45) | | IPアドレス |
| user_agent | TEXT | | ユーザーエージェント |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| metadata | JSONB | | 追加メタデータ |

## 7. インデックス設計

### 7.1 コアデータベースインデックス

| テーブル | インデックス名 | カラム | タイプ | 説明 |
|---------|--------------|-------|-------|------|
| users | users_email_idx | email | BTREE | メールアドレス検索用 |
| users | users_cognito_id_idx | cognito_id | BTREE | Cognito ID検索用 |
| users | users_role_status_idx | role, status | BTREE | 役割とステータスでのフィルタリング用 |
| user_profiles | user_profiles_user_id_idx | user_id | BTREE | ユーザーIDでの検索用 |
| refresh_tokens | refresh_tokens_token_idx | token | BTREE | トークン検索用 |
| refresh_tokens | refresh_tokens_user_id_idx | user_id | BTREE | ユーザーIDでの検索用 |

### 7.2 OHRデータベースインデックス

| テーブル | インデックス名 | カラム | タイプ | 説明 |
|---------|--------------|-------|-------|------|
| meetings | meetings_external_meeting_id_idx | external_meeting_id | BTREE | 外部会議ID検索用 |
| meetings | meetings_status_idx | status | BTREE | ステータスでのフィルタリング用 |
| meetings | meetings_scheduled_start_time_idx | scheduled_start_time | BTREE | 開始時間での検索用 |
| meetings | meetings_created_by_idx | created_by | BTREE | 作成者での検索用 |
| attendees | attendees_meeting_id_idx | meeting_id | BTREE | 会議IDでの検索用 |
| attendees | attendees_user_id_idx | user_id | BTREE | ユーザーIDでの検索用 |
| attendees | attendees_join_token_idx | join_token | BTREE | 参加トークン検索用 |

### 7.3 HALCAデータベースインデックス

| テーブル | インデックス名 | カラム | タイプ | 説明 |
|---------|--------------|-------|-------|------|
| assessment_sessions | assessment_sessions_user_id_idx | user_id | BTREE | ユーザーIDでの検索用 |
| assessment_sessions | assessment_sessions_status_idx | status | BTREE | ステータスでのフィルタリング用 |
| assessment_sessions | assessment_sessions_assessment_type_idx | assessment_type | BTREE | 評価タイプでのフィルタリング用 |
| assessment_responses | assessment_responses_session_id_idx | session_id | BTREE | セッションIDでの検索用 |
| assessment_results | assessment_results_session_id_idx | session_id | BTREE | セッションIDでの検索用 |

## 8. リレーションシップ図

```
+---------------+       +------------------+       +----------------+
|    users      |------>| user_profiles    |       | refresh_tokens |
+---------------+       +------------------+       +----------------+
       |                                                  ^
       |                                                  |
       v                                                  |
+---------------+       +------------------+              |
| user_settings |       | password_reset_  |<-------------+
+---------------+       | tokens           |
                        +------------------+

+---------------+       +------------------+       +----------------+
|   meetings    |------>|    attendees     |------>| meeting_events |
+---------------+       +------------------+       +----------------+
       |                        |
       |                        |
       v                        v
+---------------+       +------------------+
| appointments  |       |  chat_messages   |
+---------------+       +------------------+

+---------------+       +------------------+       +----------------+
| assessment_   |------>| assessment_      |       | assessment_    |
| sessions      |       | responses        |       | questions      |
+---------------+       +------------------+       +----------------+
       |                                                  ^
       |                                                  |
       v                                                  |
+---------------+                                         |
| assessment_   |<----------------------------------------+
| results       |
+---------------+

+---------------+       +------------------+
| notifications |       |   audit_logs     |
+---------------+       +------------------+
```

## 9. マイグレーション戦略

### 9.1 マイグレーションツール

データベースマイグレーションには、[Prisma](https://www.prisma.io/)を使用します。

### 9.2 マイグレーションプロセス

1. 開発環境でのマイグレーション作成
   ```bash
   pnpm prisma migrate dev --name <migration_name>
   ```

2. マイグレーションの検証
   ```bash
   pnpm prisma migrate dev
   ```

3. 本番環境へのマイグレーション適用
   ```bash
   pnpm prisma migrate deploy
   ```

### 9.3 バックアップ戦略

- 日次自動バックアップ
- マイグレーション前の手動バックアップ
- ポイントインタイムリカバリ（PITR）の有効化

## 10. パフォーマンス最適化

### 10.1 クエリ最適化

- 頻繁に使用されるクエリのインデックス作成
- 大きなテーブルのパーティショニング（audit_logs, notifications）
- 複雑なクエリの事前計算とマテリアライズドビューの使用

### 10.2 接続プーリング

- PgBouncer を使用した接続プーリング
- 適切なプール設定（min_pool_size, max_pool_size）

### 10.3 キャッシング戦略

- Redis を使用した頻繁にアクセスされるデータのキャッシング
- キャッシュの有効期限と無効化戦略

## 11. セキュリティ考慮事項

### 11.1 データ暗号化

- 保存データの暗号化（医療情報、個人情報）
- 転送中のデータの暗号化（TLS 1.3）

### 11.2 アクセス制御

- 最小権限の原則に基づくデータベースユーザー権限
- 行レベルセキュリティ（RLS）の実装

### 11.3 監査とコンプライアンス

- すべてのデータアクセスの監査ログ記録
- 医療情報システムガイドラインへの準拠
- 個人情報保護法への準拠

## 12. 将来の拡張性

### 12.1 水平スケーリング

- 読み取り負荷の高いワークロード用のリードレプリカ
- シャーディング戦略の検討

### 12.2 データアーカイブ

- 古いデータのアーカイブ戦略
- コールドストレージへの移行計画

### 12.3 新しいモジュールの統合

- 新モジュール追加時のデータベース拡張計画
- 既存スキーマとの互換性維持

---

*このデータベース設計書は、HugMeDoプロジェクトのデータモデルとリレーションシップを定義するものです。実装の詳細は変更される可能性があります。*

最終更新: 2025-03-21
