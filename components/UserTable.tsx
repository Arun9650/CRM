// /app/dashboard/components/UserTable.tsx
"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "./ui/card";
import { useSession } from "next-auth/react"; // Import useSession from NextAuth
import { useRouter } from "next/navigation";
import axios from "axios";

const pageSize = 10; // Number of users per page

type employee = {

  empid: number,
  empname: string,
  empphoneno: string,
  empusername: string,
  emppassword: string,
  empemailid:string,
  Status: string
}
type  topEmployee = {
  empid: number,
  empname: string,
  empphoneno: string,
  empusername: string,
  emppassword: string,
  empemailid:string,
  Status: string
  _count: { enquiries: 11 }
}
export default function UserTable() {

  const router = useRouter();

  const { data: session, status } = useSession(); // Use session and status from NextAuth
  const [users, setUsers] = useState<employee[]>([]); // State to hold user data
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const [totalUsers, setTotalUsers] = useState(0); // Total number of users
  const [userWithMostPoints, setUserWithMostPoints] = useState<topEmployee>(); // User with most points
  const [isLoading, setIsLoading] = useState(false); // Loading state

 
  // Fetch user data based on the current page
  const fetchUsers = async (page: number) => {
    if (!session) return; // If no session, return early

    setIsLoading(true);
    const res = await fetch(`/api/employee?page=${page}&limit=${pageSize}`, {
      headers: {
        contentType: "application/json",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Add session token here if necessary
      },
      credentials: "include", // Include credentials
      cache: 'no-store',
    });

    const data = await res.json();
    console.log("🚀 ~ fetchUsers ~ data:", data)
    setUsers(data.data);
    setTotalUsers(data.pagination.totalRecords);
    setUserWithMostPoints(data.topEmployee);
    setIsLoading(false);
  };

  const handleDelete = async ({ empid }: { empid: number }) => {
    try {
      const response = await axios.get(`/api/file`);
      alert("Employee deleted successfully");
      fetchUsers(currentPage); // Fetch users
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };
  const handleReport = async ({ empid }: { empid: number }) => {
    try {
      const response = await axios.get(`/api/file/${empid}`, { responseType: 'blob', });

    
    // Create a Blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employee_${empid}_data.xlsx`); // Specify the file name

    // Append the <a> element to the body, trigger the click, and remove it afterward
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
    fetchUsers(currentPage); // Fetch users
    
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  // Load data on page load and page change
  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers(currentPage); // Fetch users when session is authenticated
    }
  }, [currentPage, status]);

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to view the users.</div>;
  }

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row w-full justify-between gap-3">
        <Card className="p-4 sm:p-8 text-center">
          <CardTitle>Total User: {totalUsers}</CardTitle>
        </Card>
        <Card className="p-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-8">
          <CardTitle>User With Most Enquiries </CardTitle>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
          <div>
          Name : {userWithMostPoints?.empname}
        </div>
        <div>

        Enquiries : {userWithMostPoints?._count.enquiries} 
        </div>
          Phone no. : {userWithMostPoints?.empphoneno}
          </div>
        </Card>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Users</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>email</TableHead>
              <TableHead>phone No.</TableHead>
              <TableHead className="text-right"></TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.empid}>
                  <TableCell>{user.empid}</TableCell>
                  <TableCell>{user.empname}</TableCell>
                  <TableCell>{user.empemailid}</TableCell>
                  <TableCell>{user.empphoneno}</TableCell>
                  <TableCell className="text-right flex  items-center gap-2 justify-end ">
                    <Button onClick={() => router.push(`/${user.empid}/view`)} >View</Button>
                  
                    <Button onClick={() => router.push(`/${user.empid}`)} className="bg-blue-500 hover:bg-blue-400">Edit</Button>  
                    <Button onClick={() => handleDelete({ empid: user.empid })} className="bg-red-500 hover:bg-red-400"  >Delete</Button>
                    <Button onClick={() => handleReport({ empid: user.empid })} className="bg-red-500 hover:bg-red-400"  >Report</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
