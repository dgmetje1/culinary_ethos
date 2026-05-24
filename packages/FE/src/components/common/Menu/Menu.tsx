import { forwardRef, PropsWithChildren, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

import logo from '@/assets/Logo.svg';
import Tabs, { Tab, TabContent, TabsHeader } from '@/components/common/Tabs';
import { useAuthContext } from '@/context/Auth';

import { MenuProps } from './types';

const Menu = forwardRef<HTMLDivElement, PropsWithChildren<MenuProps>>(
  ({ children, defaultTab, open, toggleMenu }, ref) => {
    const { t } = useTranslation();
    const { account } = useAuthContext();

    const regularLinks = useMemo(
      () => (
        <>
          <Link onClick={toggleMenu(false)} to="/">
            {t('menu.sidebar.home')}
          </Link>
          <Link onClick={toggleMenu(false)} to="/plans">
            {t('menu.sidebar.plans')}
          </Link>
          <Link onClick={toggleMenu(false)} to="/purchase-list">
            {t('menu.sidebar.purchase_list')}
          </Link>
        </>
      ),
      [t, toggleMenu],
    );

    const managementLinks = useMemo(
      () => (
        <>
          <Link
            activeOptions={{ exact: true }}
            onClick={toggleMenu(false)}
            to="/management"
          >
            {t('menu.sidebar.management')}
          </Link>
          <Link onClick={toggleMenu(false)} to="/management/units">
            {t('menu.sidebar.units')}
          </Link>
          <Link onClick={toggleMenu(false)} to="/management/ingredients">
            {t('menu.sidebar.ingredients')}
          </Link>
          <Link onClick={toggleMenu(false)} to="/management/kitchenware">
            {t('menu.sidebar.kitchenware')}
          </Link>
        </>
      ),
      [t, toggleMenu],
    );

    const sidebarContent = (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '0.5rem 1rem 1rem',
          }}
        >
          <img
            alt="logo Culinary Ethos"
            height={75}
            src={logo}
            loading="lazy"
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 250,
            padding: '0 0.75rem',
            rowGap: '0.25rem',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: 1.25,
          }}
          role="presentation"
        >
          {account ? (
            <Tabs defaultIndex={defaultTab}>
              <TabsHeader>
                <Tab label={t('menu.sidebar.tabs.application')} />
                <Tab label={t('menu.sidebar.tabs.management')} />
              </TabsHeader>
              <TabContent
                contentIndex={0}
                display="flex"
                flexDirection="column"
                rowGap={2}
              >
                {regularLinks}
              </TabContent>
              <TabContent
                contentIndex={1}
                display="flex"
                flexDirection="column"
                rowGap={2}
              >
                {managementLinks}
              </TabContent>
            </Tabs>
          ) : (
            regularLinks
          )}
        </div>
        {children}
      </>
    );

    if (!open) return null;

    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={toggleMenu(false)}
        />
        <div
          ref={ref}
          className="fixed top-0 left-0 z-50 h-full bg-white dark:bg-stone-950 shadow-xl overflow-y-auto"
          style={{ minWidth: 280 }}
        >
          <button
            onClick={toggleMenu(false)}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
          {sidebarContent}
        </div>
      </>
    );
  },
);

export default Menu;
