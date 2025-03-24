<script lang="ts">
  import { base } from '$app/paths';
  
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

<div class="min-h-screen flex flex-col items-center justify-center bg-white px-4">
  <div class="w-full max-w-md">
    <div class="flex flex-col items-center mb-8">
      <!-- ロゴ -->
      <div class="w-32 h-32 mb-4 relative">
        <img 
          src="/packages/ui/assets/images/hugmedo-frog-logo.svg" 
          alt="HugMeDoロゴ" 
          class="w-full h-full"
        />
      </div>
      
      <!-- テキストロゴ -->
      <div class="w-64 mb-2">
        <img 
          src="/packages/ui/assets/images/titlelogo.svg" 
          alt="HugMeDoテキストロゴ" 
          class="w-full"
        />
      </div>
    </div>
    
    <form
      onsubmit={(e: SubmitEvent) => {
        e.preventDefault();
        handleLogin(e);
      }}
      class="w-full"
    >
      <!-- ログインID入力 -->
      <div class="mb-4">
        <div class="relative">
          <input
            type="text"
            id="loginId"
            bind:value={loginId}
            placeholder=" "
            class="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent peer"
            required
          />
          <label
            for="loginId"
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            ログインID
          </label>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <!-- 目のアイコンなし -->
          </div>
        </div>
      </div>
      
      <!-- パスワード入力 -->
      <div class="mb-4">
        <div class="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            bind:value={password}
            placeholder=" "
            class="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent peer"
            required
          />
          <label
            for="password"
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            パスワード
          </label>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onclick={togglePasswordVisibility}
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {#if showPassword}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              {/if}
            </button>
          </div>
        </div>
      </div>
      
      <!-- パスワードを保存するチェックボックス -->
      <div class="mb-6 flex items-center">
        <input
          type="checkbox"
          id="rememberPassword"
          bind:checked={rememberPassword}
          class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
        />
        <label for="rememberPassword" class="ml-2 text-sm text-gray-600">
          パスワードを保存する
        </label>
      </div>
      
      <!-- ログインボタン -->
      <button
        type="submit"
        class="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 flex justify-center items-center"
        disabled={isLoading}
      >
        {#if isLoading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          処理中...
        {:else}
          ログイン
        {/if}
      </button>
      
      <!-- 補助リンク -->
      <div class="mt-4 text-center">
        <span class="text-sm text-gray-600">ログインでお困りの方は</span>
        <a href="{base}/help" class="text-sm text-green-600 hover:text-green-800 font-medium">こちら</a>
      </div>
    </form>
  </div>
</div>
