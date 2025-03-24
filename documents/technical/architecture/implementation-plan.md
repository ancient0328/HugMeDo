# HugMeDo 実装計画書
Version: 1.0.0
Last Updated: 2025/03/23

## 1. 概要

本文書は、HugMeDoプロジェクトのユーザーロール管理とセキュリティ実装に関する詳細な計画を記述するものである。Svelte 5とSvelteKit 2を活用し、コンテナ化されたモジュラーモノリス構造に基づいて実装を進める。

## 2. 技術スタック

### 2.1 フロントエンド
- **フレームワーク**: Svelte 5 + SvelteKit 2
- **状態管理**: Svelte Runesによるリアクティブな状態管理
- **UI/UXデザイン**: Instagram型ストーリーバーナビゲーション
- **認証**: Amazon Cognito + JWT

### 2.2 バックエンド
- **API**: RESTful API + GraphQL（必要に応じて）
- **リアルタイム通信**: Socket.IO
- **ビデオ通話**: Amazon Chime SDK

### 2.3 インフラストラクチャ
- **コンテナ化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **デプロイ**: AWS（ECS, ECR, S3, CloudFront）

## 3. 実装フェーズ

### フェーズ1: 基盤構築（v0.0.0）
1. **プロジェクト構造の確立**
   - pnpmワークスペースの設定
   - Docker環境の構築
   - 基本的なSvelteKit 2プロジェクトの設定

2. **認証基盤の実装**
   - Amazon Cognitoの設定
   - JWTによる認証フローの実装
   - ユーザーロールの基本構造実装

### フェーズ2: コアモジュール実装（v0.1.0）
1. **ユーザーロール管理システムの実装**
   - ECECスタッフ（ecec_staff）
   - ECEC管理者（ecec_admin）
   - 医療スタッフ（medical_staff）
   - システム管理者（system_admin）

2. **ダッシュボードの基本実装**
   - OHRステータス表示
   - モジュールナビゲーション（ストーリーバー）
   - ロールベースの表示制御

3. **OHRモジュールの基本機能**
   - ビデオ通話基盤（Amazon Chime SDK）
   - 混雑度表示機能

4. **チャットモジュールの基本機能**
   - リアルタイムチャット（Socket.IO）
   - メッセージ履歴管理

### フェーズ3: 機能拡張（v0.2.0）
1. **権限管理の詳細実装**
   - 細粒度のアクセス制御
   - データアクセス権限の実装

2. **緊急相談機能の実装**
   - 緊急相談ボタン（ECECスタッフ/管理者用）
   - 優先度管理システム

3. **セキュリティ強化**
   - データ暗号化の実装
   - セキュリティ監査ログの実装

### フェーズ4: 統合と安定化（v0.3.0）
1. **モジュール間連携の強化**
   - OHRとチャットの連携
   - ユーザーデータの統合管理

2. **パフォーマンス最適化**
   - フロントエンドの最適化
   - バックエンドの効率化

3. **テスト強化**
   - 単体テスト
   - 統合テスト
   - E2Eテスト

### フェーズ5: 本番リリース準備（v1.0.0）
1. **AWSデプロイ準備**
   - インフラ構成の最終調整
   - スケーリング設定

2. **ドキュメント整備**
   - 開発者ドキュメント
   - 運用ドキュメント
   - ユーザーマニュアル

3. **最終セキュリティレビュー**
   - 脆弱性スキャン
   - 侵入テスト

## 4. ユーザーロール実装詳細

### 4.1 データモデル

```typescript
// packages/core/src/types/auth/roles.ts
export interface UserRole {
  id: string;         // ロールID
  name: string;       // 表示名
  level: RoleLevel;   // 権限レベル
  description: string; // 説明
}

export type RoleLevel = 'SYSTEM' | 'FACILITY' | 'OPERATIONAL' | 'LIMITED';

export const userRoles: Record<string, UserRole> = {
  ecec_staff: {
    id: 'ecec_staff',
    name: 'ECEC施設スタッフ',
    level: 'OPERATIONAL',
    description: '保育園・幼稚園・認定こども園で日常的に園児のケアを行うスタッフ'
  },
  ecec_admin: {
    id: 'ecec_admin',
    name: 'ECEC施設管理者',
    level: 'FACILITY',
    description: '保育園・幼稚園・認定こども園の運営管理を行う管理者'
  },
  medical_staff: {
    id: 'medical_staff',
    name: '医師/医療従事者',
    level: 'OPERATIONAL',
    description: 'OHRで医療サポートを提供する医師や看護師'
  },
  system_admin: {
    id: 'system_admin',
    name: 'システム管理者',
    level: 'SYSTEM',
    description: 'システム全体の管理や設定を行う管理者'
  }
};

// packages/core/src/types/auth/permissions.ts
export interface RolePermissions {
  [roleId: string]: {
    canAccessDashboard: boolean;
    canAccessOHR: boolean;
    canManageOHR: boolean;
    canAccessChat: boolean;
    canUseEmergencyConsultation: boolean;
    canManageChildren: boolean | 'assigned';
    canManageStaff: boolean;
    canManageSettings: boolean;
    canManageSystem: boolean;
    canManageUsers: boolean | 'facility';
    canViewAuditLogs: boolean | 'facility';
  }
}

export const rolePermissions: RolePermissions = {
  ecec_staff: {
    canAccessDashboard: true,
    canAccessOHR: true,
    canManageOHR: false,
    canAccessChat: true,
    canUseEmergencyConsultation: true,
    canManageChildren: 'assigned',
    canManageStaff: false,
    canManageSettings: false,
    canManageSystem: false,
    canManageUsers: false,
    canViewAuditLogs: false
  },
  ecec_admin: {
    canAccessDashboard: true,
    canAccessOHR: true,
    canManageOHR: false,
    canAccessChat: true,
    canUseEmergencyConsultation: true,
    canManageChildren: true,
    canManageStaff: true,
    canManageSettings: true,
    canManageSystem: false,
    canManageUsers: 'facility',
    canViewAuditLogs: 'facility'
  },
  medical_staff: {
    canAccessDashboard: true,
    canAccessOHR: true,
    canManageOHR: true,
    canAccessChat: true,
    canUseEmergencyConsultation: false,
    canManageChildren: 'medical',
    canManageStaff: false,
    canManageSettings: false,
    canManageSystem: false,
    canManageUsers: false,
    canViewAuditLogs: false
  },
  system_admin: {
    canAccessDashboard: true,
    canAccessOHR: true,
    canManageOHR: true,
    canAccessChat: true,
    canUseEmergencyConsultation: true,
    canManageChildren: true,
    canManageStaff: true,
    canManageSettings: true,
    canManageSystem: true,
    canManageUsers: true,
    canViewAuditLogs: true
  }
};
```

### 4.2 認証・認可の実装

```typescript
// packages/core/src/services/auth.ts
import { userRoles, rolePermissions } from '../types/auth';

export function hasPermission(
  user: { role?: string }, 
  permission: keyof RolePermissions[string]
): boolean {
  if (!user?.role) return false;
  
  const userRole = user.role;
  const permissions = rolePermissions[userRole];
  
  if (!permissions) return false;
  
  return !!permissions[permission];
}

export function canManageResource(
  user: { role?: string; id?: string }, 
  resource: { ownerId?: string; facilityId?: string },
  permissionType: 'canManageChildren' | 'canManageUsers'
): boolean {
  if (!user?.role) return false;
  
  const permission = rolePermissions[user.role][permissionType];
  
  // システム管理者は全てのリソースを管理可能
  if (permission === true) return true;
  
  // 施設内のリソースのみ管理可能
  if (permission === 'facility') {
    return resource.facilityId === user.facilityId;
  }
  
  // 担当リソースのみ管理可能
  if (permission === 'assigned') {
    return resource.ownerId === user.id;
  }
  
  return false;
}
```

### 4.3 SvelteKit 2での実装

```typescript
// apps/web/src/hooks.server.ts
import { hasPermission } from '@hugmedo/core/services/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // JWTトークンからユーザー情報を取得
  const token = event.cookies.get('auth_token');
  if (token) {
    try {
      const decoded = verifyToken(token);
      event.locals.user = {
        id: decoded.sub,
        name: decoded.name,
        role: decoded.role,
        authenticated: true
      };
    } catch (error) {
      // トークンが無効な場合はクッキーを削除
      event.cookies.delete('auth_token', { path: '/' });
    }
  }

  // ルートへのアクセス権限チェック
  const requiredPermission = getRequiredPermissionForRoute(event.url.pathname);
  if (requiredPermission && !hasPermission(event.locals.user, requiredPermission)) {
    // 権限がない場合はリダイレクトまたはエラーレスポンス
    if (!event.locals.user?.authenticated) {
      return Response.redirect(`${event.url.origin}/login`, 302);
    } else {
      return new Response('権限がありません', { status: 403 });
    }
  }

  return resolve(event);
};

function getRequiredPermissionForRoute(pathname: string): keyof RolePermissions[string] | null {
  if (pathname.startsWith('/dashboard')) return 'canAccessDashboard';
  if (pathname.startsWith('/ohr')) return 'canAccessOHR';
  if (pathname.startsWith('/chat')) return 'canAccessChat';
  if (pathname.startsWith('/admin')) return 'canManageSystem';
  return null;
}
```

```svelte
<!-- apps/web/src/routes/dashboard/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { hasPermission } from '@hugmedo/core/services/auth';
  import OHRStatus from '$lib/components/OHRStatus.svelte';
  import StoryBar from '$lib/components/StoryBar.svelte';
  import EmergencyButton from '$lib/components/EmergencyButton.svelte';
  
  $: user = $page.data.user;
  $: showEmergencyButton = hasPermission(user, 'canUseEmergencyConsultation');
</script>

<div class="dashboard">
  <OHRStatus />
  
  <StoryBar />
  
  {#if showEmergencyButton}
    <EmergencyButton />
  {/if}
</div>
```

## 5. セキュリティ実装詳細

### 5.1 データ暗号化

```typescript
// packages/core/src/services/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// AES-256-GCM暗号化
export function encrypt(text: string, key: Buffer): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // iv + authTag + encrypted を結合して返す
  return iv.toString('hex') + authTag + encrypted;
}

// AES-256-GCM復号化
export function decrypt(encryptedText: string, key: Buffer): string {
  const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
  const authTag = Buffer.from(encryptedText.slice(32, 64), 'hex');
  const encrypted = encryptedText.slice(64);
  
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 5.2 セキュリティログ

```typescript
// packages/core/src/services/audit.ts
export enum AuditEventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ACCESS_DENIED = 'ACCESS_DENIED',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION'
}

export interface AuditEvent {
  type: AuditEventType;
  userId: string;
  userRole: string;
  timestamp: Date;
  resourceId?: string;
  resourceType?: string;
  action?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export async function logAuditEvent(event: Omit<AuditEvent, 'timestamp'>): Promise<void> {
  const auditEvent: AuditEvent = {
    ...event,
    timestamp: new Date()
  };
  
  // データベースに保存
  await saveAuditEvent(auditEvent);
  
  // 重要なイベントはリアルタイム通知
  if (isHighSeverityEvent(auditEvent)) {
    await notifySecurityTeam(auditEvent);
  }
}
```

### 5.3 WebSocketセキュリティ

```typescript
// modules/chat/src/server/socket.ts
import { Server } from 'socket.io';
import { verifyToken } from '@hugmedo/core/services/auth';
import { logAuditEvent, AuditEventType } from '@hugmedo/core/services/audit';

export function setupSocketServer(server) {
  const io = new Server(server);
  
  // 認証ミドルウェア
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('認証が必要です'));
    }
    
    try {
      const user = verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('無効なトークンです'));
    }
  });
  
  // 接続イベント
  io.on('connection', (socket) => {
    const user = socket.data.user;
    
    // 監査ログ
    logAuditEvent({
      type: AuditEventType.LOGIN,
      userId: user.id,
      userRole: user.role,
      action: 'SOCKET_CONNECTION',
      ip: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent']
    });
    
    // ルームへの参加
    socket.on('join-room', (roomId) => {
      // 権限チェック
      if (!canJoinRoom(user, roomId)) {
        socket.emit('error', { message: 'このルームに参加する権限がありません' });
        return;
      }
      
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { userId: user.id, name: user.name });
    });
    
    // メッセージ送信
    socket.on('send-message', (data) => {
      // 権限チェック
      if (!canSendMessage(user, data.roomId)) {
        socket.emit('error', { message: 'メッセージを送信する権限がありません' });
        return;
      }
      
      // メッセージを保存
      saveMessage({
        roomId: data.roomId,
        userId: user.id,
        content: data.content,
        timestamp: new Date()
      });
      
      // ルームにブロードキャスト
      io.to(data.roomId).emit('new-message', {
        id: generateId(),
        roomId: data.roomId,
        userId: user.id,
        userName: user.name,
        content: data.content,
        timestamp: new Date()
      });
    });
  });
  
  return io;
}
```

## 6. 実装スケジュール

| フェーズ | タスク | 担当 | 期間 | 完了予定日 |
|---------|-------|------|------|-----------|
| 1 | プロジェクト構造の確立 | 開発チーム | 2週間 | 2025/04/06 |
| 1 | 認証基盤の実装 | 開発チーム | 3週間 | 2025/04/27 |
| 2 | ユーザーロール管理システムの実装 | 開発チーム | 2週間 | 2025/05/11 |
| 2 | ダッシュボードの基本実装 | 開発チーム | 3週間 | 2025/06/01 |
| 2 | OHRモジュールの基本機能 | 開発チーム | 4週間 | 2025/06/29 |
| 2 | チャットモジュールの基本機能 | 開発チーム | 3週間 | 2025/07/20 |
| 3 | 権限管理の詳細実装 | 開発チーム | 2週間 | 2025/08/03 |
| 3 | 緊急相談機能の実装 | 開発チーム | 2週間 | 2025/08/17 |
| 3 | セキュリティ強化 | 開発チーム | 3週間 | 2025/09/07 |
| 4 | モジュール間連携の強化 | 開発チーム | 3週間 | 2025/09/28 |
| 4 | パフォーマンス最適化 | 開発チーム | 2週間 | 2025/10/12 |
| 4 | テスト強化 | 開発チーム | 3週間 | 2025/11/02 |
| 5 | AWSデプロイ準備 | 開発チーム | 3週間 | 2025/11/23 |
| 5 | ドキュメント整備 | 開発チーム | 2週間 | 2025/12/07 |
| 5 | 最終セキュリティレビュー | 開発チーム | 2週間 | 2025/12/21 |

## 7. 開発環境構築手順

### 7.1 初期セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-org/hugmedo.git
cd hugmedo

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
# .env.localを編集して必要な環境変数を設定

# 開発サーバーの起動
pnpm --filter @hugmedo/web dev
```

### 7.2 Docker環境

```bash
# Dockerコンテナのビルドと起動
docker-compose up -d

# ログの確認
docker-compose logs -f
```

## 8. 参考資料

1. [Svelte 5公式ドキュメント](https://svelte.dev/docs)
2. [SvelteKit 2公式ドキュメント](https://kit.svelte.dev/docs)
3. [Amazon Cognito開発者ガイド](https://docs.aws.amazon.com/cognito/latest/developerguide/)
4. [Socket.IOドキュメント](https://socket.io/docs/)
5. [Amazon Chime SDK開発者ガイド](https://docs.aws.amazon.com/chime-sdk/latest/dg/)

## 9. 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|------------|----------|--------|
| 2025/03/23 | 1.0.0 | 初版作成 | HugMeDo開発チーム |
