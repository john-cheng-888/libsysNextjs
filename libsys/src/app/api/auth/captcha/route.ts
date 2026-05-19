// src/app/api/auth/captcha/route.ts
// GET /api/auth/captcha
//
// C# equivalent:
//   var captchaInfo = _captchaService.GenerateCaptchaImage()
//   HttpContext.Session.SetString("CaptchaCode", captchaInfo.Item1)
//   ViewBag.CaptchaImage = Convert.ToBase64String(captchaInfo.Item2)
//
// Our version:

import { NextResponse } from "next/server";
import { generateCaptcha } from '@/lib/captchaService'
import {cookies} from 'next/headers'
//   generate captcha → store code in temp cookie → return SVG
export async function GET() :Promise<NextResponse> {
    try{
        const {code,svg}=generateCaptcha();
    // Store the answer in an httpOnly cookie
    // C# stored in Session — we use cookie (stateless)        
        const cookieStore=await cookies();
        cookieStore.set(
            'captcha_code',code,{
                httpOnly:true,
                secure:false,//true in production (https)
                maxAge:300 ,//300 sec==5 min.
                path:'/'
            }
        );
        //not return json,but Response object
        return new NextResponse(
            svg,{
                headers:{
                    'Content-type':'image/svg+mxl',
                    'Cache-Control':'no-store,no-cache,must-revalidate',
                    'Pragma':'no-cache'
                }
            }
        );
    }catch(err){
        /**
         * 不確定error的內容是什麼樣子的情況下,用「String(err)」就是了,
         * 除非它有props & value才用stringify
         */
        return NextResponse.json(
            {success:false,error:String(err)},
            {status:500}
        )
    }
}