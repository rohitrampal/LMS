'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, initializeDummyData } = useStore();

  useEffect(() => {
    initializeDummyData();
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router, initializeDummyData]);

  return null;
}


