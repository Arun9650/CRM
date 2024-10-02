"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react"; // Import useSession from NextAuth
import { useRouter } from "next/navigation";
import axios from "axios";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components from Shadcn
import { Edit, Eye, FileText, Mail, Phone, Star, Trash, Users } from "lucide-react";

const pageSize = 10; // Number of users per page

type employee = {
  empid: number,
  empname: string,
  empphoneno: string,
  empusername: string,
  emppassword: string,
  empemailid: string,
  Status: string
}

type topEmployee = {
  empid: number,
  empname: string,
  empphoneno: string,
  empusername: string,
  emppassword: string,
  empemailid: string,
  Status: string,
  _count: { enquiries: number }
}

export default function UserTable() {
  const router = useRouter();
  const { data: session, status , update} = useSession(); // Use session and status from NextAuth
  const [users, setUsers] = useState<employee[]>([]); // State to hold user data
  const [currentPage, setCurrentPage] = useState(1); // State to manage current page
  const [totalUsers, setTotalUsers] = useState(0); // Total number of users
  const [userWithMostPoints, setUserWithMostPoints] = useState<topEmployee | null>(null); // User with most points
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [empToDelete, setEmpToDelete] = useState<number | null>(null); // State for storing the employee ID to delete
  const [totalEnquiries, setTotalEnquiries] = useState(0); // Total number of enquiries
  const [activeUser, setActiveUser] = useState(0)

  // Fetch user data based on the current page
  const fetchUsers = async (page: number) => {
    if (!session) return; // If no session, return early

    setIsLoading(true);
    const res = await fetch(`/api/employee?page=${page}&limit=${pageSize}`, {
      headers: {
        contentType: "application/json",
        credentials: "include",
        cache: 'no-store',
      }
    });

    const data = await res.json();
    setUsers(data.data);
    setTotalUsers(data.pagination.totalRecords);
    setUserWithMostPoints(data.topEmployee || null);
    setIsLoading(false);
    setTotalEnquiries(data.totalEnquiries)
    setActiveUser(data.activeUsersCount)
  };

  const handleDelete = async () => {
    if (empToDelete === null) return;

    try {
      await axios.delete(`/api/employee/${empToDelete}`);
      alert("Employee deleted successfully");
      fetchUsers(currentPage); // Fetch users
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    } finally {
      setEmpToDelete(null); // Reset after deletion
    }
  };

  const handleReport = async ({ empid }: { empid: number }) => {
    try {
      const response = await axios.get(`/api/file/${empid}`, { responseType: 'blob' });

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
      console.error("Error downloading report:", error);
      alert("Failed to generate report");
    }
  };

  // Load data on page load and page change
  useEffect(() => {
   const fetch = async () => {
    if (status === "authenticated") {
      fetchUsers(currentPage); // Fetch users when session is authenticated
    }
    if (status === "unauthenticated") {
      console.log('this run ')
      // window.location.reload();
      // await  update()
      router.push("/sign-in")
    }
   }
   fetch();
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
      <div className="bg-white w-full overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5  flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{users.length}</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex gap-4 justify-start text-sm text-gray-600">
                    <div>Total Enquiries:</div>
                    <div>{totalEnquiries}</div>
                  </div>
                </div>
              </div>
            </div>
      <div className="bg-white w-full overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5  flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users With Active Status</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{activeUser}</dd>
                    </dl>
                  </div>
                </div>
                {/* <div className="mt-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>Total Enquiries:</div>
                    <div>{totalEnquiries}</div>
                  </div>
                </div> */}
              </div>
            </div>

          <div className="bg-white w-full overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">User With Most Enquiries</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{userWithMostPoints?.empname}</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  {/* <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Mail className="h-4 w-4 mr-2" />
                    <div>{userWithMostEnquiries.email}</div>
                  </div> */}
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Phone className="h-4 w-4 mr-2" />
                    <div> {userWithMostPoints?.empphoneno}</div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <FileText className="h-4 w-4 mr-2" />
                    <div>Enquiries: {userWithMostPoints?._count.enquiries}</div>
                  </div>
                </div>
              </div>
            </div>
  
      </div>

      <div className="p-6 mt-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Users</h1>
        <Table>
          <TableHeader>
            <TableRow className="uppercase text-xs text-gray-500 ">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone No.</TableHead>
              <TableHead className="text-center border">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.empid} className="whitespace-nowrap text-sm text-gray-900">
                  <TableCell>{user.empid}</TableCell>
                  <TableCell>{user.empname}</TableCell>
                  <TableCell>{user.empemailid}</TableCell>
                  <TableCell>{user.empphoneno}</TableCell>
                  <TableCell className="text-center flex items-center gap-4 justify-center">
                    <button className="text-indigo-600 hover:text-indigo-900 bg-white" onClick={() => router.push(`/${user.empid}/view`)}>
                    <Eye className="h-5 w-5" />
                    </button>
                    <button onClick={() => router.push(`/${user.empid}`)} className="text-blue-600 hover:text-blue-900"><Edit className="h-5 w-5" /></button>
                    
                    {/* Delete Button with AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-600 hover:text-red-900" onClick={() => setEmpToDelete(user.empid)}>
                        <Trash className="h-5 w-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the employee.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Yes, Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <button onClick={() => handleReport({ empid: user.empid })} className="text-green-600 hover:text-green-900"> <FileText className="h-5 w-5" /></button>
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
