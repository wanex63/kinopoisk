'use client';

import Header from './Header';
import Footer from './Footer';

export default function LayoutStructure({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-160px)]">
        {children}
      </main>
      <Footer />
    </>
  );
}