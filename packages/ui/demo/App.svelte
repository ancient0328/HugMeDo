<script>
  import Login from '../pages/auth/Login.svelte';
</script>

<div style="display: flex; min-height: 100vh; width: 100%; background-color: #FAFAFA;">
  <Login />
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Noto Sans JP', 'Roboto', sans-serif;
  }
  
  :global(body) {
    background-color: #FAFAFA;
    color: #212121;
  }
</style>
