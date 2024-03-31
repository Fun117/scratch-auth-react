'use client'

import { ScratchAuthCookie_eraseEncryptedData, ScratchAuthCookie_getDecryptedSessionId, ScratchAuthCookie_setEncryptedData } from "./cookie/clientUtils";
import { ScratchAuth_verifyToken } from "./cookie/serverUtils";

// import path from 'path';
// ルートディレクトリからの相対パスを作成する
// const configFilePath = path.resolve(process.cwd(), 'scratch-auth.config.ts');

const config = require(`/scratch-auth.config.ts`).default;
const redirectUrl = config.redirect_url!;
if (!redirectUrl) {
    throw new Error('redirect_url is not defined!');
}
let title = config.title;
if (!title) {
    title=`Scratch Auth`;
}
let expiration = config.expiration;
if (!expiration) {
    expiration=30;
}

export async function ScratchAuthGET_session() {
    try {
        const session = await ScratchAuthCookie_getDecryptedSessionId('scratchauth-session');
        return session;
    } catch (error) {
        console.error('ScratchAuthSET_session Error:', error);
        return null;
    }
}

export async function ScratchAuthSET_session(privateCode: null | string) {
    try {
        if(privateCode){
            const res = await ScratchAuth_verifyToken(privateCode);
            if(res){
                const obj = JSON.parse(res);
                await ScratchAuthCookie_setEncryptedData('scratchauth-session', obj.data.username, expiration);
                return true;
            }
        } else {
            console.warn('ScratchAuthSET_session: privateCode = null');
        }
        return false;
    } catch (error) {
        console.error('ScratchAuthSET_session Error:', error);
        return false;
    }
}

export function ScratchAuth_Login() {
    try {
        const redirectLocation = btoa(redirectUrl); // Base64 encoded

        let session;

        // 関数宣言を関数式に変換
        const aw = async () => {
            session = await ScratchAuthGET_session(); // ログイン状態を確認するためにセッションを取得
        };

        aw(); // 関数呼び出しをここで行う

        if (session) {
            return false; // ログイン済みの場合はログインページにリダイレクトしない
        }

        if (typeof window !== 'undefined') {
            window.location.href = `https://auth.itinerary.eu.org/auth/?redirect=${redirectLocation}&name=${title}`;
        }
        return true;
    } catch (error) {
        console.error('ScratchAuth_Login Error:', error);
        return false;
    }
}

export function ScratchAuth_Logout() {
    try {
        ScratchAuthCookie_eraseEncryptedData('scratchauth-session');
        if (typeof window !== 'undefined') {
            window.location.href = `/`;
        }
        return true;
    } catch (error) {
        console.error('ScratchAuth_Logout Error:', error);
        return false;
    }
}