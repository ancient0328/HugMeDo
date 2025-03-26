// UIコンポーネントのエントリーポイント
// 各コンポーネントをエクスポートして、アプリケーションから簡単にインポートできるようにする

// ストアのエクスポート
export { authStore } from './stores/auth';

// サービスのエクスポート
export { cognitoAuthService } from './services/cognito-auth';

// コンポーネントのエクスポート
// 注意: Svelteコンポーネントは直接エクスポートできないため、
// インポート側で以下のパスを使用してください:
// import LoginForm from '@hugmedo/ui/components/auth/LoginForm.svelte';
// import PasswordInput from '@hugmedo/ui/components/auth/PasswordInput.svelte';
// import Button from '@hugmedo/ui/components/common/Button.svelte';
// import TextInput from '@hugmedo/ui/components/common/TextInput.svelte';
// import Link from '@hugmedo/ui/components/common/Link.svelte';
// import Logo from '@hugmedo/ui/components/branding/Logo.svelte';
// import Dashboard from '@hugmedo/ui/components/dashboard/Dashboard.svelte';
// import ModuleCard from '@hugmedo/ui/components/dashboard/ModuleCard.svelte';
// import LoginPage from '@hugmedo/ui/pages/auth/Login.svelte';
