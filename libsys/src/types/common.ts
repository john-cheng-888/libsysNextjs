//wrap the API resut with generic,a bouns tech
//see it in "api/vip/route.ts"
export interface ApiResponse<T>{
   data:T|null;
   success:boolean;
   message?:string;
   timestamp:Date;
}
// With as const:
export const LOG_LEVEL = {
  Info:  'info',
  Warn:  'warn',
  Error: 'error',
  Debug: 'debug'
} as const