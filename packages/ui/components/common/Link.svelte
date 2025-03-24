<script>
  // リンクのプロパティ
  export let href = "#";
  export let variant = "default"; // default, accent, primary
  export let external = false;
  export let underline = false;
  
  // クラスの計算
  $: variantClass = {
    default: "text-[#0288D1]",
    accent: "text-[#0288D1] font-medium",
    primary: "text-[#2E7D32]"
  }[variant];
  
  $: underlineClass = underline ? "underline" : "no-underline hover:underline";
  $: transitionClass = "transition-all duration-200 ease-in-out";
  
  // 外部リンクの場合の属性
  $: externalAttrs = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
</script>

<a
  {href}
  class="{variantClass} {underlineClass} {transitionClass} cursor-pointer hover:text-[#01579B] active:opacity-80"
  {...externalAttrs}
  on:click
>
  <slot />
</a>
