"use client";

import { useEffect, useState } from "react";

import { ScratchAuthGET_session } from "../main";
import { ScratchAPIGet_User } from "./scratch-api";

export function useAuthSession() {
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const sessionData = await ScratchAuthGET_session(); // session(ユーザー名)を取得
      setSession(sessionData); // session(ユーザー名)を変数に保存
    };
    getSession();
  }, []);

  return session;
};

export function useUserInfo(session: string | null): any | null {
  const [userinfo, setUserinfo] = useState<string | null>(null);

  useEffect(() => {
    try {
      const ServerRequest = async () => {
        if (session) {
          const result = await ScratchAPIGet_User(session);
          setUserinfo(result);
        }
      };
      ServerRequest();
    } catch (err) {
      console.log(err);
    }
  }, [session]);

  return userinfo;
};