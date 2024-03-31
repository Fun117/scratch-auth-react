'use client';

import { v4 as uuidv4 } from 'uuid';
import { ScratchAuthCookie_calculateHmac } from './serverUtils';

// セッションIDを生成する関数
export function ScratchAuthCookie_generateSessionId(): string {
    return uuidv4(); // ランダムなセッションIDを生成
}

// データをセッションに保存する関数
export async function   ScratchAuthCookie_setEncryptedData(content: string, value: string, days: number) {
    const hmac = await ScratchAuthCookie_calculateHmac(value); // データに対してHMACを計算
    const encryptedValue = ScratchAuthCookie_encrypt(value + '|' + hmac); // データとHMACを結合し、暗号化
    const expires = new Date();
    if (days === -1) {
        // 日数が-1の場合、有効期限を遠い未来に設定（例：200年後）
        expires.setFullYear(expires.getFullYear() + 200);
    } else {
        // それ以外の場合、指定された日数後に期限切れにする
        expires.setDate(expires.getDate() + days);
    }
    document.cookie = `${content}=${encryptedValue};expires=${expires.toUTCString()};path=/`;
}

// セッションからデータを削除する関数
export function ScratchAuthCookie_eraseEncryptedData(content: string) {
    ScratchAuthCookie_eraseCookie(content); // Cookieからデータを削除
}

// 文字列を暗号化する関数
export function ScratchAuthCookie_encrypt(text: string): string {
    // ここに暗号化の処理を追加（例：Base64エンコーディング）
    return Buffer.from(text).toString('base64');
}

// 文字列を復号化する関数
export function ScratchAuthCookie_decrypt(text: string): string {
    // ここに復号化の処理を追加（例：Base64デコーディング）
    return Buffer.from(text, 'base64').toString();
}

// Cookieから値を削除する関数
export function ScratchAuthCookie_eraseCookie(content: string) {
    document.cookie = `${content}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Cookieから値を取得する関数
export function ScratchAuthCookie_getCookie(content: string) {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split('=');
        if (content === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// CookieからセッションIDを取得し、検証してから復号化する関数
export async function ScratchAuthCookie_getDecryptedSessionId(content: string): Promise<string | null> {
    const encryptedValue = ScratchAuthCookie_getCookie(content); // Cookieから値を取得
    if (encryptedValue) {
        const [sessionId, hmac] = ScratchAuthCookie_decrypt(encryptedValue).split('|'); // セッションIDとHMACに分割
        const calculatedHmac = await ScratchAuthCookie_calculateHmac(sessionId); // HMACを再計算
        if (calculatedHmac === hmac) { // HMACを再計算して検証
            return sessionId; // 検証が成功した場合はセッションIDを返す
        } else {
            ScratchAuthCookie_eraseCookie(content); // 検証が失敗した場合はセッションを削除
        }
    }
    return null;
}

// セッションIDを生成し、HMACを付加してから暗号化してCookieに保存する関数
export async function ScratchAuthCookie_setEncryptedSessionId(content: string, value: string, days: number) {
    const sessionId = ScratchAuthCookie_generateSessionId(); // セッションIDを生成
    const hmac = await ScratchAuthCookie_calculateHmac(sessionId); // HMACを計算
    const sessionData = sessionId + '|' + hmac; // セッションIDとHMACを結合
    const encryptedValue = ScratchAuthCookie_encrypt(sessionData); // セッションIDとHMACを暗号化
    const expires = new Date();
    if (days === -1) {
        // 日数が-1の場合、有効期限を遠い未来に設定（例：200年後）
        expires.setFullYear(expires.getFullYear() + 200);
    } else {
        // それ以外の場合、指定された日数後に期限切れにする
        expires.setDate(expires.getDate() + days);
    }
    document.cookie = `${content}=${encryptedValue};expires=${expires.toUTCString()};path=/`;
}
