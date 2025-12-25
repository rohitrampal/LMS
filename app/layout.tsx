import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';
import Layout from '@/components/Layout/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Loan Management System',
  description: 'SaaS Loan Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}


