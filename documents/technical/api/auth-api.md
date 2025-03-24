# 認証API仕様

## 文書情報

| 項目 | 内容 |
|------|------|
| 文書番号 | API-002 |
| 作成日 | 2025-03-21 |
| 作成者 | HugMeDoチーム |
| ステータス | ドラフト |
| 関連文書 | API-001（API概要）, DEC-001（認証システム選定） |

## 1. 概要

認証APIは、HugMeDoアプリケーションのユーザー認証と認可を管理するためのエンドポイントを提供します。Amazon Cognitoをバックエンドとして使用し、JWT（JSON Web Token）ベースの認証システムを実装しています。

## 2. エンドポイント一覧

| メソッド | エンドポイント | 説明 | 認証要件 |
|--------|--------------|------|---------|
| POST | `/api/v1/auth/register` | 新規ユーザー登録 | 不要 |
| POST | `/api/v1/auth/login` | ユーザーログイン | 不要 |
| POST | `/api/v1/auth/logout` | ユーザーログアウト | 必要 |
| POST | `/api/v1/auth/refresh-token` | アクセストークン更新 | 不要（リフレッシュトークン必要） |
| POST | `/api/v1/auth/forgot-password` | パスワードリセット要求 | 不要 |
| POST | `/api/v1/auth/reset-password` | パスワードリセット実行 | 不要（確認コード必要） |
| GET | `/api/v1/auth/verify-email` | メールアドレス確認 | 不要（確認コード必要） |
| POST | `/api/v1/auth/resend-verification` | 確認メール再送信 | 不要 |
| GET | `/api/v1/auth/me` | 現在のユーザー情報取得 | 必要 |

## 3. エンドポイント詳細

### 3.1 ユーザー登録

**エンドポイント**: `POST /api/v1/auth/register`

**説明**: 新規ユーザーをシステムに登録します。

**リクエスト本文**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "山田 太郎",
  "phoneNumber": "+81901234567"
}
```

**必須フィールド**: `email`, `password`, `name`

**パスワード要件**:
- 8文字以上
- 大文字と小文字を含む
- 数字を含む
- 特殊文字を1つ以上含む

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "山田 太郎",
    "verificationRequired": true
  }
}
```

**エラーレスポンス** (400 Bad Request):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含む必要があります。"
  }
}
```

### 3.2 ユーザーログイン

**エンドポイント**: `POST /api/v1/auth/login`

**説明**: 登録済みユーザーの認証を行い、アクセストークンとリフレッシュトークンを発行します。

**リクエスト本文**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**必須フィールド**: `email`, `password`

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "山田 太郎",
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**エラーレスポンス** (401 Unauthorized):

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが正しくありません。"
  }
}
```

### 3.3 ユーザーログアウト

**エンドポイント**: `POST /api/v1/auth/logout`

**説明**: 現在のセッションを終了し、リフレッシュトークンを無効化します。

**認証**: Bearer トークン

**リクエスト本文**:

```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**必須フィールド**: `refreshToken`

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "message": "ログアウトしました。"
  }
}
```

### 3.4 トークン更新

**エンドポイント**: `POST /api/v1/auth/refresh-token`

**説明**: リフレッシュトークンを使用して新しいアクセストークンを取得します。

**リクエスト本文**:

```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**必須フィールド**: `refreshToken`

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**エラーレスポンス** (401 Unauthorized):

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "リフレッシュトークンが無効または期限切れです。"
  }
}
```

### 3.5 パスワードリセット要求

**エンドポイント**: `POST /api/v1/auth/forgot-password`

**説明**: パスワードリセット用の確認コードをユーザーのメールアドレスに送信します。

**リクエスト本文**:

```json
{
  "email": "user@example.com"
}
```

**必須フィールド**: `email`

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "message": "パスワードリセット用の確認コードを送信しました。",
    "deliveryMedium": "EMAIL"
  }
}
```

### 3.6 パスワードリセット実行

**エンドポイント**: `POST /api/v1/auth/reset-password`

**説明**: 確認コードを使用してパスワードをリセットします。

**リクエスト本文**:

```json
{
  "email": "user@example.com",
  "confirmationCode": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**必須フィールド**: `email`, `confirmationCode`, `newPassword`

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "message": "パスワードが正常にリセットされました。"
  }
}
```

**エラーレスポンス** (400 Bad Request):

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CONFIRMATION_CODE",
    "message": "確認コードが無効または期限切れです。"
  }
}
```

### 3.7 メールアドレス確認

**エンドポイント**: `GET /api/v1/auth/verify-email`

**説明**: 登録時に送信された確認コードを使用してメールアドレスを確認します。

**クエリパラメータ**:
- `email`: ユーザーのメールアドレス
- `code`: 確認コード

**例**: `/api/v1/auth/verify-email?email=user@example.com&code=123456`

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "message": "メールアドレスが確認されました。"
  }
}
```

**エラーレスポンス** (400 Bad Request):

```json
{
  "success": false,
  "error": {
    "code": "INVALID_VERIFICATION_CODE",
    "message": "確認コードが無効または期限切れです。"
  }
}
```

### 3.8 確認メール再送信

**エンドポイント**: `POST /api/v1/auth/resend-verification`

**説明**: メールアドレス確認用の確認コードを再送信します。

**リクエスト本文**:

```json
{
  "email": "user@example.com"
}
```

**必須フィールド**: `email`

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "message": "確認コードを再送信しました。"
  }
}
```

### 3.9 現在のユーザー情報取得

**エンドポイント**: `GET /api/v1/auth/me`

**説明**: 現在認証されているユーザーの情報を取得します。

**認証**: Bearer トークン

**レスポンス** (200 OK):

```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "山田 太郎",
    "phoneNumber": "+81901234567",
    "emailVerified": true,
    "createdAt": "2025-01-15T09:30:00Z",
    "updatedAt": "2025-03-20T14:25:00Z"
  }
}
```

**エラーレスポンス** (401 Unauthorized):

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です。"
  }
}
```

## 4. 認証トークン

### 4.1 トークン形式

HugMeDoは、JWTベースの認証トークンを使用します：

- **アクセストークン**: API要求の認証に使用。有効期間は24時間。
- **リフレッシュトークン**: 新しいアクセストークンの取得に使用。有効期間は30日。

### 4.2 トークン構造

**ペイロード例**:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "山田 太郎",
  "iat": 1616493933,
  "exp": 1616580333,
  "iss": "https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_xxxxxxxx",
  "aud": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### 4.3 トークン使用方法

APIリクエストでは、以下のようにAuthorizationヘッダーにトークンを含めます：

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. セキュリティ考慮事項

### 5.1 レート制限

認証関連のエンドポイントには、以下のレート制限が適用されます：

| エンドポイント | 制限 | 期間 |
|--------------|------|------|
| `/api/v1/auth/login` | 5リクエスト | 1分 |
| `/api/v1/auth/register` | 3リクエスト | 1分 |
| `/api/v1/auth/forgot-password` | 3リクエスト | 1分 |
| その他の認証エンドポイント | 10リクエスト | 1分 |

### 5.2 アカウントロック

誤ったパスワードで5回連続してログインを試みると、アカウントは一時的にロックされます（30分間）。

### 5.3 セキュアな通信

すべての認証リクエストはHTTPS経由で送信する必要があります。HTTP経由のリクエストは自動的にHTTPSにリダイレクトされます。

## 6. 実装例

### 6.1 ユーザー登録（JavaScript）

```javascript
async function registerUser(email, password, name, phoneNumber) {
  try {
    const response = await fetch('https://api.hugmedo.com/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name,
        phoneNumber
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}
```

### 6.2 ユーザーログイン（JavaScript）

```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch('https://api.hugmedo.com/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error.message);
    }
    
    // トークンをローカルストレージに保存
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    return data.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
```

### 6.3 認証付きAPIリクエスト（JavaScript）

```javascript
async function fetchAuthenticatedData(url) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('認証が必要です。');
  }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // トークンが期限切れの場合、リフレッシュを試みる
      if (data.error.code === 'TOKEN_EXPIRED') {
        await refreshAuthToken();
        return fetchAuthenticatedData(url);
      }
      
      throw new Error(data.error.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
```

### 6.4 トークンリフレッシュ（JavaScript）

```javascript
async function refreshAuthToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('リフレッシュトークンがありません。再ログインが必要です。');
  }
  
  try {
    const response = await fetch('https://api.hugmedo.com/api/v1/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // リフレッシュトークンが無効な場合、ログアウト処理
      if (data.error.code === 'INVALID_REFRESH_TOKEN') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      
      throw new Error(data.error.message);
    }
    
    // 新しいトークンを保存
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    return data.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}
```

## 7. トラブルシューティング

### 7.1 一般的な問題と解決策

| 問題 | 考えられる原因 | 解決策 |
|------|--------------|--------|
| 「無効な認証情報」エラー | メールアドレスまたはパスワードが間違っている | 認証情報を確認し、再試行する |
| 「メールアドレスが確認されていません」エラー | メール確認が完了していない | 確認メールのリンクをクリックするか、確認コードを再送信する |
| 「トークンが期限切れです」エラー | アクセストークンの有効期限が切れている | リフレッシュトークンを使用して新しいトークンを取得する |
| 「リフレッシュトークンが無効です」エラー | リフレッシュトークンの有効期限が切れているか無効 | 再ログインする |

### 7.2 エラーコード一覧

| エラーコード | 説明 |
|------------|------|
| INVALID_CREDENTIALS | メールアドレスまたはパスワードが正しくない |
| EMAIL_NOT_VERIFIED | メールアドレスが確認されていない |
| ACCOUNT_LOCKED | アカウントが一時的にロックされている |
| TOKEN_EXPIRED | アクセストークンの有効期限が切れている |
| INVALID_REFRESH_TOKEN | リフレッシュトークンが無効または期限切れ |
| INVALID_CONFIRMATION_CODE | 確認コードが無効または期限切れ |
| USER_ALREADY_EXISTS | 同じメールアドレスのユーザーが既に存在する |
| PASSWORD_POLICY_VIOLATION | パスワードがポリシー要件を満たしていない |

## 8. FAQ

### 8.1 認証関連のよくある質問

**Q: パスワードを忘れた場合はどうすればよいですか？**  
A: `/api/v1/auth/forgot-password`エンドポイントを使用して、パスワードリセット用の確認コードを取得できます。

**Q: トークンの有効期限はどのくらいですか？**  
A: アクセストークンは24時間、リフレッシュトークンは30日間有効です。

**Q: アカウントがロックされた場合はどうすればよいですか？**  
A: 30分待つか、サポートに連絡してロック解除を依頼してください。

**Q: 複数のデバイスで同時にログインできますか？**  
A: はい、複数のデバイスで同時にログインできます。各デバイスには独自のトークンセットが発行されます。

---

*このドキュメントは、HugMeDoアプリケーションの認証API仕様を提供するものです。APIの変更や更新があった場合は、このドキュメントも更新されます。*

最終更新: 2025-03-21
