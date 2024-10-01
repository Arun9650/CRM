import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma"; // Assuming you're using a custom prisma client

export async function GET(req: Request, { params }: { params: { empid: string } }) {
  const empid = parseInt(params.empid, 10);

  if (isNaN(empid)) {
    return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
  }

  // Parse URL query parameters
  const url = new URL(req.url);
  const searchTerm = url.searchParams.get('query');

  if (!searchTerm || searchTerm.trim() === "") {
    return NextResponse.json({ error: 'Search term cannot be empty' }, { status: 400 });
  }

  try {
    // Search for enquiries with the `custname` that contains the search term (case-insensitive)
    const filteredEnquiries = await prisma.enquiryDetails.findMany({
      where: {
        empid,
        custname: {
          contains: searchTerm, // Search for the customer name that contains the searchTerm
        },
      },
    });

    if (filteredEnquiries.length === 0) {
      return NextResponse.json({ message: 'No enquiries found' }, { status: 404 });
    }

    return NextResponse.json({ enquiries: filteredEnquiries });
  } catch (error) {
    console.error('Error searching enquiries:', error);
    return NextResponse.json({ error: 'Failed to search enquiries' }, { status: 500 });
  }
}
