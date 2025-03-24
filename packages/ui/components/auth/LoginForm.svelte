<script>
  import { createEventDispatcher } from 'svelte';
  
  // イベントディスパッチャー
  const dispatch = createEventDispatcher();
  
  // プロパティ
  export let loginId = '';
  export let password = '';
  export let rememberPassword = false;
  export let showPassword = false;
  export let isLoading = false;
  
  // エラー状態
  let error = null;
  
  // パスワード表示切り替え
  function togglePasswordVisibility() {
    showPassword = !showPassword;
    dispatch('togglePassword', { showPassword });
  }
  
  // ログイン処理
  function handleLogin() {
    if (!loginId || !password) {
      error = 'ユーザー名とパスワードを入力してください';
      return;
    }
    
    error = null;
    dispatch('login', { loginId, password, rememberPassword });
  }
</script>

<div class="login-form">
  <div class="logo">
    <div class="logo-container">
      <div class="logo-icon">
        <img src="/images/hugmedo-frog-logo.svg" alt="HugMeDo Frog Logo" width="100" height="100">
      </div>
      <img src="/images/hugmedo-text-logo.svg" alt="HugMeDo" class="logo-text">
    </div>
  </div>
  
  <form class="w-full" on:submit|preventDefault={handleLogin}>
    <div class="form-group">
      <input 
        type="text" 
        id="loginId" 
        class="input-field" 
        placeholder="メールアドレスまたはID" 
        bind:value={loginId}
        required
      >
    </div>
    
    <div class="form-group" style="margin-bottom: 1.5rem;">
      <div class="password-container">
        {#if showPassword}
          <input 
            type="text" 
            id="password" 
            class="input-field" 
            placeholder="パスワード" 
            bind:value={password}
            required
          >
        {:else}
          <input 
            type="password" 
            id="password" 
            class="input-field" 
            placeholder="パスワード" 
            bind:value={password}
            required
          >
        {/if}
        <button 
          type="button" 
          class="password-toggle" 
          on:click={togglePasswordVisibility} 
          aria-label="パスワードの表示切り替え"
        >
          {#if showPassword}
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
    
    <div class="form-group" style="margin-bottom: 0.75rem;">
      <label class="checkbox-container">
        <input 
          type="checkbox" 
          bind:checked={rememberPassword} 
          id="rememberPassword"
        />
        <span class="checkbox-label">パスワードを保存する</span>
      </label>
    </div>
    
    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}
    
    <button 
      type="submit" 
      class="btn btn-primary" 
      disabled={isLoading}
      style="margin-top: 1.5rem;"
    >
      {#if isLoading}
        ログイン中...
      {:else}
        ログイン
      {/if}
    </button>
  </form>
  
  <div class="text-center mt-4">
    <a href="/forgot-password" class="link">パスワードをお忘れの方はこちら</a>
  </div>
  
  <div class="divider"></div>
  
  <div class="text-center">
    <span class="text-muted mr-2">アカウントをお持ちでない方は</span>
    <a href="/signup" class="link accent-link">新規登録</a>
  </div>
</div>

<style>
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.5rem;
    max-width: 400px;
    width: 100%;
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
  }
  
  .logo {
    margin-bottom: 2.5rem;
    margin-top: 1rem;
    text-align: center;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  
  .logo-icon {
    display: inline-block;
  }
  
  .logo-text {
    max-width: 200px;
    height: auto;
    position: relative;
    top: 25px !important;
  }
  
  .form-group {
    width: 100%;
    margin-bottom: 1.25rem;
  }
  
  .form-group:nth-child(2) {
    margin-bottom: 1.5rem;
  }
  
  .form-group:nth-child(3) {
    margin-bottom: 0.75rem;
  }
  
  .input-field {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #FFFFFF;
    border: 1px solid #E0E0E0;
    transition: all 200ms ease-in-out;
  }
  
  .input-field:focus {
    background-color: white;
    border: 1px solid #2E7D32;
    transform: scale(1.01);
    outline: none;
  }
  
  .password-container {
    position: relative;
  }
  
  .password-toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #6B7280;
  }
  
  .icon-svg {
    height: 1.25rem;
    width: 1.25rem;
  }
  
  .checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 0.25rem;
  }
  
  .checkbox-label {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    color: #757575;
  }
  
  .btn {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: all 200ms ease-in-out;
    border: none;
    margin-top: 1.5rem;
  }
  
  .btn-primary {
    background-color: #2E7D32;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #1B5E20;
  }
  
  .btn-primary:disabled {
    background-color: #9E9E9E;
    cursor: not-allowed;
  }
  
  .divider {
    width: 100%;
    height: 1px;
    background-color: #E0E0E0;
    margin: 1.5rem 0;
  }
  
  .link {
    color: #2E7D32;
    text-decoration: none;
    font-size: 0.875rem;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  
  .accent-link {
    color: #FF8F00;
    font-weight: 500;
  }
  
  .text-center {
    text-align: center;
    width: 100%;
  }
  
  .text-muted {
    color: #757575;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
  
  .mr-2 {
    margin-right: 0.5rem;
  }
  
  .w-full {
    width: 100%;
  }
  
  .error-message {
    width: 100%;
    color: #D32F2F;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background-color: #FFEBEE;
    border-radius: 0.25rem;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .login-form {
      background-color: transparent;
      box-shadow: none;
      padding: 1.5rem 1rem;
    }
    
    .logo-container {
      flex-direction: column;
      align-items: center;
    }

    .logo-text {
      position: static;
      top: auto !important;
      margin-top: 0;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group:nth-child(2) {
      margin-bottom: 1.25rem;
    }
  }
</style>
