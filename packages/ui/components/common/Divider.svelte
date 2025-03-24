<script>
  // 区切り線のプロパティ
  export let text = "";
  export let color = "#E0E0E0";
  export let width = "85%";
  export let margin = "my-4";
</script>

{#if text}
  <div class="flex items-center {margin}">
    <div class="flex-grow border-t border-{color}" style="width: calc({width} / 2);"></div>
    <span class="mx-4 text-sm text-gray-500">{text}</span>
    <div class="flex-grow border-t border-{color}" style="width: calc({width} / 2);"></div>
  </div>
{:else}
  <div class="border-t border-{color} {margin}" style="width: {width}; margin-left: auto; margin-right: auto;"></div>
{/if}
