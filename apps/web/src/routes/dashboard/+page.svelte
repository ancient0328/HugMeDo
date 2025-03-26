<script lang="ts">
  import { base } from '$app/paths';
  import { Dashboard, ModuleCard } from '@hugmedo/ui';
  
  // アクティブなモジュール
  let activeModule = 'ohr';
  
  // モジュールデータ
  interface Module {
    id: string;
    name: string;
    icon: string;
    description: string;
    path: string;
    available: boolean;
  }
  
  const modules: Module[] = [
    {
      id: 'ohr',
      name: 'オンライン診療',
      icon: '/images/modules/ohr-icon.svg',
      description: 'ビデオ通話で医師と相談',
      path: '/ohr',
      available: true
    },
    {
      id: 'chat',
      name: 'チャット相談',
      icon: '/images/modules/chat-icon.svg',
      description: '医療スタッフとチャット',
      path: '/chat',
      available: true
    },
    {
      id: 'halca',
      name: 'メンタルチェック',
      icon: '/images/modules/halca-icon.svg',
      description: '定期的な健康状態の確認',
      path: '/halca',
      available: false
    },
    {
      id: 'hugmemo',
      name: '医療記録',
      icon: '/images/modules/hugmemo-icon.svg',
      description: '診療記録の管理と閲覧',
      path: '/hugmemo',
      available: false
    }
  ];
  
  // ユーザー名（認証基盤実装後に実際のユーザー情報を取得）
  let userName = 'ユーザー';
  
  // 通知（仮のデータ）
  interface Notification {
    id: number;
    title: string;
    message: string;
    date: string;
    read: boolean;
  }
  
  const notifications: Notification[] = [
    {
      id: 1,
      title: '次回の診察予約',
      message: '明日 15:00 に山田医師との予約があります',
      date: '2025-03-24',
      read: false
    },
    {
      id: 2,
      title: '新しいメッセージ',
      message: '看護師の佐藤さんからメッセージが届いています',
      date: '2025-03-22',
      read: true
    }
  ];
  
  // モジュール選択ハンドラー
  function handleModuleSelect(event: { detail: { moduleId: string } }): void {
    activeModule = event.detail.moduleId;
  }
  
  // モジュールアクションハンドラー
  function handleModuleAction(moduleId: string): void {
    // 対応するページに遷移
    const module = modules.find(m => m.id === moduleId);
    if (module && module.available) {
      window.location.href = `${base}${module.path}`;
    }
  }
</script>

<svelte:head>
  <title>ダッシュボード | HugMeDo</title>
</svelte:head>

<Dashboard 
  modules={modules} 
  activeModule={activeModule} 
  isMobile={false}
  on:moduleSelect={handleModuleSelect}
>
  <div class="dashboard-content">
    <!-- ウェルカムメッセージ -->
    <div class="welcome-card">
      <h2 class="welcome-title">こんにちは、{userName}さん</h2>
      <p class="welcome-text">HugMeDoへようこそ。健康管理をサポートします。</p>
    </div>
    
    <!-- モジュールグリッド -->
    <h3 class="section-title">サービス一覧</h3>
    <div class="modules-grid">
      {#each modules as module}
        <ModuleCard
          title={module.name}
          description={module.description}
          icon={module.icon}
          status={module.available ? '利用可能' : '準備中'}
          actionText={module.available ? '開始' : '詳細'}
          on:action={() => handleModuleAction(module.id)}
        />
      {/each}
    </div>
    
    <!-- 通知セクション -->
    <h3 class="section-title">最近の通知</h3>
    <div class="notifications-card">
      {#if notifications.length > 0}
        <ul class="notifications-list">
          {#each notifications as notification}
            <li class={`notification-item ${!notification.read ? 'unread' : ''}`}>
              <div class="notification-content">
                <div>
                  <h4 class="notification-title">{notification.title}</h4>
                  <p class="notification-message">{notification.message}</p>
                </div>
                <span class="notification-date">{notification.date}</span>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="no-notifications">
          通知はありません
        </div>
      {/if}
    </div>
  </div>
</Dashboard>

<style>
  .dashboard-content {
    padding: 24px;
  }
  
  .welcome-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 32px;
  }
  
  .welcome-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  .welcome-text {
    color: #666;
    font-size: 16px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
  }
  
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .notifications-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .notifications-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .notification-item {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .notification-item:last-child {
    border-bottom: none;
  }
  
  .notification-item.unread {
    background-color: #e8f5e9;
  }
  
  .notification-content {
    display: flex;
    justify-content: space-between;
  }
  
  .notification-title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin: 0 0 4px 0;
  }
  
  .notification-message {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
  
  .notification-date {
    font-size: 12px;
    color: #999;
  }
  
  .no-notifications {
    padding: 24px;
    text-align: center;
    color: #999;
  }
</style>
