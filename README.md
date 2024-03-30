<h1 align="center">
    Scratch Auth for React
    <div align="center">
        <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/fun117/scratch-auth-react">
        <img alt="GitHub forks" src="https://img.shields.io/github/forks/fun117/scratch-auth-react">
        <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/fun117/scratch-auth-react">
        <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/fun117/scratch-auth-react">
        <img alt="GitHub License" src="https://img.shields.io/github/license/fun117/scratch-auth-react">
        <a href="https://www.npmjs.com/package/scratch-auth-react">
            <img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/scratch-auth-react">
        </a>
    </div>
</h1>

[English](https://github.com/fun117/scratch-auth-react/blob/main/README.md) / [日本語](https://github.com/fun117/scratch-auth-react/blob/main/README/ja.md)

# Introduction
Scratch Auth is a simple OAuth service for Scratch. It provides developers with an easy-to-understand API and users with a smooth login experience. By using `scratch-auth-react`, you can easily implement OAuth functionality into your site.

This article explains the usage using Next.js's Approuter and TypeScript, but it should work similarly in Pagerouter or React, so adjust the code to make it work in your environment.

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
When publishing your website, change the URL from the development environment to the production environment.

```tsx:scratch-auth.config.ts
import { ScratchAuth_config } from "scratch-auth-react"

// Perform necessary configurations within the setup file
const _scratchauth_config: ScratchAuth_config = {
    redirect_url: `http://localhost:3000/api/auth`, //Change the redirect URL accordingly
}

export default _scratchauth_config
```

# Pages

No explanation of basic knowledge such as React, etc., will be provided.

## Home

By executing `await ScratchAuthGET_session()`, the user's name is returned if logged in, otherwise `null` is returned.

```tsx:src/app/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { ScratchAuthGET_session, ScratchAuth_Login, ScratchAuth_Logout } from 'scratch-auth-react';

export default function Home() {
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const sessionData = await ScratchAuthGET_session(); // Get session (username)
      setSession(sessionData); // Save session (username) to variable
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

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { ScratchAuthSET_session } from 'scratch-auth-react';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const privateCode = searchParams.get('privateCode');

  useEffect(() => {
    async function auth() {
      await ScratchAuthSET_session(privateCode); //A uthenticate account
      window.location.href = `/`; // Redirect to home
    }
    auth()
  }, []); // Pass an empty dependency array to execute only on initial render

  return (
    <span>Processing...</span>
  );
}
```

https://github.com/Fun117/scratch-auth-react
