// src/components/scratch-auth-ts/cookie/serverUtils.ts

'use server';

import crypto from 'crypto';

const secretKey = process.env.SCRATCH_AUTH_COOKIE_SECRET_KEY!; // Non-null assertion operator (!) を使用して undefined でないことを明示
// SCRATCH_AUTH_COOKIE_SECRET_KEYが未定義の場合にエラーを出力
if (!secretKey) {
    throw new Error('SCRATCH_AUTH_COOKIE_SECRET_KEY is not defined!');
}

const config = require(`/scratch-auth.config.ts`).default;
const redirectUrl = config.redirect_url!;
if (!redirectUrl) {
    throw new Error('redirect_url is not defined!');
}

// HMACを計算する関数
export async function ScratchAuthCookie_calculateHmac(text: string): Promise<string> {
    return crypto.createHmac('sha256', secretKey).update(text).digest('hex');
}

export async function ScratchAuth_verifyToken(privateCode: string): Promise<any> {
    try {
        const res = await fetch(`https://auth.itinerary.eu.org/api/auth/verifyToken?privateCode=${privateCode}`);
        const data = await res.json();
        
        if (data.valid === true && data.redirect === redirectUrl) {
            let sessionId = crypto.randomUUID();
            return JSON.stringify({ sessionId, data });
        }
    } catch (error) {
        console.error("ScratchAuth_verifyToken Error:", error);
    }
    return undefined;
}