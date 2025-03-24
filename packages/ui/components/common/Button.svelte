<script>
  // ボタンのプロパティ
  export let type = "button";
  export let variant = "primary"; // primary, secondary, outline, text
  export let size = "medium"; // small, medium, large
  export let fullWidth = false;
  export let disabled = false;
  export let loading = false;
  export let onClick = () => {};
  
  // クラスの計算
  let variantClass;
  let sizeClass;
  let widthClass;
  let disabledClass;
  let transitionClass = "transition duration-200 ease-in-out";
  
  // バリアントに基づくスタイル
  $: {
    switch (variant) {
      case "primary":
        variantClass = "bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium rounded-lg";
        break;
      case "secondary":
        variantClass = "bg-[#FF8F00] hover:bg-[#F57C00] text-white font-medium rounded-lg";
        break;
      case "outline":
        variantClass = "bg-transparent border border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] font-medium rounded-lg";
        break;
      case "text":
        variantClass = "bg-transparent text-[#2E7D32] hover:underline font-medium";
        break;
      default:
        variantClass = "bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium rounded-lg";
    }
  }
  
  // サイズに基づくスタイル
  $: {
    switch (size) {
      case "small":
        sizeClass = "py-1 px-3 text-sm";
        break;
      case "large":
        sizeClass = "py-3 px-6 text-lg";
        break;
      default:
        sizeClass = "py-2 px-4 text-base";
    }
  }
  
  // 幅のスタイル
  $: widthClass = fullWidth ? "w-full" : "";
  
  // 無効化状態のスタイル
  $: disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md active:transform active:scale-95";
</script>

<button 
  {type} 
  disabled={disabled || loading} 
  class="{variantClass} {sizeClass} {widthClass} {disabledClass} {transitionClass}"
  on:click={onClick}
>
  {#if loading}
    <span class="inline-block animate-spin mr-2">⟳</span>
  {/if}
  <slot />
</button>
