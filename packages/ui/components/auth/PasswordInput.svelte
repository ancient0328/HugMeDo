<script>
  import { createEventDispatcher } from 'svelte';
  
  // イベントディスパッチャー
  const dispatch = createEventDispatcher();
  
  // パスワード入力のプロパティ
  export let id = "password";
  export let label = "パスワード";
  export let value = "";
  export let placeholder = "パスワード";
  export let required = false;
  export let disabled = false;
  export let error = "";
  export let fullWidth = true;
  export let showPassword = false;

  // 内部状態
  let focused = false;
  
  // フォーカス状態の管理
  function handleFocus() {
    focused = true;
  }
  
  function handleBlur() {
    focused = false;
  }
  
  // パスワード表示切り替え
  function togglePasswordVisibility() {
    showPassword = !showPassword;
    dispatch('toggleVisibility');
  }
</script>

<div class={fullWidth ? "w-full" : ""}>
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  
  <div class="password-container">
    {#if showPassword}
      <input
        {id}
        type="text"
        {placeholder}
        {required}
        {disabled}
        bind:value
        class="input-field"
        class:input-focused={focused}
        class:input-error={!!error}
        class:input-disabled={disabled}
        on:focus={handleFocus}
        on:blur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    {:else}
      <input
        {id}
        type="password"
        {placeholder}
        {required}
        {disabled}
        bind:value
        class="input-field"
        class:input-focused={focused}
        class:input-error={!!error}
        class:input-disabled={disabled}
        on:focus={handleFocus}
        on:blur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    {/if}
    
    <button
      type="button"
      class="toggle-password-btn"
      on:click={togglePasswordVisibility}
      tabindex="-1"
      aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
    >
      {#if showPassword}
        <!-- 目を閉じるアイコン (パスワードを隠す) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      {:else}
        <!-- 目を開くアイコン (パスワードを表示) -->
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      {/if}
    </button>
  </div>
  
  {#if error}
    <div id="{id}-error" class="error-text">{error}</div>
  {/if}
</div>

<style>
  .w-full {
    width: 100%;
  }
  
  .input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4B5563;
    margin-bottom: 0.25rem;
  }
  
  .password-container {
    position: relative;
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
    padding-right: 2.5rem;
  }
  
  .input-field:focus, .input-focused {
    background-color: white;
    border: 1px solid #E0E0E0;
    transform: scale(1.01);
    outline: none;
  }
  
  .input-error {
    background-color: #FFF8F8;
    border: 1px solid #FF5252;
  }
  
  .input-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .toggle-password-btn {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    padding-right: 0.75rem;
    display: flex;
    align-items: center;
    color: #6B7280;
    cursor: pointer;
    background: none;
    border: none;
  }
  
  .toggle-password-btn:hover {
    color: #4B5563;
  }
  
  .icon-svg {
    height: 1.25rem;
    width: 1.25rem;
  }
  
  .error-text {
    color: #D32F2F;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
</style>
