'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, Container } from '@mui/material';
import { useStore } from '@/store/useStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthenticated, initializeDummyData } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    initializeDummyData();
  }, [initializeDummyData]);

  useEffect(() => {
    const publicPaths = ['/login', '/signup', '/forgot-password'];
    if (!publicPaths.includes(pathname) && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const publicPaths = ['/login', '/signup', '/forgot-password'];
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - 260px)` },
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}


