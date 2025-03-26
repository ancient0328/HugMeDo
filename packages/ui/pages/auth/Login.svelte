<script lang="ts">
  import LoginForm from '../../components/auth/LoginForm.svelte';
  import { authStore } from '../../stores/auth';
  import { onMount } from 'svelte';
  import frogLogo from '../../assets/images/hugmedo-frog-logo.svg';
  import textLogo from '../../assets/images/hugmedo-text-logo.svg';
  
  // プロパティ定義
  let { 
    platform = 'web',
    onLoginSuccess = () => {},
    onLoginError = () => {}
  } = $props();
  
  // 状態管理
  let loginId = $state('');
  let password = $state('');
  let rememberPassword = $state(false);
  let showPassword = $state(false);
  let isLoading = $state(false);
  let errorMessage = $state('');
  
  // プラットフォーム固有の設定
  let isMobile = $derived(platform === 'mobile');
  
  // マウント時に認証状態をチェック
  onMount(async () => {
    isLoading = true;
    
    try {
      // 保存されたログインIDを読み込む
      const savedLoginId = localStorage.getItem('remembered_login_id');
      if (savedLoginId) {
        loginId = savedLoginId;
        rememberPassword = true;
      }
    } catch (error) {
      console.error('認証情報読み込みエラー:', error);
    } finally {
      isLoading = false;
    }
  });
  
  // ログイン処理
  async function handleLogin({ detail }: { detail: { loginId: string; password: string; rememberPassword: boolean } }) {
    if (!detail.loginId || !detail.password) {
      errorMessage = 'ログインIDとパスワードを入力してください';
      return;
    }
    
    errorMessage = '';
    isLoading = true;
    
    try {
      // 認証処理
      const success = await authStore.login(detail.loginId, detail.password);
      
      // パスワードを記憶する場合
      if (detail.rememberPassword) {
        localStorage.setItem('remembered_login_id', detail.loginId);
      } else {
        localStorage.removeItem('remembered_login_id');
      }
      
      // ログイン成功
      if (success) {
        onLoginSuccess();
      } else {
        errorMessage = 'ログインに失敗しました。IDとパスワードを確認してください。';
        onLoginError(new Error('ログイン失敗'));
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      errorMessage = 'ログイン処理中にエラーが発生しました。';
      onLoginError(error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="login-form">
    <div class="logo-container">
      <img src={frogLogo} alt="HugMeDo カエルロゴ" width="120" height="120" class="logo-icon">
      <img src={textLogo} alt="HugMeDo テキストロゴ" class="logo-text">
    </div>
    
    <LoginForm 
      on:login={handleLogin} 
      bind:loginId={loginId} 
      bind:password={password} 
      bind:rememberPassword={rememberPassword} 
      bind:showPassword={showPassword} 
      isLoading={isLoading} 
    />
    
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}
  </div>
</div>

<style>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
    background-color: #FAFAFA;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem;
    max-width: 480px;
    width: 100%;
    border-radius: 12px;
  }
  
  .logo-container {
    margin-bottom: 2.5rem;
    margin-top: 1rem;
    text-align: center;
  }
  
  .logo-icon {
    margin-bottom: 16px;
    display: inline-block;
  }
  
  .logo-text {
    max-width: 200px;
    height: auto;
  }
  
  .error-message {
    color: #e53e3e;
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #fff5f5;
    border-radius: 0.25rem;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }
  
  @media (max-width: 768px) {
    .login-form {
      background-color: transparent;
    }
  }
</style>
