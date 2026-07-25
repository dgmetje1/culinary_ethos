import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearch } from '@/context/Search';
import { useAuthContext } from '@/context/Auth';
import HeaderProfileMenu from '@/components/common/Header/ProfileMenu/HeaderProfileMenu';
import NotificationsPopover from '@/components/common/Notifications/NotificationsPopover';

const Header = () => {
  const { t } = useTranslation();
  const { search, setSearch, showSearch } = useSearch();
  const { account } = useAuthContext();
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [localSearch, setSearch]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-[#F9F9F7]/70 dark:bg-stone-950/70',
        'backdrop-blur-xl',
        'border-b border-stone-200/50 dark:border-stone-800/50',
      )}
    >
      <div
        className={cn(
          'max-w-[1200px] mx-auto',
          'flex justify-between items-center',
          'px-8 h-20',
        )}
      >
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className="text-2xl font-serif italic text-stone-900 dark:text-stone-50"
          >
            {t('layout.header.brand')}
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              activeProps={{
                className: cn(
                  'border-b-2 border-stone-900 dark:border-stone-50',
                  'text-stone-900 dark:text-stone-50',
                ),
              }}
              className={cn(
                'font-serif text-lg tracking-tight',
                'text-stone-500 dark:text-stone-400',
                'hover:text-stone-900 dark:hover:text-stone-50',
                'transition-colors duration-300',
                'pb-1',
              )}
            >
              {t('layout.header.nav.home')}
            </Link>
            <Link
              to="/plans"
              activeProps={{
                className: cn(
                  'border-b-2 border-stone-900 dark:border-stone-50',
                  'text-stone-900 dark:text-stone-50',
                ),
              }}
              className={cn(
                'font-serif text-lg tracking-tight',
                'text-stone-500 dark:text-stone-400',
                'hover:text-stone-900 dark:hover:text-stone-50',
                'transition-colors duration-300',
                'pb-1',
              )}
            >
              {t('layout.header.nav.planner')}
            </Link>
            {account?.role === 'admin' && (
              <Link
                to="/management"
                activeProps={{
                  className: cn(
                    'border-b-2 border-stone-900 dark:border-stone-50',
                    'text-stone-900 dark:text-stone-50',
                  ),
                }}
                className={cn(
                  'font-serif text-lg tracking-tight',
                  'text-stone-500 dark:text-stone-400',
                  'pb-1',
                  'hover:text-stone-900 dark:hover:text-stone-50',
                  'transition-colors duration-300',
                )}
              >
                {t('layout.header.nav.backoffice')}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {showSearch && (
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                className={cn(
                  'bg-stone-100/70 dark:bg-stone-900/70',
                  'backdrop-blur-md',
                  'border border-stone-200 dark:border-stone-800',
                  'rounded-full px-10 py-2 text-sm',
                  'focus:outline-none focus:border-orange-600',
                  'w-64',
                )}
                placeholder={t('layout.header.search')}
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {account && <NotificationsPopover />}
            <HeaderProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
