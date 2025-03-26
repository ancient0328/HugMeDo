<script lang="ts">
  import { base } from '$app/paths';
  import Login from '@hugmedo/ui/pages/auth/Login.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { authStore } from '@hugmedo/ui';
  
  // 認証状態チェック
  onMount(async () => {
    try {
      // 認証状態をチェック
      const isAuthenticated = await authStore.checkAuth();
      
      // すでに認証済みの場合はダッシュボードへリダイレクト
      if (isAuthenticated) {
        goto('/dashboard');
      }
    } catch (error) {
      console.error('認証チェックエラー:', error);
    }
  });
  
  // ログイン成功時の処理
  function handleLoginSuccess() {
    goto('/dashboard');
  }
  
  // ログインエラー時の処理
  function handleLoginError(error: Error) {
    console.error('ログインエラー:', error);
  }
</script>

<svelte:head>
  <title>ログイン | HugMeDo Mobile</title>
</svelte:head>

<Login 
  platform="mobile" 
  onLoginSuccess={handleLoginSuccess} 
  onLoginError={handleLoginError} 
/>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #fafafa;
  }
</style>
