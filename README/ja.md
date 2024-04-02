<h1 align="center">
  <img alt="Logo" src="https://github.com/Fun117/scratch-auth-react/blob/main/public/scratchauth_100x100.png" />
  
  Scratch Auth for React
  <div align="center">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/fun117/scratch-auth-react?&style=social">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/fun117/scratch-auth-react?&style=social">
    <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/fun117/scratch-auth-react?&style=social">
  </div>
  <div align="center">
    <a href="https://zenn.dev/fun117/articles/3ff97f8952a44f">
      <img alt="Static Badge" src="https://img.shields.io/badge/Zenn-article?style=flat-square&color=blue">
    </a>
    <a href="https://github.com/Fun117/scratch-auth-react/issues">
      <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/fun117/scratch-auth-react?&style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/scratch-auth-react?activeTab=versions">
      <img alt="NPM Version" src="https://img.shields.io/npm/v/scratch-auth-react?style=flat-square">
    </a>
    <a href="https://github.com/Fun117/scratch-auth-react/blob/main/LICENSE.txt">
      <img alt="GitHub License" src="https://img.shields.io/github/license/fun117/scratch-auth-react?&style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/scratch-auth-react">
      <img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/scratch-auth-react?&style=flat-square">
    </a>
  </div>
</h1>

# はじめに
Scratch AuthはScratch用のシンプルなOAuthサービスです。開発者にはわかりやすいAPIを、エンドユーザーにはスムーズなログイン体験を提供します。`scratch-auth-react`を使うことで更に簡単にOAuth機能をサイトに実装することができます。

このガイドはNext.jsのApprouter,typescriptを使用して解説がされていますが、PagerouterやReactでもあまり変わらないので自分の環境で動作するようにコードを変更して機能するようにしてください。

> [!NOTE]
> ラベルに`pre`、`beta`、`alpha`などが付いているバージョンは安定していない場合があります。問題が発生した場合は、[こちら](https://github.com/Fun117/scratch-auth-react/issues)で報告してください。リリースバージョンの使用をお勧めします。

## インストール

```bash:npm
npm install scratch-auth-react
```
```bash:yarn
yarn add scratch-auth-react
```

## セットアップ

### シークレットキー

Scratch AuthのCookieの署名に使用される秘密鍵を設定します。の値はランダムで長い文字列である必要があります。

```.env:.env.local
SCRATCH_AUTH_COOKIE_SECRET_KEY=あなたの秘密の鍵
```

### 設定
> [!NOTE]
> セットアップファイルはプロジェクトのルートディレクトリに作成する必要があります。このファイルはOAuthのリダイレクトURLを設定するために使用されます。下記のように `scratch-auth.config.ts` という名前で作成してください。

`redirect_url` リダイレクトURL
Webサイトを公開する際に開発環境から本番環境用のURLに変更してください。

`title` デフォルトでは`Scratch Auth`ですが、オプションであなたのタイトルを決めることができます。

`expiration` Sessionの保存期間を設定します。デフォルトでは`30`日です。オプションで保存期間を自由に設定できます。`-1`の場合は保存期間が永久（200年）に設定されます。

```ts:scratch-auth.config.ts
import { ScratchAuth_config } from "scratch-auth-react/src/dist/config"

// セットアップファイル内で必要な設定を行います
const config: ScratchAuth_config = {
  redirect_url: `http://localhost:3000/api/auth`, // 必須
  title: `タイトル`, // オプション
  expiration: 30, // オプション
}

export default config
```

# ページ

Reactなどの基礎知識の補足などはしません。

## ホーム

`await ScratchAuthGET_session()`実行することで、ログインしている場合はユーザー名が返され、それ以外は`null`が返されます。

```tsx:src/app/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { ScratchAuthGET_session, ScratchAuth_Login, ScratchAuth_Logout } from 'scratch-auth-react';

export default function Home() {
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const sessionData = await ScratchAuthGET_session(); // session(ユーザー名)を取得
      setSession(sessionData); // session(ユーザー名)を変数に保存
    };
    getSession();
  }, []);

  return (
      <>
        <div className='flex flex-col gap-3 text-center'>
          {session?
            <>
              <h1>{session}</h1>
              <button onClick={() => ScratchAuth_Logout()}>
                ログアウト
              </button>
            </>:<>
              <button onClick={() => ScratchAuth_Login()}>
                ログイン
              </button> 
            </>
          }
        </div>
      </>
  );
}
```

## 認証

例のコードではNext.jsのuseSearchParamsを使ってパラメーターを取得していますが、privateCodeの値を取得できれば別の方法でも問題ありません。

> [!NOTE]
> [セットアップ](#セットアップ)で設定したリダイレクトURLのページでこの処理を実行する必要があります。

```tsx:src/app/api/auth/page.tsx
/*
 * page.tsx
 * このファイルは、認証ページのコンポーネントです。
 * リダイレクトURLからprivateCodeを取得し、認証処理を行います。
 */

'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { ScratchAuthSET_session } from 'scratch-auth-react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const privateCode = searchParams.get('privateCode');

  useEffect(() => {
    async function auth() {
      await ScratchAuthSET_session(privateCode); //アカウント認証
      if (typeof window !== 'undefined') {
        window.location.href = `/`; //ホーム移動
      }
    }
    auth()
  }, []); //空の依存配列を渡すことで、初回のレンダリング時にのみ実行される

  return (
    <span>処理中...</span>
  );
}
```

https://github.com/Fun117/scratch-auth-react
