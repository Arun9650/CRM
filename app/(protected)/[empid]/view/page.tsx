'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input'; // Import the shadcn/ui Input component
import { Button } from '@/components/ui/button';
import EditEnquiryDialog from '@/components/EditEnquiryDialog';
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
} from '@/components/ui/alert-dialog';
import { Map, Trash } from 'lucide-react';
// Define types for Employee and Enquiry
interface Employee {
	empid: number;
	empname: string;
	empphoneno: string;
	empusername: string;
	empemailid: string;
	Status: string;
	_count: {
		enquiries: number;
	};
}

interface Enquiry {
	enquiryid: number;
	custname: string;
	custphoneno: string;
	custemailid: string;
	custaddress: string;
	entrytime: string;
	latitude: string;
	longitude: string;
}

interface Params {
	empid: string;
}

// Define the props for the component
interface EmployeeDetailsPageProps {
	params: Params;
}

const EmployeeDetailsPage: React.FC<EmployeeDetailsPageProps> = ({
	params,
}) => {
	const { empid } = params; // Dynamic route param
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchError, setSearchError] = useState<string | null>(null);
	const [loadingSearch, setLoadingSearch] = useState(false); // Loading state for DB search

	const [searchTerm, setSearchTerm] = useState(''); // State for search term
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const enquiriesPerPage = 5; // Set enquiries per page

	useEffect(() => {
		if (empid && searchTerm === '') {
			fetchEmployeeAndEnquiries(empid);
		}
	}, [empid]);

	useEffect(() => {
		if (empid && searchTerm === '') {
			fetchEnquiries(empid);
		}
	}, [empid, currentPage, searchTerm]);

	// Function to open the map with the employee's location
	const openMap = (latitude: string, longitude: string) => {
		const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=15`;
		window.open(mapUrl, '_blank'); // Open Google Maps in a new tab
	};

	// Fetch employee details and paginated enquiries
	const fetchEmployeeAndEnquiries = async (empid: string | string[]) => {
		try {
			setLoading(true);
			const employeeResponse = await fetch(`/api/employee/${empid}`);
			const enquiriesResponse = await fetch(
				`/api/employee/${empid}/enquiries?page=${currentPage}&limit=${enquiriesPerPage}`
			);

			if (!employeeResponse.ok || !enquiriesResponse.ok) {
				throw new Error('Failed to fetch data');
			}

			const employeeData = await employeeResponse.json();
			const enquiriesData = await enquiriesResponse.json();

			setEmployee(employeeData.employee);
			setEnquiries(enquiriesData.enquiries);
			setTotalPages(Math.ceil(enquiriesData.total / enquiriesPerPage)); // Calculate total pages
		} catch (error: any) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchEnquiries = async (empid: string | string[]) => {
		try {
			const enquiriesResponse = await fetch(
				`/api/employee/${empid}/enquiries?page=${currentPage}&limit=${enquiriesPerPage}`
			);

			if (!enquiriesResponse.ok) {
				throw new Error('Failed to fetch data');
			}
			const enquiriesData = await enquiriesResponse.json();

			setEnquiries(enquiriesData.enquiries);
			setTotalPages(Math.ceil(enquiriesData.total / enquiriesPerPage)); // Calculate total pages
		} catch (error: any) {
			setError(error.message);
		}
	};

	// Function to search the database if no results found locally
	const searchDatabase = async (searchTerm: string) => {
		setLoadingSearch(true);
		try {
			const searchResponse = await fetch(
				`/api/employee/${empid}/search-enquiries?query=${searchTerm}`
			);
			if (!searchResponse.ok) {
				throw new Error('Failed to fetch data from the database');
			}
			const searchResults = await searchResponse.json();
			setEnquiries(searchResults.enquiries);
		} catch (error: any) {
			setSearchError(error.message);
		} finally {
			setLoadingSearch(false);
		}
	};

	const editEnquiry = async (
		enquiryid: number,
		updatedData: Partial<Enquiry>
	) => {
		try {
			const response = await fetch(
				`/api/employee/${empid}/enquiries/${enquiryid}/`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedData),
				}
			);

			const result = await response.json();
			if (response.ok) {
				alert('Enquiry updated successfully');
				// Optionally, refresh the enquiries or update the state
			} else {
				alert(result.message || 'Failed to update enquiry');
			}
		} catch (error) {
			console.error('Error updating enquiry:', error);
			alert('An error occurred while updating the enquiry.');
		}
	};
	const handleDelete = async (enquiryid: number) => {
		try {
			const response = await fetch(
				`/api/employee/${empid}/enquiries/${enquiryid}/`,
				{
					method: 'Delete',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const result = await response.json();
			if (response.ok) {
				await fetchEmployeeAndEnquiries(empid);
				alert('Enquiry updated successfully');

				// Optionally, refresh the enquiries or update the state
			} else {
				alert(result.message || 'Failed to update enquiry');
			}
		} catch (error) {
			console.error('Error updating enquiry:', error);
			alert('An error occurred while updating the enquiry.');
		}
	};

	// Filter enquiries based on the search term
	const filteredEnquiries = enquiries.filter((enquiry) =>
		enquiry.custname.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// If no results found locally, search in the database
	useEffect(() => {
		if (searchTerm && filteredEnquiries.length === 0 && !loadingSearch) {
			searchDatabase(searchTerm);
		}
	}, [searchTerm, filteredEnquiries.length]);

	if (loading) {
		return <div>Loading employee details and enquiries...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			{/* Employee Details Section */}
			{employee && (
				<>
					<h1 className="text-2xl font-bold">Employee Details</h1>
					<div className="mt-4 grid grid-cols-3 gap-2">
						<p>
							<strong>ID:</strong> {employee.empid}
						</p>
						<p>
							<strong>Name:</strong> {employee.empname}
						</p>
						<p>
							<strong>Phone Number:</strong> {employee.empphoneno}
						</p>
						<p>
							<strong>Username:</strong> {employee.empusername}
						</p>
						<p>
							<strong>Email ID:</strong> {employee.empemailid}
						</p>
						<p>
							<strong>Status:</strong> {employee.Status}
						</p>
						<p>
							<strong>Total Enquiries:</strong> {employee._count.enquiries}
						</p>
					</div>
				</>
			)}

			{/* Search Bar */}
			<div className="mt-6 mb-4">
				<Input
					type="text"
					placeholder="Search by customer name"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full"
				/>
			</div>

			{/* Enquiries Table with Pagination */}
			<h2 className="text-xl font-bold mt-6">Enquiries</h2>
			{loadingSearch ? (
				<div>Loading enquiries from the database...</div>
			) : (
				<>
					{filteredEnquiries.length === 0 ? (
						<div>User not found</div>
					) : (
						<table className="table-auto w-full mt-4">
							<thead>
								<tr className="bg-gray-200">
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Phone
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Email
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Address
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Entry time
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions </th>
									
								</tr>
							</thead>
							<tbody>
								{filteredEnquiries.map((enquiry) => (
									<tr key={enquiry.enquiryid} className="border-t">
										<td className="px-4 py-2 text-sm text-gray-900">{enquiry.enquiryid}</td>
										<td className="px-4 py-2 text-sm text-gray-900 text-nowrap">
											{enquiry.custname}
										</td>
										<td className="px-4 py-2 text-sm text-gray-900 text-nowrap">
											{enquiry.custphoneno}
										</td>
										<td className="px-4 py-2 text-sm text-gray-900 text-nowrap overflow-y-auto max-w-40">
											{enquiry.custemailid}
										</td>
										<td className="px-4 py-2 overflow-y-auto text-nowrap text-sm text-gray-900 max-w-40">
											{enquiry.custaddress}
										</td>
										<td className="px-4 py-2 overflow-y-auto text-sm text-gray-900 text-nowrap ">
											{new Date(enquiry.entrytime).toLocaleString()}
										</td>
										<td className=''>
											<button
												onClick={() => {
													openMap(enquiry.latitude, enquiry.longitude);
												}}
												className="text-green-500 hover:text-blue-300"
											>
												<Map className="h-5 w-5" />
											</button>
										
											<EditEnquiryDialog
												enquiry={enquiry}
												onSave={(updatedData) =>
													editEnquiry(enquiry.enquiryid, updatedData)
												}
											/>
										
											{/* Delete Button with AlertDialog */}
											<AlertDialog>
												<AlertDialogTrigger asChild>
													
													<button className="text-red-600 hover:text-red-900" >
                        <Trash className="h-5 w-5" />
                        </button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>Are you sure?</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will
															permanently delete the employee.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleDelete(enquiry.enquiryid)}
														>
															Yes, Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</>
			)}

			{/* Pagination Component */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
};

// Pagination Component
const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) => {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	return (
		<div className="flex justify-center mt-4">
			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className="bg-blue-500 text-white px-4 py-2 mx-2 disabled:bg-gray-300"
			>
				Previous
			</button>
			<span className="px-4 py-2">
				Page {currentPage} of {totalPages}
			</span>
			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className="bg-blue-500 text-white px-4 py-2 mx-2 disabled:bg-gray-300"
			>
				Next
			</button>
		</div>
	);
};

export default EmployeeDetailsPage;
