import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(){

    const user  = await prisma.admindetails.findMany();
    return NextResponse.json({message: 'user'})
}