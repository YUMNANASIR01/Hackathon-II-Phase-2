import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNavbar = true }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
};
