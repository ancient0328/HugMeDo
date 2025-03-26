<script>
import { goto } from "$app/navigation";
import { onMount } from "svelte";
import { browser } from "$app/environment";
import { authStore } from "@hugmedo/ui";
// SVGの直接インポートを削除

let isLoading = true;

onMount(async () => {
// トップページにアクセスした場合、認証状態をチェックしてリダイレクト
if (browser) {
try {
// 認証状態をチェック
const isAuthenticated = await authStore.checkAuth();

// 認証状態に応じてリダイレクト先を決定
if (isAuthenticated) {
goto("/dashboard");
} else {
goto("/login");
}
} catch (error) {
console.error("認証チェックエラー:", error);
// エラーが発生した場合もログインページにリダイレクト
goto("/login");
} finally {
isLoading = false;
}
}
});
</script>

<svelte:head>
<title>HugMeDo Mobile</title>
</svelte:head>

<div class="loading-container">
<div class="logo-container">
<img src="/images/hugmedo-frog-logo.svg" alt="HugMeDo カエルロゴ" class="logo-icon" />
</div>
<p>読み込み中...</p>
</div>

<style>
.loading-container {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
height: 100vh;
font-size: 1.2rem;
background-color: #FAFAFA;
}

.logo-container {
margin-bottom: 2rem;
animation: pulse 1.5s infinite ease-in-out;
}

.logo-icon {
width: 100px;
height: 100px;
}

@keyframes pulse {
0% {
transform: scale(1);
opacity: 1;
}
50% {
transform: scale(1.05);
opacity: 0.8;
}
100% {
transform: scale(1);
opacity: 1;
}
}
</style>
