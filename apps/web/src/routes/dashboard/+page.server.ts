import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies, locals }) => {
  // 認証チェック
  const authToken = cookies.get('auth');
  if (!authToken) {
    // 認証されていない場合はログインページにリダイレクト
    throw redirect(302, '/login');
  }

  // TODO: 認証基盤実装後に、トークンの検証処理を追加
  // 例: const decodedToken = verifyToken(authToken);
  
  // ユーザー情報をlocalsに設定
  locals.user = {
    authenticated: true,
    // TODO: 実際のユーザー情報を設定
    id: 'dummy-user-id',
    name: 'テストユーザー',
    role: 'user'
  };

  return {
    // ダッシュボードに表示するデータ
    user: locals.user,
    // TODO: 他のダッシュボードデータを追加
    modules: [
      {
        id: 'ohr',
        name: 'オンライン診療',
        description: 'オンラインでの診療予約・ビデオ通話',
        icon: '🏥',
        url: '/ohr'
      },
      {
        id: 'chat',
        name: 'チャット',
        description: '医師・スタッフとのメッセージ',
        icon: '💬',
        url: '/chat'
      }
    ]
  };
};

export const actions: Actions = {
  // ダッシュボードからのアクションがあれば追加
  logout: async ({ cookies }) => {
    // クッキーから認証トークンを削除
    cookies.delete('auth', { path: '/' });
    
    // ログインページにリダイレクト
    throw redirect(302, '/login');
  }
};
