//this lib is to "complete" some "useStore" need
//store只管理state 、提供function
//相關的運算(ex:計算toast的秒數)則由此輔助完成,不可混淆
export function calculateToastDuration(message:string,requested:number):number{
 // Strip HTML tags first (message can contain HTML!)
  const plainText  = message.replace(/<[^>]+>/g, '')
  const wordCount  = plainText.trim().split(/\s+/).length
  const readingMs  = wordCount * 200  // ~200ms per word (avg reading speed)

  return Math.max(requested, readingMs, 2000)  // minimum 2 seconds
}