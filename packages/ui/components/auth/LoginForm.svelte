<script lang="ts">
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
  let error: string | null = null;
  
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

<form class="login-form" on:submit|preventDefault={handleLogin}>
  {#if error}
    <div class="alert alert-error">
      {error}
    </div>
  {/if}
  
  <div class="form-group">
    <label for="loginId" class="form-label">ログインID</label>
    <input 
      type="text" 
      id="loginId" 
      class="input-field" 
      placeholder="メールアドレスまたはユーザーID" 
      bind:value={loginId} 
      disabled={isLoading}
      autocomplete="username"
    />
  </div>
  
  <div class="form-group">
    <label for="password" class="form-label">パスワード</label>
    <div class="password-field-container">
      <input 
        type={showPassword ? 'text' : 'password'} 
        id="password" 
        class="input-field" 
        placeholder="パスワード" 
        bind:value={password} 
        disabled={isLoading}
        autocomplete="current-password"
      />
      <button 
        type="button" 
        class="password-toggle-btn" 
        on:click={togglePasswordVisibility}
        disabled={isLoading}
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
  
  <div class="form-group checkbox-group">
    <label class="checkbox-label">
      <input 
        type="checkbox" 
        bind:checked={rememberPassword} 
        disabled={isLoading}
      />
      <span>ログインIDを記憶する</span>
    </label>
  </div>
  
  <div class="form-group">
    <button 
      type="submit" 
      class="btn btn-primary" 
      disabled={isLoading}
    >
      {#if isLoading}
        <span class="loading-spinner"></span>
        ログイン中...
      {:else}
        ログイン
      {/if}
    </button>
  </div>
  
  <div class="form-group text-center">
    <a href="/forgot-password" class="link">パスワードをお忘れですか？</a>
  </div>
  
  <div class="form-group text-center">
    <span class="text-muted">アカウントをお持ちでない場合は</span>
    <a href="/register" class="link">新規登録</a>
  </div>
</form>

<style>
  .login-form {
    width: 100%;
    box-sizing: border-box;
  }
  
  .form-group {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .input-field {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #F5F5F5;
    border: 1px solid transparent;
    transition: all 200ms ease-in-out;
  }
  
  .input-field:focus {
    background-color: white;
    border: 1px solid #E0E0E0;
    transform: scale(1.01);
    outline: none;
  }
  
  .password-field-container {
    position: relative;
    width: 100%;
  }
  
  .password-toggle-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #6B7280;
    padding: 0.25rem;
  }
  
  .password-toggle-btn:hover {
    color: #4a5568;
  }
  
  .icon-svg {
    height: 1.25rem;
    width: 1.25rem;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #4a5568;
    cursor: pointer;
  }
  
  .checkbox-label input {
    margin-right: 0.5rem;
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
    margin-top: 1rem;
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
  
  .text-center {
    text-align: center;
    width: 100%;
  }
  
  .text-muted {
    color: #757575;
  }
  
  .link {
    color: #2E7D32;
    text-decoration: none;
    font-size: 0.875rem;
  }
  
  .link:hover {
    text-decoration: underline;
  }
  
  .alert {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .alert-error {
    background-color: #FEE2E2;
    color: #B91C1C;
    border: 1px solid #F87171;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #4a5568;
  }
</style>
