# HugMeDo ユーザーロールと権限定義
Version: 1.0.0
Last Updated: 2025/03/23

## 1. 概要

本文書は、HugMeDoプラットフォームにおけるユーザーロールと権限の定義を記述するものである。
ユーザーロールは、システム内でのアクセス制御と機能制限の基盤となる。

## 2. ユーザーロール定義

HugMeDoプラットフォームでは、以下の4つの主要ユーザーロールを定義する。

### 2.1 ECEC施設スタッフ（ecec_staff）

**日本語名称**: ECEC施設スタッフ  
**英語表記**: `ecec_staff`  
**権限レベル**: `OPERATIONAL`  
**説明**: 保育園・幼稚園・認定こども園で日常的に園児のケアを行うスタッフ

#### 主な権限
- ダッシュボードへのアクセス
- OHRモジュールの利用
- チャットモジュールの利用
- 緊急相談機能の利用
- 担当する園児の情報管理

### 2.2 ECEC施設管理者（ecec_admin）

**日本語名称**: ECEC施設管理者  
**英語表記**: `ecec_admin`  
**権限レベル**: `FACILITY`  
**説明**: 保育園・幼稚園・認定こども園の運営管理を行う管理者（園長など）

#### 主な権限
- ダッシュボードへのアクセス
- OHRモジュールの利用
- チャットモジュールの利用
- 緊急相談機能の利用
- 施設内のすべての園児の情報管理
- 施設内のスタッフ管理
- 施設の設定管理

### 2.3 医師/医療従事者（medical_staff）

**日本語名称**: 医師/医療従事者  
**英語表記**: `medical_staff`  
**権限レベル**: `OPERATIONAL`  
**説明**: OHR（オンライン医務室）で医療サポートを提供する医師や看護師

#### 主な権限
- ダッシュボードへのアクセス
- OHRモジュールの管理・対応
- チャットモジュールの利用
- 患者（園児）の医療情報へのアクセス
- 医療相談への対応
- 診療記録の作成・管理

### 2.4 システム管理者（system_admin）

**日本語名称**: システム管理者  
**英語表記**: `system_admin`  
**権限レベル**: `SYSTEM`  
**説明**: システム全体の管理や設定を行う管理者

#### 主な権限
- すべてのモジュールへの完全アクセス
- ユーザー管理（作成・編集・削除）
- ロール管理
- システム設定の管理
- 監査ログの閲覧
- バックアップと復元の管理

## 3. 権限マトリックス

以下の表は、各ユーザーロールが持つ主要な権限を示す。

| 権限 | ecec_staff | ecec_admin | medical_staff | system_admin |
|------|------------|------------|---------------|--------------|
| ダッシュボードアクセス | ✓ | ✓ | ✓ | ✓ |
| OHRモジュール利用 | ✓ | ✓ | ✓ | ✓ |
| OHR管理機能 | ✗ | ✗ | ✓ | ✓ |
| チャットモジュール利用 | ✓ | ✓ | ✓ | ✓ |
| 緊急相談機能 | ✓ | ✓ | ✗ | ✓ |
| 園児情報管理 | 担当のみ | 全て | 医療情報のみ | ✓ |
| スタッフ管理 | ✗ | ✓ | ✗ | ✓ |
| 施設設定管理 | ✗ | ✓ | ✗ | ✓ |
| システム設定管理 | ✗ | ✗ | ✗ | ✓ |
| ユーザー管理 | ✗ | 施設内のみ | ✗ | ✓ |
| 監査ログ閲覧 | ✗ | 施設内のみ | ✗ | ✓ |

## 4. 実装ガイドライン

### 4.1 コード実装

ユーザーロールと権限は、以下のTypeScriptインターフェースに基づいて実装する。

```typescript
export interface UserRole {
  id: string;         // ロールID（例: 'ecec_staff'）
  name: string;       // 表示名（例: 'ECEC施設スタッフ'）
  level: RoleLevel;   // 権限レベル
  description: string; // 説明
}

export type RoleLevel = 'SYSTEM' | 'FACILITY' | 'OPERATIONAL' | 'LIMITED';

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

// 実装例
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

### 4.2 認証と認可

1. **認証（Authentication）**
   - Amazon Cognitoを使用してユーザー認証を行う
   - JWTトークンにユーザーロール情報を含める

2. **認可（Authorization）**
   - ロールベースのアクセス制御（RBAC）を実装
   - サーバーサイドとクライアントサイドの両方で権限チェックを行う

```typescript
// クライアントサイドでの権限チェック例
export function hasPermission(user: User, permission: keyof RolePermissions[string]): boolean {
  if (!user || !user.role) return false;
  
  const userRole = user.role;
  return rolePermissions[userRole][permission] === true;
}

// 使用例
if (hasPermission(currentUser, 'canUseEmergencyConsultation')) {
  // 緊急相談ボタンを表示
}
```

## 5. UI実装ガイドライン

### 5.1 ダッシュボード

- 緊急相談ボタンは、`ecec_staff`と`ecec_admin`ロールを持つユーザーにのみ表示する
- ユーザーのロールに基づいて、アクセス可能なモジュールのみをナビゲーションに表示する

### 5.2 設定画面

- ユーザーのロールに基づいて、アクセス可能な設定項目のみを表示する
- 権限のない設定項目は非表示または無効化する

## 6. 将来の拡張

将来的に以下のロールが追加される可能性がある：

1. **保護者（parent）**
   - 自分の子どもの情報のみにアクセス可能
   - 限定的なチャット機能の利用

2. **専門家（specialist）**
   - 特定の専門分野（心理、栄養など）に関するサポートを提供
   - 関連する専門情報へのアクセス

これらのロールが追加される場合は、本文書を更新し、適切な権限設定を行う。

## 7. 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|------------|----------|--------|
| 2025/03/23 | 1.0.0 | 初版作成 | HugMeDo開発チーム |
