import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthGuard from '@/components/auth/AuthGarde';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>

        <ThemeProvider>
          <SidebarProvider>
            <AuthGuard>
              <ToastContainer position="bottom-right" theme='dark' autoClose={8000} className="z-50 ml-2" />
              {children}
            </AuthGuard>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
