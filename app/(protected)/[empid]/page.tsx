'use client';
import {  useRouter } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';


interface Employee {
  empid: number;
  empname: string;
  empphoneno: string;
  empusername: string;
  empemailid: string;
  emppassword:string;
  Status: string;
  _count: {
    enquiries: number;
  };
}

interface Params {
  empid: string;
}


export default function EmpDetailsPage({ params }: { params: Params }) {

  const router = useRouter();
  
  const { empid } = params // Extracting empid from the dynamic route
  const [employee, setEmployee] = useState<Employee | null>(null);
  
  const [originalEmployee, setOriginalEmployee] = useState<Employee | null>(null); // Store the original data to reset on cancel
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee data
  useEffect(() => {
    if (empid) {
      const fetchEmployee = async () => {
        try {
          const response = await fetch(`/api/employee/${empid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch employee details');
          }

          const data = await response.json();
          setEmployee(data.employee);
          setOriginalEmployee(data.employee); // Keep a copy of the original data
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEmployee();
    }
  }, [empid]);

  // Handle form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (employee) {
      setEmployee({
        ...employee,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle Save (Update DB)
  const handleSave = async () => {
    if (!employee) return;

    try {
      const response = await fetch(`/api/employee/${employee.empid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee), // Send updated employee details
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        console.log("🚀 ~ handleSave ~ updatedEmployee:", updatedEmployee)
        setEmployee(updatedEmployee); // Update UI with saved data
        setOriginalEmployee(updatedEmployee); // Reset original data
        alert('Employee details updated successfully!');
      } else {
        alert('Failed to update employee details');
      }
    } catch (error) {
      alert('Error while updating employee details');
    }
  };

  // Handle Cancel
  const handleCancel = () => {

    setEmployee(originalEmployee); // Reset form to original state
    router.back()
  };

  if (loading) {
    return <div>Loading employee details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employee) {
    return <div>No employee data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Edit Employee Details</h1>
      <div className="mt-4">
        <label className="block mb-2">
          <strong>ID:</strong> {employee.empid}
        </label>

        <label className="block mb-2">
          <strong>Name:</strong>
          <input
            type="text"
            name="empname"
            value={employee.empname || ''}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-2">
          <strong>Phone Number:</strong>
          <input
            type="text"
            name="empphoneno"
            value={employee.empphoneno || ''}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-2">
          <strong>Username:</strong>
          <input
            type="text"
            name="empusername"
            value={employee.empusername || ''}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </label>
        <label className="block mb-2">
          <strong>password:</strong>
          <input
            type="text"
            name="emppassword"
            value={employee.emppassword || ''}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-2">
          <strong>Email ID:</strong>
          <input
            type="text"
            name="empemailid"
            value={employee.empemailid || ''}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </label>

        <label className="block mb-2">
          <strong>Status:</strong>
          <input
            type="text"
            name="Status"
            value={employee.Status || ''}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </label>

        <p><strong>Total Enquiries:</strong> {employee._count.enquiries}</p>

        <div className="mt-4">
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 mr-2">
            Save
          </button>
          <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
