//wrap the API resut with generic,a bouns tech
//see it in "api/vip/route.ts"
export interface ApiResponse<T>{
   data:T|null;
   success:boolean;
   message?:string;
   timestamp:Date;
}