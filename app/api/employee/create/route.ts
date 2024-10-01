import {  NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assuming you're using a custom prisma client

export async function POST(req: Request) {

    const {EmployeeName,EmployeePhoneNo, EmployeeUsername, EmployeePassword, EmployeeStatus, EmployeeEmail} = await req.json();
   
    // Insert the new employee into the database
    const newEmployee = await prisma.empDetails.create({
      data: {
        empname: EmployeeName,
        empphoneno: EmployeePhoneNo,
        empusername: EmployeeUsername,
        emppassword: EmployeePassword,
        empemailid: EmployeeEmail,
        Status: EmployeeStatus || "Active", // Default to "Active" if not provided
      },
    });

    // Return the newly created employee
    return NextResponse.json( newEmployee , { status: 201 });
  
}
