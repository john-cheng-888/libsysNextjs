/* eslint-disable @typescript-eslint/no-unused-expressions */
import { NextRequest,NextResponse } from "next/server";
import logger from "@/lib/logger";
import {incrementCounter} from '@/lib/requestCounter';
import {LOG_LEVEL} from '@/types/common'
type LogLevel= typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
export async function POST(req:NextRequest) {
    const secret=req.headers.get('x-internal-secret');
    if(secret!==process.env.INTERNAL_SECRET){
        return NextResponse.json(
            {ok:false},
            {status:403}
        )
    }
    //write to winston
    try{
        //「as ...」直接從caller (middleware.logToApi ) copy來用
        //雖然不寫as....,在執行時期沒差,但就給人看code時會比較完整
        //專業度比較高.
        const {level,message,meta}=await req.json() as {
            level: LogLevel,
            message:string,
            meta:Record<string,unknown>    
        }
        //someObject.X props,can be ref by someObject.[X]
        //remember,js is like water.  
        logger[level]?.(message,meta)??logger.info(message,meta);
        //update to db--postgresql
        incrementCounter('total').catch(err=>
            logger.error('incrementCounter failed', {
                key:'total',
                  error:  err.message,
                  code:   err.code      // PostgreSQL error code
            }));
        if(level===LOG_LEVEL.Warn){
            incrementCounter('unauthorized').catch(err=>logger.error('incrementCounter failed', {
                key:'unauthorized',
                  error:  err.message,
                  code:   err.code      // PostgreSQL error code
            }));
        }
        if(level=== LOG_LEVEL.Info && meta?.event==='AUTH_OK'){
            incrementCounter('auth_ok').catch(err=>logger.error('incrementCounter failed', {
                key:'auth_ok',
                  error:  err.message,
                  code:   err.code      // PostgreSQL error code
            }));
        }
        return NextResponse.json({
                ok:true
        });
    }catch(err){
         console.warn(`[LOG_FAILED] ${String(err)}`);
         return NextResponse.json({
                ok:false
         },{status:500});
    }
}