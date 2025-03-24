#!/usr/bin/env node

/**
 * HARCA Hooks for Windsurf Cascade
 * 
 * このスクリプトは、Windsurf Cascadeのコード編集前後に自動的に実行される
 * フックを提供し、Svelte 5のイベント構文を確実に正しく変換します。
 */

const fs = require('fs');
const path = require('path');

// イベント名のリスト
const eventNames = [
  'submit', 'click', 'input', 'change', 'keydown', 'keyup', 
  'keypress', 'focus', 'blur', 'mouseenter', 'mouseleave'
];

// 古い構文のパターン
const oldSyntaxPattern = new RegExp(`on:(${eventNames.join('|')})`, 'g');
// 新しい構文のパターン
const newSyntaxPattern = new RegExp(`on(${eventNames.join('|')})`, 'g');

/**
 * 編集前フック - ファイル内の構文パターンを分析
 */
function preEditHook(filePath) {
  if (!filePath.endsWith('.svelte')) {
    return { shouldProceed: true };
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const oldSyntaxMatches = [...content.matchAll(oldSyntaxPattern)];
    const newSyntaxMatches = [...content.matchAll(newSyntaxPattern)];
    
    return {
      shouldProceed: true,
      analysis: {
        oldSyntaxCount: oldSyntaxMatches.length,
        newSyntaxCount: newSyntaxMatches.length,
        conversionDirection: 'on:event → onevent',
        examples: oldSyntaxMatches.slice(0, 3).map(match => ({
          oldSyntax: match[0],
          newSyntax: `on${match[1]}`
        }))
      }
    };
  } catch (error) {
    console.error('プリエディットフック実行中にエラーが発生しました:', error);
    return { shouldProceed: true };
  }
}

/**
 * 編集後フック - 変換が正しい方向に行われたか検証
 */
function postEditHook(filePath, originalContent, newContent) {
  if (!filePath.endsWith('.svelte')) {
    return { isValid: true };
  }
  
  try {
    // 古い構文の出現回数
    const oldSyntaxCountBefore = (originalContent.match(oldSyntaxPattern) || []).length;
    const oldSyntaxCountAfter = (newContent.match(oldSyntaxPattern) || []).length;
    
    // 新しい構文の出現回数
    const newSyntaxCountBefore = (originalContent.match(newSyntaxPattern) || []).length;
    const newSyntaxCountAfter = (newContent.match(newSyntaxPattern) || []).length;
    
    // 正しい方向の変換が行われたか検証
    const correctDirection = 
      oldSyntaxCountAfter <= oldSyntaxCountBefore && // 古い構文が減少または同じ
      newSyntaxCountAfter >= newSyntaxCountBefore;   // 新しい構文が増加または同じ
    
    // 逆方向の変換が行われていないか検証
    const wrongDirection = 
      oldSyntaxCountAfter > oldSyntaxCountBefore && // 古い構文が増加
      newSyntaxCountAfter < newSyntaxCountBefore;   // 新しい構文が減少
    
    return {
      isValid: !wrongDirection,
      analysis: {
        correctDirection,
        wrongDirection,
        oldSyntaxBefore: oldSyntaxCountBefore,
        oldSyntaxAfter: oldSyntaxCountAfter,
        newSyntaxBefore: newSyntaxCountBefore,
        newSyntaxAfter: newSyntaxCountAfter,
        message: wrongDirection 
          ? '⚠️ 警告: 逆方向の変換が検出されました（onevent → on:event）。正しい方向は on:event → onevent です。'
          : '✅ 正しい方向の変換が行われました。'
      }
    };
  } catch (error) {
    console.error('ポストエディットフック実行中にエラーが発生しました:', error);
    return { isValid: true };
  }
}

// エクスポート
module.exports = {
  preEditHook,
  postEditHook
};
