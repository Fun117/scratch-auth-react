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

[English](https://github.com/fun117/scratch-auth-react/blob/main/README.md) / [日本語](https://github.com/fun117/scratch-auth-react/blob/main/README/ja.md)

# Introduction
Scratch Auth is a simple OAuth service for Scratch. It provides developers with an easy-to-understand API and users with a smooth login experience. By using `scratch-auth-react`, you can easily implement OAuth functionality into your site.

This guide explains the usage using Next.js's Approuter and TypeScript, but it should work similarly in Pagerouter or React, so adjust the code to make it work in your environment.

> [!CAUTION]
> このパッケージは今後サポートをしない為、使用を推奨しません。新たにこのパッケージと同じ様な機能を提供するパッケージを公開する予定で、現在開発中です。

> [!NOTE]
> Versions labeled as `pre`, `beta`, `alpha`, etc., may be unstable. We recommend using the release versions. If you encounter any issues, please report them [here](https://github.com/Fun117/scratch-auth-react/issues).


## Installation
```bash:npm
npm install scratch-auth-react
```
```bash:yarn
yarn add scratch-auth-react
```

## Setup

### Secret Key

Set the secret key used for signing Scratch Auth cookies. This value should be a random, long string. 

```.env:.env.local
SCRATCH_AUTH_COOKIE_SECRET_KEY=your_secret_key_here
```

### Configuration
> [!NOTE]
> The setup file should be created in the root directory of your project. This file is used to set the OAuth redirect URL. Create it with the name scratch-auth.config.ts as shown below.

`redirect_url` Redirect URL
When publishing a website, please change the URL from the development environment to the production environment.

`title` By default, it is `Scratch Auth`, but you can optionally decide your own title.

`expiration` Sets the session storage period. By default, it is `30` days. You can freely set the storage period as an option. If `-1` is set, the storage period is permanently (200 years).

```ts:scratch-auth.config.ts
import { ScratchAuth_config } from "scratch-auth-react/src/dist/config"

// Perform necessary configurations within the setup file
const config: ScratchAuth_config = {
  redirect_url: `http://localhost:3000/api/auth`, // Required
  title: `Title`, // optional
  expiration: 30, // optional
}

export default config
```

# Pages

No explanation of basic knowledge such as React, etc., will be provided.

## Home

By executing `await ScratchAuthGET_session()`, the user's name is returned if logged in, otherwise `null` is returned.

```tsx:src/app/page.tsx
'use client'

import { useAuthSession, ScratchAuth_Login, ScratchAuth_Logout } from 'scratch-auth-react';

export default function Home() {
  const session = useAuthSession();

  return (
      <>
        <div className='flex flex-col gap-3 text-center'>
          {session?
            <>
              <h1>{session}</h1>
              <button onClick={() => ScratchAuth_Logout()}>
                Logout
              </button>
            </>:<>
              <button onClick={() => ScratchAuth_Login()}>
                Login
              </button> 
            </>
          }
        </div>
      </>
  );
}
```

## Authentication

In the example code, we use Next.js's `useSearchParams` to get parameters, but it's fine to use another method as long as you can get the value of `privateCode`.

> [!NOTE]
> This process needs to be executed on the page with the redirect URL set up in the [Setup](#setup).

```tsx:src/app/api/auth/page.tsx
/*
 * page.tsx
 * This file is the component of the authentication page.
 * It retrieves the privateCode from the redirect URL and performs the authentication process.
 */

'use client'

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import { ScratchAuthSET_session } from 'scratch-auth-react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const privateCode = searchParams.get('privateCode');

  useEffect(() => {
    async function auth() {
      await ScratchAuthSET_session(privateCode); //A uthenticate account
      if (typeof window !== 'undefined') {
        window.location.href = `/`; // Redirect to home
      }
    }
    auth()
  }, []); // Pass an empty dependency array to execute only on initial render

  return (
    <span>Processing...</span>
  );
}
```
