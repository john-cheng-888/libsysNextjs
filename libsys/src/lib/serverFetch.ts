//sometimes the "page.tsx" needs to request API
//but there is no "headers" if it's not 'use client' page.tsx
//so,need to wrap some API by this "serverFetch" wrapper skill.
//ref /mnt/p/ts-labs/vip-crm/src/app/lib/vip.server.fetchVip.ts
//which is called by /src/app/vip/[id]/page.tsx--to get vip detail inside the page rendering process.

import { cookies } from "next/headers";
const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL??'http://localhost:3001';
export async function serverFetch(
    path:string,
    options:RequestInit={}
):Promise<Response> 
{
    const cookieStore=await cookies();
    const token=cookieStore.get('auth_token')?.value;//別忘了「.value」,不然會是個name+value物件
    const url=path.startsWith('http')?path:`${BASE_URL}${path}`;
    //Ha~TATATATATATATA....
    const resp=await fetch(url,{
        ...options,
        headers:{
            'Content-Type':'application/json',
            //in JTW bearer (c# ...remote API will need it)
            ...(token?{Authorization:`Bearer ${token}`}:{}),
            //in cookei, for Nextjs API use, the middleware will reject reqeust if no token in cookie
            ...(token?{Cookie:`auth_token=${token}`}:{}),
            ...options.headers
        },cache:'no-store'
    });
    //OWATA !!!!
    return resp;   
 }