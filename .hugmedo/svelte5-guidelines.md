# Svelte 5 ガイドライン

## イベント構文変換ガイド

### 変換方向
- **古い構文**: `on:event={handler}`
- **新しい構文**: `onevent={handler}`

### 具体例
| 古い構文 | 新しい構文 |
|---------|-----------|
| `<form on:submit={handleSubmit}>` | `<form onsubmit={handleSubmit}>` |
| `<button on:click={handleClick}>` | `<button onclick={handleClick}>` |
| `<input on:input={handleInput}>` | `<input oninput={handleInput}>` |
| `<select on:change={handleChange}>` | `<select onchange={handleChange}>` |
| `<div on:keydown={handleKeyDown}>` | `<div onkeydown={handleKeyDown}>` |
| `<a on:focus={handleFocus}>` | `<a onfocus={handleFocus}>` |
| `<textarea on:blur={handleBlur}>` | `<textarea onblur={handleBlur}>` |

### 注意事項
- この変換は直感と逆方向であることに注意
- 一般的なフレームワークではディレクティブベース（`on:event`）が新しい傾向だが、Svelte 5では属性ベース（`onevent`）に移行している
- すべてのSvelteコンポーネントで一貫してこの新しい構文を使用する

## イベント修飾子の扱い方

### 修飾子の変更点
- **古い構文**: `on:event|modifier={handler}`（例：`on:click|preventDefault={handler}`）
- **新しい構文**: 修飾子は使用せず、イベントハンドラ内で明示的に処理する

### 正しい変換方法

```svelte
<!-- 古い構文 -->
<a href="/path" on:click|preventDefault={handler}>リンク</a>

<!-- 新しい構文（方法1）- 関数内で明示的に処理 -->
<a href="/path" onclick={handler}>リンク</a>

// handler関数内で
function handler(event) {
  event.preventDefault();
  // 処理
}

<!-- 新しい構文（方法2）- インライン関数で処理 -->
<a href="/path" onclick={(e) => {
  e.preventDefault();
  handler();
}}>リンク</a>
```

### 一般的な修飾子の処理方法

| 古い修飾子 | 新しい処理方法 |
|-----------|--------------|
| `preventDefault` | `event.preventDefault()` |
| `stopPropagation` | `event.stopPropagation()` |
| `capture` | 現在は直接サポートされていない |
| `once` | カスタム実装が必要 |
| `passive` | 現在は直接サポートされていない |

### 注意事項
- 古い構文と新しい構文を混在させることはできない
- すべてのイベントハンドラを新しい構文（`onevent`）に統一する
- イベント修飾子は関数内で明示的に処理する

## 修正前チェックリスト

```
□ 修正対象のファイル内のすべてのイベントハンドラを特定した
□ 変換すべきパターンをリスト化した
□ 変換の方向性（on:event → onevent）を確認した
```

## 修正後チェックリスト

```
□ すべての on:event 構文を onevent に変換した
□ 逆方向の変換（onevent → on:event）を誤って行っていない
□ Lintエラーが示す問題と一致する修正を行った
□ プロジェクトの他の部分との一貫性は保たれている
```

## 正規表現パターン

古い構文を検索するための正規表現：
```
on:(submit|click|input|change|keydown|keyup|keypress|focus|blur)
```

置換パターン：
```
on$1
```

イベント修飾子を検索するための正規表現：
```
on:[^ ]+\|[^ ]+
```

置換パターン：
```
// 手動置換が必要
