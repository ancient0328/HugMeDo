import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
  // TODO: 認証基盤実装後に、既にログイン済みの場合はダッシュボードにリダイレクトする処理を追加
  if (locals.user?.authenticated) throw redirect(302, '/dashboard');
  
  return {
    // クライアントに渡すデータ
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const loginId = data.get('loginId')?.toString();
    const password = data.get('password')?.toString();
    const rememberPassword = data.get('rememberPassword') === 'on';

    if (!loginId || !password) {
      return {
        success: false,
        message: 'ログインIDとパスワードを入力してください'
      };
    }

    try {
      // TODO: 認証基盤実装後に実際の認証処理を追加
      console.log('サーバーサイドログイン処理:', { loginId, password: '********', rememberPassword });
      
      // 仮の認証成功処理
      // 実際の認証基盤では、JWTやセッションを使用して認証状態を管理する
      if (rememberPassword) {
        // 長期間有効なトークンを設定（例: 30日）
        cookies.set('auth', 'dummy-token', {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30
        });
      } else {
        // セッション期間のみ有効なトークンを設定
        cookies.set('auth', 'dummy-token', {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });
      }

      // 認証成功後はダッシュボードへリダイレクト
      throw redirect(302, '/dashboard');
    } catch (error) {
      // リダイレクト以外のエラーの場合
      if (!(error instanceof Response)) {
        console.error('ログインエラー:', error);
        return {
          success: false,
          message: 'ログイン処理中にエラーが発生しました'
        };
      }
      throw error;
    }
  }
};
