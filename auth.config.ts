import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "./lib/form-schemas";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate the fields
        const validatedFields = signInSchema.safeParse(credentials);
        console.log("🚀 ~ authorize ~ validatedFields:", validatedFields)
        if (!validatedFields.success) {
          return null;
        }

        // Validate that the user exists
        const { name, password } = validatedFields.data;
        console.log("🚀 ~ authorize ~ name:", name)
        const user = await prisma.admindetails.findUnique({
          where: { adminname:name },
        });
        console.log("🚀 ~ authorize ~ user:", user)
        
        if (!user || !user.password) {
          return null;
        }

        // Check the password
         // Compare passwords as plain strings
         const isPasswordMatch = password === user.password;
         console.log("🚀 ~ authorize ~ isPasswordMatch:", isPasswordMatch)
        // const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
          return null;
        }

        return { id: String(user.adminid), name: user.adminname };
      },
    }),
  ],
} satisfies NextAuthConfig;
