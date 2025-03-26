// 認証状態を管理するストア
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { cognitoAuthService } from '../services/cognito-auth';

// 認証状態の型定義
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    role: string;
    [key: string]: any;
  } | null;
  token: string | null;
  loading: boolean;
}

// 初期状態
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false
};

// ローカルストレージから認証情報を取得（ブラウザ環境の場合のみ）
function getStoredAuthState(): Partial<AuthState> {
  if (browser) {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        return {
          isAuthenticated: true,
          token: storedToken,
          user: JSON.parse(storedUser)
        };
      } catch (e) {
        // JSON解析エラーの場合は初期状態を返す
        return {};
      }
    }
  }
  return {};
}

// 認証ストアの作成
const createAuthStore = () => {
  // 初期状態とローカルストレージの状態をマージ
  const mergedState: AuthState = { ...initialState, ...getStoredAuthState() };
  const { subscribe, set, update } = writable<AuthState>(mergedState);

  return {
    subscribe,
    
    // ログイン処理
    login: async (loginId: string, password: string) => {
      update(state => ({ ...state, loading: true }));
      
      try {
        // Cognito認証サービスを使用してログイン
        const result = await cognitoAuthService.signIn(loginId, password);
        
        if (result.success && result.user && result.token) {
          // ユーザー情報の整形
          const user = {
            id: result.user.sub || result.user.id || result.user.username || 'unknown',
            name: result.user.name || result.user.username || 'ユーザー',
            role: result.user.role || result.user['custom:role'] || 'user',
            ...result.user
          };
          
          // 認証成功時の処理
          if (browser) {
            localStorage.setItem('auth_token', result.token);
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
          
          set({
            isAuthenticated: true,
            user,
            token: result.token,
            loading: false
          });
          
          return { success: true };
        } else {
          // 認証失敗時の処理
          update(state => ({ ...state, loading: false }));
          return { 
            success: false, 
            error: result.error || '認証に失敗しました'
          };
        }
      } catch (error) {
        // エラー発生時の処理
        update(state => ({ ...state, loading: false }));
        return { 
          success: false, 
          error: error instanceof Error ? error.message : '認証処理中にエラーが発生しました'
        };
      }
    },
    
    // ログアウト処理
    logout: async () => {
      try {
        // Cognito認証サービスを使用してログアウト
        await cognitoAuthService.signOut();
        
        if (browser) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
        
        set(initialState);
        return { success: true };
      } catch (error) {
        console.error('ログアウトエラー:', error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'ログアウト処理中にエラーが発生しました'
        };
      }
    },
    
    // 認証状態の確認
    checkAuth: async () => {
      try {
        // セッション状態を確認
        const isValid = await cognitoAuthService.checkSession();
        
        if (isValid) {
          // 現在のユーザー情報を取得
          const currentUser = await cognitoAuthService.getCurrentUser();
          
          if (currentUser) {
            // ユーザー情報の整形
            const user = {
              id: currentUser.sub || currentUser.id || currentUser.username || 'unknown',
              name: currentUser.name || currentUser.username || 'ユーザー',
              role: currentUser.role || currentUser['custom:role'] || 'user',
              ...currentUser
            };
            
            update(state => ({
              ...state,
              isAuthenticated: true,
              user
            }));
            
            return true;
          }
        }
        
        // 無効なセッションの場合
        if (browser) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
        
        set(initialState);
        return false;
      } catch (error) {
        console.error('認証チェックエラー:', error);
        return false;
      }
    }
  };
};

// エクスポートする認証ストア
export const authStore = createAuthStore();
