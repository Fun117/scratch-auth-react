"use server";

export async function ScratchAPIGet_User(username: string): Promise<any> {
  const result = await fetch(`https://api.scratch.mit.edu/users/${username}`);
  const res = await result.json();
  return res;
}
