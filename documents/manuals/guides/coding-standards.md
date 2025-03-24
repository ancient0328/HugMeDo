# HugMeDo コーディング規約

## 文書情報

| 項目 | 内容 |
|------|------|
| 文書番号 | GUIDE-003 |
| 作成日 | 2025-03-21 |
| 作成者 | HugMeDoチーム |
| ステータス | ドラフト |
| 関連文書 | ARCH-001（アーキテクチャ概要）, GUIDE-001（開発環境セットアップ） |

## 1. 概要

本文書は、HugMeDoプロジェクトにおけるコーディング規約を定義します。一貫性のあるコードベースを維持し、品質を確保するための指針となります。すべての開発者はこの規約に従ってコードを作成・修正することが求められます。

## 2. 全般的なガイドライン

### 2.1 基本原則

- **読みやすさ優先**: コードは書く時間よりも読まれる時間の方が長いため、読みやすさを最優先する
- **シンプルさ**: 複雑な実装より単純な実装を優先する
- **一貫性**: プロジェクト全体で一貫したスタイルとパターンを使用する
- **自己文書化コード**: コードは可能な限り自己説明的であるべき
- **DRY原則**: 同じコードを繰り返し書かない（Don't Repeat Yourself）

### 2.2 コードフォーマット

- **インデント**: スペース2つを使用
- **行の長さ**: 最大100文字
- **ファイル末尾**: 空行で終わる
- **改行コード**: LF（Unix形式）を使用
- **セミコロン**: 文末のセミコロンは必須

### 2.3 コメント

- **目的**: コードが「何をしているか」ではなく「なぜそうしているか」を説明する
- **JSDoc**: 関数、クラス、インターフェースにはJSDocコメントを使用
- **TODO/FIXME**: 一時的なコメントには`TODO:`や`FIXME:`プレフィックスを使用し、課題管理システムのチケット番号を含める
- **コードのコメントアウト**: 不要なコードはコメントアウトせず、削除する

例:
```typescript
/**
 * ユーザーの認証状態を確認し、未認証の場合はログインページにリダイレクトする
 * @param req - リクエストオブジェクト
 * @param res - レスポンスオブジェクト
 * @returns 認証済みの場合はtrueを返す
 */
function checkAuth(req: Request, res: Response): boolean {
  // トークンが無効な場合はリダイレクト
  // (セキュリティ上の理由でJWTの有効期限を短く設定しているため)
  if (!isValidToken(req.headers.authorization)) {
    res.redirect('/login');
    return false;
  }
  return true;
}
```

## 3. 命名規則

### 3.1 ファイル命名

- **コンポーネント**: PascalCase（例: `CircularProgress.svelte`）
- **ユーティリティ/サービス**: kebab-case（例: `auth-service.ts`）
- **設定ファイル**: camelCase（例: `tsconfig.json`）
- **テストファイル**: 対象ファイル名に`.test`または`.spec`を追加（例: `auth-service.test.ts`）

### 3.2 変数・関数・クラス命名

- **変数/関数**: camelCase（例: `getUserData`, `isActive`）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_RETRY_COUNT`, `API_URL`）
- **クラス/型/インターフェース**: PascalCase（例: `UserProfile`, `AuthService`）
- **プライベートメンバー**: 先頭にアンダースコア（例: `_privateMethod`, `_internalState`）
- **ブール値**: `is`, `has`, `can`などのプレフィックスを使用（例: `isLoggedIn`, `hasPermission`）

### 3.3 命名の一般原則

- **明確で説明的**: 変数や関数の名前は目的を明確に示す
- **略語を避ける**: 一般的に知られている略語（URL, HTTP等）以外は略語を避ける
- **一貫した用語**: 同じ概念には同じ用語を使用する（例: `fetch`/`get`/`retrieve`を混在させない）
- **ハンガリアン記法を避ける**: 型を示すプレフィックスは使用しない

## 4. TypeScript固有のガイドライン

### 4.1 型定義

- **明示的な型**: 推論が難しい場合は型を明示的に指定する
- **any型の回避**: `any`型の使用は極力避け、適切な型を定義する
- **インターフェースとタイプエイリアス**: 
  - オブジェクト型にはインターフェース（`interface`）を優先的に使用
  - ユニオン型やプリミティブ型のエイリアスには型エイリアス（`type`）を使用
- **ジェネリクス**: 再利用可能なコンポーネントやユーティリティには適切にジェネリクスを活用

```typescript
// 良い例
interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

type UserRole = 'admin' | 'doctor' | 'patient';

// 避けるべき例
const user: any = fetchUser();
```

### 4.2 非同期処理

- **Promise**: コールバックよりPromiseを優先
- **async/await**: Promise chainingよりasync/awaitを優先
- **エラーハンドリング**: try/catchブロックでエラーを適切に処理

```typescript
// 良い例
async function fetchUserData(userId: string): Promise<UserProfile> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    logger.error('Error fetching user data', { userId, error });
    throw error;
  }
}

// 避けるべき例
function fetchUserData(userId, callback) {
  fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(err => callback(err));
}
```

### 4.3 モジュールとインポート

- **名前付きエクスポート**: デフォルトエクスポートより名前付きエクスポートを優先
- **インポートの整理**: インポートは以下の順序でグループ化
  1. 外部ライブラリ
  2. 内部共通モジュール
  3. 同一ディレクトリ内のモジュール
- **絶対パス**: 深いネストの相対パスを避け、必要に応じてエイリアスを使用

```typescript
// 良い例
import { useState, useEffect } from 'svelte';
import { logger } from '@hugmedo/core/utils';
import { UserService } from '@hugmedo/core/services';
import { ProfileCard } from '../components';
import { formatDate } from './utils';

// 避けるべき例
import ProfileCard from '../../../components/ProfileCard';
import formatDate from './utils/formatDate';
import logger from '../../../../core/utils/logger';
```

## 5. Svelte固有のガイドライン

### 5.1 コンポーネント構造

- **単一責任**: 各コンポーネントは単一の責任を持つ
- **ファイル構造**: スクリプト、マークアップ、スタイルの順で記述
- **プロップ定義**: TypeScriptを使用して明示的にプロップの型を定義
- **イベントディスパッチ**: 型付きのカスタムイベントを使用

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { UserProfile } from '@hugmedo/types';
  
  // プロップ定義
  export let user: UserProfile;
  export let isEditable = false;
  
  // イベントディスパッチャー
  const dispatch = createEventDispatcher<{
    edit: { userId: string };
    delete: { userId: string };
  }>();
  
  // メソッド
  function handleEdit() {
    dispatch('edit', { userId: user.id });
  }
</script>

<div class="user-card">
  <h3>{user.name}</h3>
  <p>{user.email}</p>
  
  {#if isEditable}
    <button on:click={handleEdit}>編集</button>
  {/if}
</div>

<style>
  .user-card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
</style>
```

### 5.2 リアクティビティ

- **派生値**: 複雑な計算には`$:`リアクティブステートメントを使用
- **ストア**: グローバル状態には適切にSvelteストアを活用
- **コンテキスト**: 深いネストのプロップドリルを避けるためにコンテキストを使用

```svelte
<script lang="ts">
  import { derived } from 'svelte/store';
  import { userStore } from '@hugmedo/stores';
  
  export let items: string[];
  
  // 派生値
  $: itemCount = items.length;
  $: hasItems = itemCount > 0;
  
  // ストアの使用
  $: isAdmin = $userStore?.role === 'admin';
</script>

<div>
  {#if hasItems}
    <p>全{itemCount}件のアイテムがあります</p>
    <ul>
      {#each items as item}
        <li>{item}</li>
      {/each}
    </ul>
  {:else}
    <p>アイテムがありません</p>
  {/if}
  
  {#if isAdmin}
    <button>管理者操作</button>
  {/if}
</div>
```

### 5.3 パフォーマンス最適化

- **メモ化**: 計算コストの高い処理には`memoize`関数を使用
- **コンポーネント分割**: 大きなコンポーネントは適切に分割
- **遅延ローディング**: 必要に応じてコンポーネントを遅延ロード

## 6. API設計ガイドライン

### 6.1 RESTful API設計

- **リソース命名**: 複数形の名詞を使用（例: `/users`, `/appointments`）
- **HTTP動詞**: 適切なHTTPメソッドを使用（GET, POST, PUT, DELETE）
- **ステータスコード**: 適切なHTTPステータスコードを返す
- **クエリパラメータ**: フィルタリング、ソート、ページネーションにはクエリパラメータを使用
- **バージョニング**: APIのバージョンを明示（例: `/api/v1/users`）

### 6.2 エラーハンドリング

- **一貫したエラーレスポンス**: エラーレスポンスは一貫した形式で返す
- **詳細なエラーメッセージ**: クライアントが理解できる詳細なエラーメッセージを提供
- **エラーコード**: エラータイプを識別するためのコードを含める

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが正しくありません",
    "status": 401,
    "timestamp": "2025-03-21T12:34:56Z"
  }
}
```

### 6.3 セキュリティ

- **入力検証**: すべてのAPIリクエストパラメータを検証
- **レート制限**: APIリクエストのレート制限を実装
- **認証と認可**: すべてのエンドポイントで適切な認証と認可を実施

## 7. データベースアクセス

### 7.1 クエリ設計

- **型安全なクエリ**: ORMまたはクエリビルダーを使用して型安全なクエリを作成
- **インデックス活用**: 頻繁に使用されるクエリにはインデックスを適切に設定
- **N+1問題の回避**: 関連データの取得には適切なJOINまたはプリロードを使用

### 7.2 トランザクション

- **ACID原則**: データの整合性を保つためにトランザクションを適切に使用
- **長時間トランザクションの回避**: パフォーマンスとデッドロックを避けるため、トランザクションは短く保つ

```typescript
// 良い例
async function transferFunds(fromAccountId: string, toAccountId: string, amount: number): Promise<void> {
  return db.$transaction(async (tx) => {
    // 送金元の残高確認
    const fromAccount = await tx.accounts.findUnique({ where: { id: fromAccountId } });
    if (!fromAccount || fromAccount.balance < amount) {
      throw new Error('残高不足');
    }
    
    // 送金元から引き落とし
    await tx.accounts.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } }
    });
    
    // 送金先に入金
    await tx.accounts.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } }
    });
    
    // 取引記録
    await tx.transactions.create({
      data: {
        fromAccountId,
        toAccountId,
        amount,
        timestamp: new Date()
      }
    });
  });
}
```

### 7.3 データアクセス層

- **リポジトリパターン**: データアクセスロジックをリポジトリクラスにカプセル化
- **ドメインロジックの分離**: データアクセス層とビジネスロジックを明確に分離
- **クエリの再利用**: 共通のクエリは再利用可能な関数として実装

## 8. テスト

### 8.1 単体テスト

- **テストフレームワーク**: Vitest/Jestを使用
- **カバレッジ目標**: コードカバレッジ80%以上を目指す
- **テスト構造**: Arrange-Act-Assert（AAA）パターンに従う
- **モック**: 外部依存はモックまたはスタブを使用

```typescript
// 良い例
describe('UserService', () => {
  describe('authenticate', () => {
    it('正しい認証情報で成功する', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'correct-password';
      const mockDb = {
        users: {
          findUnique: vi.fn().mockResolvedValue({
            id: '123',
            email,
            password: await hashPassword(password)
          })
        }
      };
      const service = new UserService(mockDb as any);
      
      // Act
      const result = await service.authenticate(email, password);
      
      // Assert
      expect(result).toEqual({
        success: true,
        userId: '123'
      });
      expect(mockDb.users.findUnique).toHaveBeenCalledWith({
        where: { email }
      });
    });
    
    it('不正なパスワードで失敗する', async () => {
      // テスト実装
    });
  });
});
```

### 8.2 統合テスト

- **API統合テスト**: 実際のAPIエンドポイントに対するテスト
- **データベース統合テスト**: テスト用データベースを使用した実際のクエリのテスト
- **テストデータ**: テスト用のシードデータを用意

### 8.3 E2Eテスト

- **テストフレームワーク**: Playwright/Cypressを使用
- **重要フロー**: ログイン、ユーザー登録、主要機能のフローをテスト
- **テスト環境**: テスト用の独立した環境を用意

## 9. ログとエラー処理

### 9.1 ログ記録

- **ログレベル**: 適切なログレベル（debug, info, warn, error）を使用
- **構造化ログ**: JSONフォーマットの構造化ログを使用
- **コンテキスト情報**: リクエストID、ユーザーID等のコンテキスト情報を含める

```typescript
// 良い例
logger.info('ユーザーログイン成功', {
  userId: user.id,
  email: user.email,
  requestId: ctx.requestId,
  ip: ctx.ip
});

logger.error('支払い処理失敗', {
  userId: user.id,
  orderId: order.id,
  errorCode: error.code,
  errorMessage: error.message,
  requestId: ctx.requestId
});
```

### 9.2 エラー処理

- **エラークラス**: カスタムエラークラスを使用して異なるタイプのエラーを区別
- **エラー伝播**: 適切なレベルでエラーをキャッチし処理
- **ユーザーフレンドリーなエラー**: エンドユーザーには技術的詳細を隠した分かりやすいエラーメッセージを表示

```typescript
// カスタムエラークラス
export class ValidationError extends Error {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
  }
}

// エラー処理
try {
  await processOrder(orderId);
} catch (error) {
  if (error instanceof ValidationError) {
    // バリデーションエラーの処理
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        fields: error.fields
      }
    });
  } else if (error instanceof PaymentError) {
    // 支払いエラーの処理
    logger.error('支払い処理エラー', { orderId, error });
    return res.status(400).json({
      error: {
        code: 'PAYMENT_ERROR',
        message: '支払い処理中にエラーが発生しました'
      }
    });
  } else {
    // 予期しないエラーの処理
    logger.error('予期しないエラー', { orderId, error });
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: '内部サーバーエラーが発生しました'
      }
    });
  }
}
```

## 10. パフォーマンス最適化

### 10.1 フロントエンド最適化

- **バンドルサイズ**: コードスプリッティングとツリーシェイキングでバンドルサイズを最小化
- **レンダリングパフォーマンス**: 不要な再レンダリングを避ける
- **画像最適化**: 適切なフォーマットとサイズの画像を使用
- **キャッシュ戦略**: 適切なキャッシュヘッダーとサービスワーカーを使用

### 10.2 バックエンド最適化

- **データベースクエリ**: インデックスを適切に使用し、N+1問題を回避
- **キャッシング**: 頻繁にアクセスされるデータをRedisでキャッシュ
- **非同期処理**: 長時間実行タスクはバックグラウンドジョブとして実行
- **水平スケーリング**: ステートレスなサービスは水平スケーリング可能に設計

### 10.3 ネットワーク最適化

- **API応答**: 必要最小限のデータのみを返す
- **バッチリクエスト**: 複数の小さなリクエストを1つのバッチリクエストにまとめる
- **圧縮**: レスポンスデータの圧縮（gzip/brotli）

## 11. セキュリティプラクティス

### 11.1 入力検証

- **サーバーサイド検証**: すべての入力データをサーバーサイドで検証
- **サニタイズ**: XSS対策としてユーザー入力をサニタイズ
- **型チェック**: 期待される型と一致するか確認

### 11.2 認証と認可

- **JWTベストプラクティス**: 適切な有効期限と署名アルゴリズムを使用
- **CSRF対策**: CSRF対策を実装
- **セキュアクッキー**: HttpOnly, Secure, SameSite属性を設定

### 11.3 機密データ処理

- **機密データの最小化**: 必要最小限の機密データのみを保存
- **暗号化**: 機密データは保存前に暗号化
- **マスキング**: ログやエラーメッセージでの機密データのマスキング

## 12. コードレビュープロセス

### 12.1 レビュー基準

- **機能性**: 要件を満たしているか
- **コード品質**: 規約に従っているか、読みやすいか
- **テスト**: 適切なテストが書かれているか
- **セキュリティ**: セキュリティ上の問題がないか
- **パフォーマンス**: パフォーマンス上の問題がないか

### 12.2 プルリクエストプロセス

- **サイズ**: プルリクエストは小さく保つ（理想的には300行以下）
- **説明**: 変更内容と理由を明確に説明
- **レビュアー**: 少なくとも1人のレビュアーを指定
- **CI/CDチェック**: 自動テストとリントチェックをパス

### 12.3 レビューコメント

- **建設的**: 問題点だけでなく解決策も提案
- **優先順位**: 重要な問題と細かな問題を区別
- **コードではなく問題に焦点**: 特定の実装ではなく問題に焦点を当てる

## 13. ドキュメント

### 13.1 コードドキュメント

- **JSDoc**: 関数、クラス、インターフェースにはJSDocコメントを使用
- **README**: 各モジュールにはREADMEファイルを用意
- **使用例**: 複雑なコンポーネントやユーティリティには使用例を含める

### 13.2 アーキテクチャドキュメント

- **アーキテクチャ図**: システム全体のアーキテクチャ図を維持
- **データフロー**: 主要な機能のデータフロー図を作成
- **決定記録**: 重要な技術的決定の記録を残す

### 13.3 APIドキュメント

- **OpenAPI/Swagger**: RESTful APIはOpenAPI仕様でドキュメント化
- **エンドポイント説明**: 各エンドポイントの目的、パラメータ、レスポンスを説明
- **認証要件**: 認証要件を明記

## 14. 継続的インテグレーション/デリバリー

### 14.1 CI/CDパイプライン

- **自動テスト**: プルリクエスト時に自動テストを実行
- **コード品質チェック**: リント、型チェック、コードスタイルチェックを実行
- **セキュリティスキャン**: 依存関係の脆弱性スキャンを実行
- **自動デプロイ**: 承認後に自動デプロイ

### 14.2 環境

- **開発環境**: 個々の開発者のローカル環境
- **テスト環境**: 自動テスト用の共有環境
- **ステージング環境**: 本番に近い構成のテスト環境
- **本番環境**: エンドユーザー向け環境

## 15. バージョン管理

### 15.1 Gitワークフロー

- **ブランチ戦略**: GitFlowまたはGitHub Flowに基づくブランチ戦略を採用
- **コミットメッセージ**: 明確で一貫性のあるコミットメッセージを書く
- **マージ戦略**: プルリクエストとコードレビュー後にマージ

### 15.2 バージョニング

- **セマンティックバージョニング**: MAJOR.MINOR.PATCH形式を使用
- **変更履歴**: CHANGELOGファイルで変更を追跡
- **タグ付け**: リリース時にGitタグを付ける

## 16. 依存関係管理

### 16.1 パッケージ管理

- **pnpm**: パッケージマネージャーとしてpnpmを使用
- **バージョン固定**: 依存関係のバージョンを固定
- **定期的な更新**: セキュリティ更新と機能更新を定期的に適用

### 16.2 モノレポ管理

- **ワークスペース**: pnpmワークスペースを使用してモノレポを管理
- **依存関係グラフ**: モジュール間の依存関係を明確に定義
- **共有コード**: 共通コードは共有パッケージとして管理

---

*このコーディング規約は、HugMeDoプロジェクトの開発者が一貫性のあるコードを作成するための指針です。プロジェクトの進化に合わせて定期的に見直しと更新を行います。*

最終更新: 2025-03-21
