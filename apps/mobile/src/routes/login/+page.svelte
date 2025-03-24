<script lang="ts">
  import { LoginForm } from '@hugmedo/ui';
  
  let loginId = $state('');
  let password = $state('');
  let rememberPassword = $state(false);
  let showPassword = $state(false);
  let isLoading = $state(false);
  
  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
  
  async function handleLogin() {
    if (!loginId || !password) {
      return;
    }
    
    isLoading = true;
    
    try {
      // ログイン処理（実際の実装はAuth APIに依存）
      console.log('モバイルアプリからログイン:', loginId);
      
      // デモ用に1秒後にログイン成功とする
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功時の処理
      alert('ログイン成功！');
      
      // ダッシュボードへ遷移（実際の実装ではルーティングライブラリを使用）
      // 実装例：goto('/dashboard');
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログインに失敗しました。認証情報を確認してください。');
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>ログイン | HugMeDo Mobile</title>
</svelte:head>

<div class="mobile-login-container">
  <LoginForm 
    on:login={handleLogin} 
    bind:loginId={loginId} 
    bind:password={password} 
    bind:rememberPassword={rememberPassword} 
    bind:showPassword={showPassword} 
    isLoading={isLoading} 
  />
</div>

<style>
  :global(body) {
    background-color: #FAFAFA;
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans JP', 'Roboto', sans-serif;
    -webkit-tap-highlight-color: transparent;
  }
  
  .mobile-login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
  }
  
  /* モバイル向け最適化 */
  @media (max-width: 480px) {
    .mobile-login-container {
      padding: 0.5rem;
    }
    
    :global(.login-form) {
      width: 100%;
      max-width: 100%;
      border-radius: 0;
      box-shadow: none;
      background-color: transparent;
    }
  }
</style>
