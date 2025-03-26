// ダッシュボードへのアクセスを保護するためのルートガード
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

// 認証状態を確認する関数
function isAuthenticated() {
  if (browser) {
    try {
      // ローカルストレージから認証トークンを確認
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      return !!(token && user);
    } catch (error) {
      console.error('認証チェックエラー:', error);
      return false;
    }
  }
  return false;
}

// 保護されたルートの設定
export function load() {
  // 認証状態を確認
  if (!isAuthenticated()) {
    // 認証されていない場合はログインページにリダイレクト
    throw redirect(302, '/login');
  }
  
  // 認証されている場合は通常通り続行
  return {};
}
