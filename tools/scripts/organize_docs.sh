#!/bin/bash

# 作業ディレクトリ
cd /Users/ancient0328/Development/HugMeDo/documents/guides/Svelte5-SvelteKit2

# ディレクトリ作成
mkdir -p 00-introduction 01-svelte5 02-sveltekit2-basics 03-sveltekit2-server 04-sveltekit2-client 04-websockets 05-sveltekit2-advanced 06-testing 07-deployment 08-project-specific

# 00-introduction - 導入と基本情報
mv 01-introduction.md 00-introduction/
mv 05-migration-guide.md 00-introduction/
mv 06-pnpm-workspace-guide.md 00-introduction/
mv README.md 00-introduction/

# 01-svelte5 - Svelte 5関連
mv 02-svelte5-basics.md 01-svelte5/
mv 07-svelte5-runes-complete.md 01-svelte5/
mv 08-svelte5-components-complete.md 01-svelte5/
mv 16-svelte5-advanced-features.md 01-svelte5/

# 02-sveltekit2-basics - SvelteKit 2の基本
mv 03-sveltekit2-basics.md 02-sveltekit2-basics/
mv 04-advanced-usage.md 02-sveltekit2-basics/
mv 09-sveltekit2-routing-complete.md 02-sveltekit2-basics/

# 03-sveltekit2-server - サーバーサイド
mv 10-sveltekit2-server-side-part1.md 03-sveltekit2-server/
mv 10-sveltekit2-server-side-part2.md 03-sveltekit2-server/
mv 12-sveltekit2-form-actions.md 03-sveltekit2-server/
mv 13-sveltekit2-middleware-hooks.md 03-sveltekit2-server/

# 04-sveltekit2-client - クライアントサイド
mv 11-sveltekit2-client-side-part1.md 04-sveltekit2-client/
mv 11-sveltekit2-client-side-part2.md 04-sveltekit2-client/
mv 11-sveltekit2-client-side-part3.md 04-sveltekit2-client/
mv 11-sveltekit2-client-side-part4.md 04-sveltekit2-client/
mv 11-sveltekit2-client-side-part5.md 04-sveltekit2-client/
mv 11-sveltekit2-client-side-part6a-localstorage.md 04-sveltekit2-client/
mv 11-sveltekit2-client-side-part6b-sessionstorage.md 04-sveltekit2-client/

# 04-websockets - WebSockets関連
mv 11-sveltekit2-client-side-part6c-websockets-*.md 04-websockets/

# 05-sveltekit2-advanced - 高度な機能
mv 14-sveltekit2-error-handling.md 05-sveltekit2-advanced/
mv 15-sveltekit2-adapters.md 05-sveltekit2-advanced/
mv 17-sveltekit2-i18n-accessibility.md 05-sveltekit2-advanced/

# 06-testing - テスト関連
mv 18-sveltekit2-testing.md 06-testing/
mv 18a-hugmedo-testing-guide.md 06-testing/

echo "ファイル整理が完了しました。"
