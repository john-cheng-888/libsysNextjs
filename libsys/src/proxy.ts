import { NextResponse,NextRequest } from "next/server";
import { jwtVerify} from 'jose';
import {LOG_LEVEL} from '@/types/common';

type LogLevel =typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
//--fire  & forget logger
function logToApi(
    level:LogLevel ,
    message:string,
    meta:Record<string,unknown>
){
    const baseUrl=process.env.NEXT_PUBLIC_BASE_URL??'http://localhost:3000';
    fetch(`${baseUrl}/api/internal/log`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'x-internal-secret':process.env.INTERNAL_SECRET??''
        },
        body:JSON.stringify({level,message,meta})
    }).catch(()=>{
        console.warn(`[LOG_FAILED] ${level}:${message}`);
    });
}
//get client IP.
function getIp(req:NextRequest):string{
     return req.headers.get('x-forwarded-for')??
     req.headers.get('x-real-ip')??'unknown';
}
//verify JWT.
async function verifyToken(req:NextRequest):Promise<boolean> {
  try{
    const token=req.cookies.get('auth_token')?.value;
    if(!token)return false;
    const secret=new TextEncoder().encode(
        process.env.JWT_SECRET!
    );
    await jwtVerify(token,secret);
    return true;
  }catch(err){
    return false;
  }  
}
//Guard1--page auth
async function checkPageAuth(req:NextRequest) {
    const {pathname} =req.nextUrl;
    const ip=getIp(req);
    const isValid=await verifyToken(req);
    if(!isValid){
        logToApi(LOG_LEVEL.Warn,"UNAUTHORIZED_PAGE_ACCESS",{
            pathname,
            ip
        });

        const loginUrl=new URL('/login',req.url);//相對於req.url而言推導出'/login' URL path.
        //like c# new Uri("http://.....","/login")

        loginUrl.searchParams.set('from',pathname);
        return NextResponse.redirect(loginUrl);
    }
    logToApi(LOG_LEVEL.Info,"PAGE_ACCESS",{
        pathname,
        ip,
        event:'AUTH_OK'
    });
    return null;
}


//Guard2--API auth,no need re-direct if auth failed
async function checkApiAuth(req:NextRequest) {
    const {pathname} =req.nextUrl;
    const ip=getIp(req);
    const isValid=await verifyToken(req);
    if(!isValid){
        logToApi(LOG_LEVEL.Warn,"UNAUTHORIZED_API_CALL",{
            pathname,
            ip
        });
        return NextResponse.json(
            {success:false,message:'Unauthorized'},
            {status:401}
        );
    }
    logToApi(LOG_LEVEL.Info,"PAGE_ACCESS",{
        pathname,
        ip,
        event:'AUTH_OK'
    });
    return null;
}

//main pipeline of handling request. 
export async function  proxy(req:NextRequest) {
    const {pathname} =req.nextUrl;
    if(pathname.startsWith('/backend')){
        const result=await checkPageAuth(req);
        if(result)return result;
    }
    //skip the /api/auth(login needs) & /api/internal (logger need) route auth check , otherwise checkAuth 
    if(pathname.startsWith('/api/') &&
       !pathname.startsWith('/api/auth') &&
       !pathname.startsWith('/api/internal')){
        const result=await checkApiAuth(req);
        if(result)return result;
    }
    return NextResponse.next();
}
//for next js server use
/**
 * In C# you use [Route] or [Authorize] per controller. In Next.js you use matcher:
 */
export const config={
    matcher:[
        '/backend/:path*',
        '/api/:path*',
        //we don't need "exclude" since we do "pahtname.startWit...." check in middleware function
        //exclude:/api/auth/*
        //exclude:/login
    ]
}