import React from 'react';
import { Outlet, Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/Auth';
import { cn } from '@/lib/utils';

const MainLayout = React.memo(() => {
  const { account } = useAuthContext();

  return (
    <div className={cn('min-h-screen bg-[#faf9f7] dark:bg-stone-950')}>
      <Header />
      <main
        className={cn(
          'flex flex-col',
          'min-h-[calc(100dvh-64px)]',
          'pt-20 pb-12 px-6',
          'max-w-[1440px] mx-auto w-full',
        )}
      >
        <Outlet />
      </main>
      <Footer />
      {account && (
        <Link
          to="/editor"
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </div>
  );
});

export default MainLayout;
