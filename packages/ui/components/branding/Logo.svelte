<script>
  // ロゴのプロパティ
  export let size = "medium"; // small, medium, large
  export let type = "full"; // full, text, icon
  
  // サイズの計算
  let iconSize;
  let textSize;
  
  $: {
    switch(size) {
      case "small":
        iconSize = type === "icon" ? "width: 64px; height: 64px;" : "width: 64px; height: 64px;";
        textSize = "width: 128px; height: auto;";
        break;
      case "large":
        iconSize = type === "icon" ? "width: 128px; height: 128px;" : "width: 100px; height: 100px;";
        textSize = "width: 200px; height: auto;";
        break;
      default: // medium
        iconSize = type === "icon" ? "width: 96px; height: 96px;" : "width: 80px; height: 80px;";
        textSize = "width: 160px; height: auto;";
    }
  }
  
  // アニメーション
  import { onMount } from 'svelte';
  
  let visible = false;
  
  onMount(() => {
    // マウント後にフェードインアニメーションを開始
    setTimeout(() => {
      visible = true;
    }, 100);
  });

  // SVGファイルのパス
  const frogLogoPath = '/images/hugmedo-frog-logo.svg';
  const textLogoPath = '/images/hugmedo-text-logo.svg';
</script>

<div class="logo-container" style="opacity: {visible ? '1' : '0'};">
  {#if type === "full" || type === "icon"}
    <div class="logo-icon">
      <img 
        src={frogLogoPath}
        alt="HugMeDo Frog Logo" 
        style={iconSize}
      />
    </div>
  {/if}
  
  {#if type === "full" || type === "text"}
    <img 
      src={textLogoPath}
      alt="HugMeDo" 
      class="logo-text"
      style={textSize}
    />
  {/if}
</div>

<style>
  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: opacity 500ms ease-in-out;
  }
  
  .logo-icon {
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
  }
  
  .logo-text {
    height: auto;
  }
</style>
