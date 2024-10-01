import { z } from "zod";

// Zod schema for validating employee creation data
const employeeSchema = z.object({
  empname: z.string().min(1, { message: "Employee name is required" }),
  empphoneno: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  empusername: z.string().min(1, { message: "Username is required" }),
  emppassword: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  empemailid: z.string().email({ message: "Invalid email address" }),
  Status: z.string().optional(),
});

export default employeeSchema