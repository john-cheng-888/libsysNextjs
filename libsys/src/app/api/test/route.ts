import db from '@/lib/db';
import { NextResponse } from 'next/server'; 
export async function GET(){
    try{
         const result=await db('books').count(' * as total').first();
         return NextResponse.json(
            {
                success:true,
                totalBooks:result?.total
            }
         );
    }catch(error){
            return NextResponse.json(
                {
                    success:false,
                    error:String(error)
                },
                {
                    status:500
                }
            )
    }
}