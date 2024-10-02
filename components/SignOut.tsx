'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const SignOutButton = () => {

    const handleSignOut = async () => {
      await signOut({ callbackUrl: '/sign-in' });
    }
  return (
    <button onClick={() => handleSignOut()} className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center hover:bg-indigo-700 transition duration-150 ease-in-out">
    <LogOut className="h-5 w-5 mr-2" />
    Sign Out
  </button>
  );
};

export default SignOutButton;
