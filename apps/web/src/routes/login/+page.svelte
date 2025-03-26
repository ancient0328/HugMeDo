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
</script>

<svelte:head>
  <title>ログイン | HugMeDo</title>
</svelte:head>

<Login 
  platform="web"
  onLoginSuccess={() => goto('/dashboard')}
  onLoginError={(error: Error) => console.error('ログインエラー:', error)}
/>

<style>
  :global(body) {
    background-color: #FAFAFA;
    margin: 0;
    padding: 0;
    font-family: 'Noto Sans JP', 'Roboto', sans-serif;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  
  :global(html) {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  
  :global(*, *:before, *:after) {
    box-sizing: inherit;
  }
</style>
