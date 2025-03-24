<script>
  // テキスト入力のプロパティ
  export let id = "";
  export let label = "";
  export let value = "";
  export let type = "text";
  export let placeholder = "";
  export let required = false;
  export let disabled = false;
  export let error = "";
  export let fullWidth = true;

  // 内部状態
  let focused = false;
  
  // フォーカス状態の管理
  function handleFocus() {
    focused = true;
  }
  
  function handleBlur() {
    focused = false;
  }
</script>

<div class={fullWidth ? "w-full" : ""}>
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  
  <!-- 各input typeごとに別々の要素を用意して条件分岐 -->
  {#if type === "text"}
    <input
      {id}
      type="text"
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input-field"
      class:input-focused={focused}
      class:input-error={!!error}
      class:input-disabled={disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {:else if type === "email"}
    <input
      {id}
      type="email"
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input-field"
      class:input-focused={focused}
      class:input-error={!!error}
      class:input-disabled={disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {:else if type === "number"}
    <input
      {id}
      type="number"
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input-field"
      class:input-focused={focused}
      class:input-error={!!error}
      class:input-disabled={disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {:else if type === "tel"}
    <input
      {id}
      type="tel"
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input-field"
      class:input-focused={focused}
      class:input-error={!!error}
      class:input-disabled={disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {:else if type === "password"}
    <input
      {id}
      type="password"
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input-field"
      class:input-focused={focused}
      class:input-error={!!error}
      class:input-disabled={disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {:else if type === "date"}
    <input
      {id}
      type="date"
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input-field"
      class:input-focused={focused}
      class:input-error={!!error}
      class:input-disabled={disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {:else}
    <!-- デフォルトはテキスト入力 -->
    <input
      {id}
      type="text"
      {placeholder}
      {required}
      {disabled}
      bind:value
      class="input-field"
      class:input-focused={focused}
      class:input-error={!!error}
      class:input-disabled={disabled}
      on:focus={handleFocus}
      on:blur={handleBlur}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {/if}
  
  {#if error}
    <div id="{id}-error" class="error-text">{error}</div>
  {/if}
</div>

<style>
  .w-full {
    width: 100%;
  }
  
  .input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4B5563;
    margin-bottom: 0.25rem;
  }
  
  .input-field {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #F5F5F5;
    border: 1px solid transparent;
    transition: all 200ms ease-in-out;
  }
  
  .input-field:focus, .input-focused {
    background-color: white;
    border: 1px solid #E0E0E0;
    transform: scale(1.01);
    outline: none;
  }
  
  .input-error {
    background-color: #FFF8F8;
    border: 1px solid #FF5252;
  }
  
  .input-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error-text {
    color: #D32F2F;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
</style>
