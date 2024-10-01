'use client';
import UserTable from '@/components/UserTable'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'


const Home = () => {

  const router = useRouter()
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/sign-in');
    }
  },[session])

  return (
    <UserTable/>
  )
}

export default Home