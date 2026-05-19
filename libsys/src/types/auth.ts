export interface ILoginRequest{
    userId: string,
    password: string,
    captcha: string
}
export interface ILoginResponse{
   success: boolean,
   message?: string,
   userId?: string
   role?: string
}
export interface IJwtPayload{
    userId: string,
    name: string,
    roles: number[],
    iat?: number,
    exp?: number
}