'use client';
import { signOut } from 'next-auth/react';

const SignOutButton = () => {

    const handleSignOut = async () => {
      await signOut({ callbackUrl: '/sign-in' });
    }
  return (
    <button
      onClick={() => handleSignOut()}
      className="bg-red-500 text-white font-bold py-2 px-4 rounded"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
