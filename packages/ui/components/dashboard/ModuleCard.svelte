<!-- 
  ModuleCard.svelte - モジュールカードコンポーネント
  
  このコンポーネントは、ダッシュボードに表示される各モジュールのカードを提供します。
  プロパティ:
  - title: モジュールのタイトル
  - description: モジュールの説明
  - icon: モジュールのアイコンURL
  - status: モジュールのステータス（オプション）
  - actionText: アクションボタンのテキスト（オプション）
-->
<script>
  // プロパティ定義
  export let title = '';
  export let description = '';
  export let icon = '';
  export let status = '';
  export let actionText = '開始';
  
  // イベント処理
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function handleAction() {
    dispatch('action');
  }
</script>

<div class="module-card">
  <div class="card-header">
    <div class="icon-container">
      <img src={icon} alt={title} class="module-icon" />
    </div>
    <div class="title-container">
      <h3 class="module-title">{title}</h3>
      {#if status}
        <span class="module-status">{status}</span>
      {/if}
    </div>
  </div>
  
  <div class="card-body">
    <p class="module-description">{description}</p>
  </div>
  
  <div class="card-footer">
    <button class="action-button" on:click={handleAction}>
      {actionText}
    </button>
  </div>
</div>

<style>
  .module-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-bottom: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .module-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: #f0f8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }
  
  .module-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
  
  .title-container {
    flex: 1;
  }
  
  .module-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .module-status {
    font-size: 12px;
    color: #2E7D32;
    background-color: #E8F5E9;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    margin-top: 4px;
  }
  
  .card-body {
    margin-bottom: 16px;
  }
  
  .module-description {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }
  
  .card-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .action-button {
    background-color: #2E7D32;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .action-button:hover {
    background-color: #1B5E20;
  }
  
  /* モバイル向けスタイル調整 */
  @media (max-width: 768px) {
    .module-card {
      padding: 12px;
    }
    
    .icon-container {
      width: 40px;
      height: 40px;
    }
    
    .module-icon {
      width: 24px;
      height: 24px;
    }
    
    .module-title {
      font-size: 15px;
    }
    
    .module-description {
      font-size: 13px;
    }
    
    .action-button {
      padding: 6px 12px;
      font-size: 13px;
    }
  }
</style>
