<script lang="ts">
  import { base } from '$app/paths';
  
  // Svelte 5のRunes構文を使用
  let userName = $state('ユーザー'); // 仮のユーザー名（認証基盤実装後に実際のユーザー情報を取得）
  
  // モジュールへのリンク
  const modules = $state([
    {
      id: 'ohr',
      name: 'オンライン診療',
      icon: '🩺',
      description: 'ビデオ通話で医師と相談',
      path: '/ohr',
      available: true
    },
    {
      id: 'chat',
      name: 'チャット相談',
      icon: '💬',
      description: '医療スタッフとチャット',
      path: '/chat',
      available: true
    },
    {
      id: 'halca',
      name: 'メンタルチェック',
      icon: '🧠',
      description: '定期的な健康状態の確認',
      path: '/halca',
      available: false
    },
    {
      id: 'hugmemo',
      name: '医療記録',
      icon: '📋',
      description: '診療記録の管理と閲覧',
      path: '/hugmemo',
      available: false
    }
  ]);
  
  // 通知（仮のデータ）
  const notifications = $state([
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
  ]);
  
  // コンポーネントがマウントされたときに実行
  $effect(() => {
    // ここに初期化コードを記述
    console.log('ダッシュボードがマウントされました');
    
    // クリーンアップ関数（コンポーネントが破棄されるときに実行）
    return () => {
      console.log('ダッシュボードがアンマウントされました');
    };
  });
</script>

<svelte:head>
  <title>ダッシュボード | HugMeDo</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- ヘッダー -->
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <img 
          src="/packages/ui/assets/images/hugmedo-frog-logo.svg" 
          alt="HugMeDoロゴ" 
          class="h-10 w-10 mr-2"
        />
        <h1 class="text-xl font-semibold text-gray-900">HugMeDo</h1>
      </div>
      
      <div class="flex items-center">
        <div class="relative mr-4">
          <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {#if notifications.some(n => !n.read)}
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            {/if}
          </button>
        </div>
        
        <div class="flex items-center">
          <span class="text-sm font-medium text-gray-700 mr-2">{userName}さん</span>
          <button class="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800">
            {userName.charAt(0)}
          </button>
        </div>
      </div>
    </div>
  </header>
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- ウェルカムメッセージ -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">こんにちは、{userName}さん</h2>
      <p class="text-gray-600">HugMeDoへようこそ。健康管理をサポートします。</p>
    </div>
    
    <!-- モジュールグリッド -->
    <h3 class="text-lg font-medium text-gray-900 mb-4">サービス一覧</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {#each modules as module}
        <a 
          href={module.available ? `${base}${module.path}` : '#'} 
          class={`block bg-white rounded-lg shadow overflow-hidden transition-transform duration-200 ${module.available ? 'hover:scale-105' : 'opacity-60 cursor-not-allowed'}`}
        >
          <div class="p-6">
            <div class="text-3xl mb-3">{module.icon}</div>
            <h4 class="text-lg font-medium text-gray-900 mb-1">{module.name}</h4>
            <p class="text-sm text-gray-600">{module.description}</p>
            {#if !module.available}
              <span class="inline-block mt-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                準備中
              </span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
    
    <!-- 通知セクション -->
    <h3 class="text-lg font-medium text-gray-900 mb-4">最近の通知</h3>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      {#if notifications.length > 0}
        <ul class="divide-y divide-gray-200">
          {#each notifications as notification}
            <li class={`p-4 ${!notification.read ? 'bg-green-50' : ''}`}>
              <div class="flex justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">{notification.title}</h4>
                  <p class="text-sm text-gray-600">{notification.message}</p>
                </div>
                <span class="text-xs text-gray-500">{notification.date}</span>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="p-4 text-center text-gray-500">
          通知はありません
        </div>
      {/if}
    </div>
  </main>
</div>
