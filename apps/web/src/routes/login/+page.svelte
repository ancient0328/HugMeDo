<script lang="ts">
  import { base } from '$app/paths';
  import { LoginForm } from '@hugmedo/ui';
  
  let loginId = $state('');
  let password = $state('');
  let rememberPassword = $state(false);
  let showPassword = $state(false);
  let isLoading = $state(false);
  
  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
  
  async function handleLogin(e: SubmitEvent) {
    if (!loginId || !password) {
      return;
    }
    
    isLoading = true;
    
    try {
      // TODO: 認証基盤実装後に実際の認証処理を追加
      console.log('ログイン処理:', { loginId, password: '********', rememberPassword });
      
      // 仮の遅延（実際の認証処理では削除）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 認証成功後はダッシュボードへリダイレクト
      window.location.href = `${base}/dashboard`;
    } catch (error) {
      console.error('ログインエラー:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>ログイン | HugMeDo</title>
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
  <LoginForm 
    on:login={handleLogin} 
    bind:loginId={loginId} 
    bind:password={password} 
    bind:rememberPassword={rememberPassword} 
    bind:showPassword={showPassword} 
    isLoading={isLoading} 
    togglePasswordVisibility={togglePasswordVisibility} 
  />
</div>

<style>
  :global(body) {
    background-color: #FAFAFA;
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans JP', 'Roboto', sans-serif;
  }
</style>
