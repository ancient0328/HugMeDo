<script lang="ts">
  import { Dashboard, ModuleCard } from '@hugmedo/ui';
  
  // モジュールデータ
  interface Module {
    id: string;
    name: string;
    icon: string;
    description: string;
    status: string;
    actionText?: string;
  }
  
  const modules: Module[] = [
    {
      id: 'ohr',
      name: 'OHR',
      icon: '/images/modules/ohr-icon.svg',
      description: 'オンライン診療モジュール。ビデオ通話を使って医師と直接相談できます。',
      status: '利用可能'
    },
    {
      id: 'chat',
      name: 'チャット',
      icon: '/images/modules/chat-icon.svg',
      description: '医療スタッフとのリアルタイムチャット。簡単な質問や相談ができます。',
      status: '利用可能'
    },
    {
      id: 'halca',
      name: 'HALCA',
      icon: '/images/modules/halca-icon.svg',
      description: 'メンタルヘルスチェック。定期的な健康状態の確認ができます。',
      status: '開発中'
    },
    {
      id: 'hugmemo',
      name: 'Hugmemo',
      icon: '/images/modules/hugmemo-icon.svg',
      description: '医療記録管理。診療履歴や処方箋を確認できます。',
      status: '開発中'
    }
  ];
  
  // アクティブなモジュール
  let activeModule = 'ohr';
  
  // モジュール選択ハンドラー
  function handleModuleSelect(event: { detail: { moduleId: string } }): void {
    activeModule = event.detail.moduleId;
  }
  
  // モジュールアクションハンドラー
  function handleModuleAction(moduleId: string): void {
    // モジュールに応じたアクションを実行
    console.log(`モジュール ${moduleId} のアクションを実行`);
    
    // 対応するページに遷移
    if (moduleId === 'ohr') {
      // OHRモジュールページに遷移
    } else if (moduleId === 'chat') {
      // チャットモジュールページに遷移
    }
  }
</script>

<svelte:head>
  <title>HugMeDo - ダッシュボード</title>
</svelte:head>

<div class="dashboard-page">
  <Dashboard 
    modules={modules} 
    activeModule={activeModule} 
    isMobile={true}
    on:moduleSelect={handleModuleSelect}
  >
    <div class="module-content">
      <h1 class="page-title">ダッシュボード</h1>
      
      <div class="modules-grid">
        {#each modules as module}
          <ModuleCard
            title={module.name}
            description={module.description}
            icon={module.icon}
            status={module.status}
            actionText={module.status === '利用可能' ? '開始' : '詳細'}
            on:action={() => handleModuleAction(module.id)}
          />
        {/each}
      </div>
    </div>
  </Dashboard>
</div>

<style>
  .dashboard-page {
    width: 100%;
    min-height: 100vh;
    background-color: #f9f9f9;
  }
  
  .module-content {
    padding: 16px;
    margin-top: 80px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
  }
  
  .modules-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  @media (min-width: 640px) {
    .modules-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
