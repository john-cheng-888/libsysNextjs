// src/app/api/auth/login/route.ts
// POST /api/auth/login
//
// C# equivalent:
//   var storedCaptcha = HttpContext.Session.GetString("CaptchaCode")
//   if (storedCaptcha != captcha) → return error
//   Thread.Sleep(2000)            → anti brute-force
//   if ("00100A"==id)             → hardcoded (we do real DB check)

import { NextRequest,NextResponse } from "next/server";
import {cookies} from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import {okResponse,errResponse} from '@/lib/util';
import {IJwtPayload} from '@/types/auth';
//   return RedirectToAction(...)  → we return JWT cookie
export async function POST(req:NextRequest) {
    try{
        //get param from request object
        const {userId,password,captcha} =await req.json();
        //get stored captcha from cookie,忘了就回去「/api/auth/capthcha/route.ts」看一下
        
        const cookieStore=await cookies();
        const storedCapthcha=cookieStore.get('captcha_code')?.value;
        /**
         * 上述cookies的用法,也可以直接從req.cookies.get(....)
         * 總之,如果沒有NextRequst可用時,就用await cookies();
         * 有就用req.cookies()
         * 比較直覺
         */

        if(!storedCapthcha ||storedCapthcha!=captcha){
            return errResponse("Captcha Not Match!!",401);
        }
        //clear the captcha in cookie,cause it's 功成身退,and to store jwt instead.
        cookieStore.delete('captcha_code');
        //anti brute-force delay
        //like c# Thread.Sleep(2000);
        await new Promise(resolve=>setTimeout(resolve,2000));
        //find member in db.
        const member=await db('members').where(
            {icno:userId,record_delete_flag:'1'}
        ).first();
        if(!member || !member.password_hash){
            return errResponse(
                'Invalid ID or password',401
            );
        }
        //test password
        const passwordMatch=await bcrypt.compare(password,member.password_hash);
        if(!passwordMatch){
            return errResponse(
                'Invalid ID or password',401
            );
        }
        //get user roles
        const roleRows=await db('member_roles')
        .where({icno:userId})
        .select('role_id');
        const roles:number[]=roleRows.map((r:{role_id:number})=>r.role_id);
        //generate jwt
        const payload:IJwtPayload={
            userId:member.icno,
            name:member.name,
            roles
        };
        const token=jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            {expiresIn:'8h'}
        );
        //now,eventually,we can store it into cookie
        cookieStore.set('auth_token',token,{
            httpOnly:true,
            secure:false,
            maxAge:8*60*60,//8hr
            path:'/'
        });
        //response to client,login successfully
        return okResponse(
            {
                userId:member.icno,
                name:member.name,
                roles
            },'login successfully'
        );

    }catch(err){
        return errResponse(String(err),500);
    }
}