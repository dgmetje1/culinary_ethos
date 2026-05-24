import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import config from '@/config';
import { composeCdnUrl } from '@/lib/utils';
import { useAuthContext } from '@/context/Auth';

const HeaderProfileMenu = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { account } = useAuthContext();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleLogin = React.useCallback(() => {
    handleClose();
    loginWithRedirect();
  }, [loginWithRedirect]);

  const handleLogout = React.useCallback(() => {
    handleClose();
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);

  const handleGoToProfile = React.useCallback(() => {
    handleClose();
    router.navigate({ to: '/profile' as never });
  }, [router]);

  return (
    <div className="relative">
      <button
        aria-controls="menu-appbar"
        aria-haspopup="true"
        aria-label="account of current user"
        onClick={handleMenu}
        className="p-1 rounded-full hover:bg-stone-100"
      >
        {isAuthenticated && account?.profilePicture ? (
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={composeCdnUrl(config.cdnUrl, account.profilePicture)}
              alt={`${account?.nickName} profile picture`}
            />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="p-1.5 rounded-full bg-stone-100">
            <User className="w-5 h-5 text-stone-600" />
          </div>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} />
          <div
            id="menu-appbar"
            className="absolute right-0 top-full mt-2 z-50 min-w-[150px] py-1 bg-white dark:bg-stone-950 rounded-lg shadow-lg border border-stone-200 dark:border-stone-800"
          >
            {isAuthenticated ? (
              <>
                <div className="px-4 pb-2 pt-1 text-sm font-semibold text-stone-700">
                  {`Logged as ${user?.nickname}`}
                </div>
                <div className="h-px bg-stone-200 dark:bg-stone-800 my-1" />
                <button
                  onClick={handleGoToProfile}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full text-left px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Log in
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderProfileMenu;
