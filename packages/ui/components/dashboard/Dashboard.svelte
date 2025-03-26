<!-- 
  Dashboard.svelte - ダッシュボードの共通コンポーネント
  
  このコンポーネントは、モバイルとWebの両方で使用できる基本的なダッシュボード構造を提供します。
  プロパティ:
  - modules: 表示するモジュールの配列
  - activeModule: 現在アクティブなモジュール
  - isMobile: モバイル表示かどうか
-->
<script>
  import { createEventDispatcher } from 'svelte';
  
  // プロパティ定義
  export let modules = [];
  export let activeModule = '';
  export let isMobile = false;
  
  // 現在選択されているモジュールを追跡するための状態
  let currentModule = activeModule;
  
  // イベントディスパッチャー
  const dispatch = createEventDispatcher();
  
  // モジュール選択ハンドラー
  function handleModuleSelect(moduleId) {
    currentModule = moduleId;
    dispatch('moduleSelect', { moduleId });
  }
  
  // activeModuleの変更を監視
  $: currentModule = activeModule;
</script>

<div class="dashboard-container">
  <!-- モバイル向けのストーリーバーナビゲーション -->
  {#if isMobile}
    <div class="story-bar">
      {#each modules as module}
        <button 
          class="story-item {currentModule === module.id ? 'active' : ''}"
          on:click={() => handleModuleSelect(module.id)}
          aria-label={module.name}
        >
          <div class="story-avatar">
            <img src={module.icon} alt={module.name} />
          </div>
          <span class="story-name">{module.name}</span>
        </button>
      {/each}
    </div>
  {:else}
    <!-- Web向けのサイドナビゲーション -->
    <div class="side-nav">
      <div class="nav-header">
        <div class="logo-container">
          <img src="/images/hugmedo-frog-logo.svg" alt="HugMeDo" width="40" height="40" />
          <span class="logo-text">HugMeDo</span>
        </div>
      </div>
      <nav class="module-nav">
        {#each modules as module}
          <button 
            class="nav-item {currentModule === module.id ? 'active' : ''}"
            on:click={() => handleModuleSelect(module.id)}
          >
            <img src={module.icon} alt="" class="nav-icon" />
            <span class="nav-text">{module.name}</span>
          </button>
        {/each}
      </nav>
    </div>
  {/if}
  
  <!-- コンテンツエリア -->
  <div class="content-area">
    <slot />
  </div>
</div>

<style>
  .dashboard-container {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  
  /* モバイル向けストーリーバー */
  .story-bar {
    display: flex;
    overflow-x: auto;
    padding: 10px 5px;
    background-color: white;
    border-bottom: 1px solid #f0f0f0;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .story-bar::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  .story-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
  }
  
  .story-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .story-item.active .story-avatar {
    background: linear-gradient(45deg, #2E7D32, #388E3C, #43A047);
  }
  
  .story-avatar img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 2px solid white;
    object-fit: cover;
  }
  
  .story-name {
    font-size: 12px;
    color: #262626;
    max-width: 64px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Web向けサイドナビゲーション */
  .side-nav {
    width: 240px;
    height: 100vh;
    background-color: white;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
  }
  
  .nav-header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
  }
  
  .logo-text {
    font-size: 18px;
    font-weight: 600;
    margin-left: 10px;
  }
  
  .module-nav {
    display: flex;
    flex-direction: column;
    padding: 15px 0;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s;
  }
  
  .nav-item:hover {
    background-color: #f9f9f9;
  }
  
  .nav-item.active {
    background-color: #f0f8f0;
    border-left: 3px solid #2E7D32;
  }
  
  .nav-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  
  .nav-text {
    font-size: 14px;
    color: #262626;
  }
  
  /* コンテンツエリア */
  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #fafafa;
  }
  
  /* モバイル向けレイアウト調整 */
  @media (max-width: 768px) {
    .dashboard-container {
      flex-direction: column;
    }
    
    .content-area {
      margin-top: 100px; /* ストーリーバーの高さ + 余白 */
      padding: 10px;
    }
  }
</style>
