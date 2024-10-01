import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
 // Assuming you're using a custom prisma client


export async function GET(req: Request, { params }: { params: { empid: string } }) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const empid = parseInt(params.empid, 10);

  if (isNaN(empid)) {
    return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
  }

  const offset = (page - 1) * limit;

  try {
    const [enquiries, total] = await prisma.$transaction([
      prisma.enquiryDetails.findMany({
        where: { empid },
        skip: offset,
        take: limit,
        orderBy: {
          entrytime: 'desc', // You can order by other fields if needed
        },
      }),
      prisma.enquiryDetails.count({
        where: { empid },
      }),
    ]);

    return NextResponse.json({ enquiries, total });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}
