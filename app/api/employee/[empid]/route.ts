import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";// Assuming you're using a custom prisma client


export async function GET(req: Request, { params }: { params: { empid: string } }) {
  const empid = parseInt(params.empid, 10);

  if (isNaN(empid)) {
    return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
  }

  try {
    const employee = await prisma.empDetails.findUnique({
      where: { empid },
      include: {
        _count: {
          select: { enquiries: true }, // Count the number of enquiries
        },
        
      },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ employee });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employee data' }, { status: 500 });
  }
}


export async function PUT(req: Request, { params }: { params: { empid: string } }) {
  const empid = parseInt(params.empid, 10); // Parse empid from params

  if (isNaN(empid)) {
    return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
  }

  try {
    // Parse the body of the request to get the data to update
    const body = await req.json();

    // Ensure there's data to update
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
    }


    const user  = await prisma.empDetails.findUnique({
      where: {empid}
    })
    console.log(user);

   // Remove empid from the update data if it exists
    const { empid: _, _count, ...updateData } = body;


    // Update the employee in the database
    const updatedEmployee = await prisma.empDetails.update({
      where: { empid: empid }, // Use empid as the identifier
      data: updateData,
      include: {
        _count: {
          select: { enquiries: true }, // Count the number of enquiries
        }
      }
    });

    return NextResponse.json(updatedEmployee );
  } catch (error) {
    console.error( error);
    console.error( (error as Error).message);
    return NextResponse.json({ error: 'Failed to update employee data' }, { status: 500 });
  }
}


// DELETE request to delete an employee
export async function DELETE(req: Request, { params }: { params: { empid: string } }) {
  console.log("🚀 ~ DELETE ~ params:", params)
  const empid = parseInt(params.empid, 10);
  console.log("🚀 ~ DELETE ~ empid:", empid)

  if (isNaN(empid)) {
    return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  try {
    // Delete the employee from the database
    const deletedEmployee = await prisma.empDetails.delete({
      where: { empid },
    });

    return NextResponse.json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}