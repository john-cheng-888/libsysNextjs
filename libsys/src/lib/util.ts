import { NextResponse } from "next/server";
import {ApiResponse} from '@/types/common'
export function utcToTimestampstring(date:Date=new Date()):string{
const pad = (n: number, len = 2) => String(n).padStart(len, '0');
  return (
    pad(date.getUTCFullYear(), 4) +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    pad(date.getUTCMilliseconds() * 10, 4)
  );
}
  //為什麼要「any」,而不是Date?
     //因為type是只在編譯階段參考,而實際上,dateIn收到的是string.
     //這是javascript Date物件的問題.要小心
export const toLocalInputFormatDate = (dateIn:any): string => {
    const date=new Date(dateIn);
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

/**
 收錄這兩個helper方法,日後眾route.ts都會用到
 --in route.ts
 return okResponse(vips);
 return errResponse('Not Found', 404)
 ---
 client :
 if (!result.success) {
    throw new Error(result.message);
    // ↑ ■■■ .message ■■
  }
  const data = result.data!;
  ...
  ...
 */

export function okResponse<T>(data: T, message?: string) {
  return NextResponse.json({
  data, success: true, message, timestamp: new Date()
  } satisfies ApiResponse<T>);
}
export function errResponse(message: string, status: number) {
return NextResponse.json({
  data: null, success: false, message, timestamp: new Date()
  } satisfies ApiResponse<null>, { status });
}