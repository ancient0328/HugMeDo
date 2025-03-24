#!/usr/bin/env node

/**
 * Svelte 5イベント構文チェックスクリプト
 * 
 * このスクリプトは、プロジェクト内のSvelteファイルをスキャンし、
 * 古いイベント構文（on:event）を検出します。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 検索対象のディレクトリ
const targetDirs = [
  'apps/mobile/src',
  'apps/web/src',
  'packages/ui/src'
];

// イベント名のリスト
const eventNames = [
  'submit', 'click', 'input', 'change', 'keydown', 'keyup', 
  'keypress', 'focus', 'blur', 'mouseenter', 'mouseleave'
];

// 古い構文のパターン
const oldSyntaxPattern = new RegExp(`on:(${eventNames.join('|')})`, 'g');

// 結果を保存する配列
const results = [];

// ディレクトリ内のSvelteファイルを再帰的に検索
function scanDirectory(dir) {
  const fullPath = path.join(process.cwd(), dir);
  
  try {
    const files = fs.readdirSync(fullPath);
    
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(path.join(dir, file));
      } else if (file.endsWith('.svelte')) {
        checkFile(path.join(dir, file));
      }
    }
  } catch (error) {
    console.error(`ディレクトリのスキャン中にエラーが発生しました: ${dir}`, error);
  }
}

// ファイル内の古い構文をチェック
function checkFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    
    let lineNumber = 1;
    for (const line of lines) {
      const matches = [...line.matchAll(oldSyntaxPattern)];
      
      if (matches.length > 0) {
        for (const match of matches) {
          results.push({
            file: filePath,
            line: lineNumber,
            content: line.trim(),
            event: match[0],
            suggestion: `on${match[1]}`
          });
        }
      }
      
      lineNumber++;
    }
  } catch (error) {
    console.error(`ファイルの読み込み中にエラーが発生しました: ${filePath}`, error);
  }
}

// メイン処理
function main() {
  console.log('Svelte 5イベント構文チェックを開始します...');
  
  for (const dir of targetDirs) {
    scanDirectory(dir);
  }
  
  if (results.length === 0) {
    console.log('✅ 古いイベント構文は見つかりませんでした。');
  } else {
    console.log(`❌ ${results.length}個の古いイベント構文が見つかりました：\n`);
    
    for (const result of results) {
      console.log(`ファイル: ${result.file}`);
      console.log(`行: ${result.line}`);
      console.log(`内容: ${result.content}`);
      console.log(`修正案: ${result.event} → ${result.suggestion}`);
      console.log('---');
    }
    
    console.log('\n修正方法:');
    console.log('1. 各ファイルを手動で開いて修正する');
    console.log('2. 以下のコマンドで一括置換する（注意: バックアップを取ってから実行してください）:');
    
    for (const dir of targetDirs) {
      console.log(`   find ${dir} -name "*.svelte" -exec sed -i '' 's/on:\\(${eventNames.join('\\|')}\\)/on\\1/g' {} \\;`);
    }
  }
}

main();
