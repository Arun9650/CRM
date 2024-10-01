import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import ExcelJS from 'exceljs'; // Import exceljs

export async function GET(req: Request, { params }: { params: { empid: string } }) {
  console.log("🚀 ~ GET ~ params:", params)
  const empid = parseInt(params.empid, 10);
  console.log("🚀 ~ GET ~ empid:", empid)

  if (isNaN(empid)) {
    return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
  }

  try {
    // Fetch employee data with enquiries
    const employee = await prisma.empDetails.findUnique({
      where: { empid },
      include: {
        enquiries: true, // Include enquiries related to the employee
      },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Data');

    // Add header row for the employee details
    worksheet.addRow(['Employee ID', 'Name', 'Phone Number', 'Username', 'Email', 'Status']);

    // Add the employee data
    worksheet.addRow([employee.empid, employee.empname, employee.empphoneno, employee.empusername, employee.empemailid, employee.Status]);

    // Add a space between employee data and enquiries
    worksheet.addRow([]);

    // Add header row for the enquiries
    worksheet.addRow(['Enquiry ID', 'Customer Name', 'Phone Number', 'Email', 'Address', 'Latitude', 'Longitude', 'DOB', 'Entry Time']);

    // Add each enquiry as a row in the worksheet
    employee.enquiries.forEach(enquiry => {
      worksheet.addRow([
        enquiry.enquiryid,
        enquiry.custname,
        enquiry.custphoneno,
        enquiry.custemailid,
        enquiry.custaddress,
        enquiry.latitude,
        enquiry.longitude,
        enquiry.DOB,
        enquiry.entrytime,
      ]);
    });

    // Create a buffer from the workbook to send as a response
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers to trigger a download of the Excel file
    const headers = new Headers({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=employee_${empid}_data.xlsx`,
    });

    return new Response(buffer, { headers });

  } catch (error) {
    console.error('Failed to fetch employee data or generate Excel:', error);
    return NextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 });
  }
}
