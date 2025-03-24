<script>
  import LoginForm from '../../components/auth/LoginForm.svelte';
</script>

<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #FAFAFA; padding: 1rem; width: 100%;">
  <LoginForm />
</div>

<style>
  /* メディアクエリのスタイルは残します */
  @media (max-width: 768px) {
    :global(.login-page) {
      background-color: white;
    }
  }
</style>
