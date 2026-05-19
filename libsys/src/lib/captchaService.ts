// src/lib/captchaService.ts
// Port of C# CaptchaService.cs
// NO 'use client' — server only
// 
// C# original:
//   GenerateCaptchaImage() → Tuple<string, byte[]>
//   stored code in Session["CaptchaCode"]
//
// Our version:
//   generateCaptcha() → { code, svg }
//   code stored in JWT cookie (not session)
import svgCaptcha from 'svg-captcha';
export interface ICaptchaResult{
    code:string //the answer
    svg: string //the image (to browser)
}
export function generateCaptcha():ICaptchaResult{
    const captcha=svgCaptcha.create(
    {
        size:5 ,//5 characters,
        noise: 3,
        color: true,
        background: '#ffffff',
        width: 200,
        height: 50,
        fontSize: 40,
        charPreset: '0123456789' //numbers only.
    }
    );
    return {
       code:captcha.text,
       svg:captcha.data
    };

}