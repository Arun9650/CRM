import * as z from "zod";
const { object, string } = z;

export const signInSchema = object({
  name: string({ required_error: "Email is required" }),
  password: string({ required_error: "Password is required" })
    .min(0, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = object({
  adminname: string({ required_error: "Email is required" }),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
export type SignUpValues = z.infer<typeof signUpSchema>;
