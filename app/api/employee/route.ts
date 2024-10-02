import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Get the search parameters from the request URL
  const { searchParams } = new URL(request.url);

  // Extract page and limit values from the query string
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Calculate the number of records to skip
  const skip = (page - 1) * limit;

  try {
    // Fetch paginated records
    const empDetails = await prisma.empDetails.findMany({
      skip,
      take: limit,
    });

    // Count the total number of records in the table
    const totalRecords = await prisma.empDetails.count();

    // Count the total number of enquiries in the entire system
    const totalEnquiries = await prisma.enquiryDetails.count();

    // Query to find the employee with the most enquiries
    const employeesWithEnquiryCount = await prisma.empDetails.findMany({
      include: {
        _count: {
          select: { enquiries: true }, // Count the number of enquiries per employee
        },
      },
      orderBy: {
        enquiries: {
          _count: "desc", // Order by number of enquiries in descending order
        },
      },
      take: 1, // Only take the one with the most enquiries
    });

    const topEmployee = employeesWithEnquiryCount[0];

    // Query to count active users (e.g., last login within 24 hours or active status)
    const activeUsersCount = await prisma.empDetails.count({
      where: {
        Status: {
          in: ["Active"], // Check for active status
        }
        // Optionally, you can add another condition like { status: "active" } if available
      },
    });

    return NextResponse.json({
      data: empDetails,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        limit,
      },
      totalEnquiries, // Total number of enquiries
      topEmployee: topEmployee, // Employee with the most enquiries
      activeUsersCount, // Total active users in the past 24 hours
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
