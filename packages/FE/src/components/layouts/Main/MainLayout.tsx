import React from 'react';
import { Outlet } from '@tanstack/react-router';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { cn } from '@/lib/utils';

const MainLayout = React.memo(() => {
  return (
    <div className={cn('min-h-screen bg-[#faf9f7] dark:bg-stone-950')}>
      <Header />
      <main
        className={cn(
          'flex flex-col',
          'min-h-[calc(100dvh-64px)]',
          'pt-20 pb-12 px-6', // section-gap: 80px top/bottom, gutter: 24px sides
          'max-w-[1440px] mx-auto w-full',
        )}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
});

export default MainLayout;
