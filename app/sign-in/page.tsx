"use client";
import { SubmitButton } from "@/components/SubmitButton";
import { signInAction } from "@/lib/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const res = await signInAction({ name , password });
    if (res.error) {
      setError(res.error);
      return;
    }
    redirect("/");
  };

  return (
    // <main>
    //   <Link className="home-link" href="/">
    //     ◄ Home
    //   </Link>
    //   <form className="main-container" action={handleFormSubmit}>
    //     <h1 className="header-text">Sign In</h1>
    //     <input name="name"  placeholder="name" />
    //     <input name="password" type="password" placeholder="Password" />
    //     <SubmitButton pendingText="Loggin in...">Login</SubmitButton>
    //     <Link className="auth-link" href="/sign-up">
    //       Don't have an account? Sign Up
    //     </Link>
    //   </form>
    // </main>
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form action={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
           name="name" 
            type="text"
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
          name="password"
            type="password"
            className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-indigo-500"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
        >
         {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
    </div>
  </div>
  );
} 
