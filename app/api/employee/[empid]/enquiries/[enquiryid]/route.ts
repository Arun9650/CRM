import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// PUT handler for updating enquiry
export async function PUT(req: Request, { params }: { params: { enquiryid: string } }) {
  const { enquiryid } = params;
  const { custname, custphoneno, custemailid, custaddress } = await req.json(); // Extract data from the request body

  try {
    // Update the enquiry in the database
    const updatedEnquiry = await prisma.enquiryDetails.update({
      where: { enquiryid: Number(enquiryid) },
      data: {
        custname,
        custphoneno,
        custemailid,
        custaddress,
      },
    });

    return NextResponse.json({ success: true, enquiry: updatedEnquiry });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to update enquiry', error: error.message }, { status: 500 });
  }
}


export async function DELETE(req: Request, { params }: { params: { enquiryid: string } }) {
    const { enquiryid } = params;
  
    try {
      // Delete the enquiry from the database
      await prisma.enquiryDetails.delete({
        where: { enquiryid: Number(enquiryid) },
      });
  
      return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: 'Failed to delete enquiry', error: error.message }, { status: 500 });
    }
  }