import { useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { RouterProvider } from "@tanstack/react-router";

import withAuth from "@/components/hoc/Auth";
import { Toaster } from "sonner";
import getRouter from "@/config/routing";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { SearchProvider } from "@/context/Search";
import i18n from "@/i18n";
import { Api } from "@/lib/api";
import { queryClient } from "@/lib/core/queryClient";
import { Language } from "@/types/user";

const router = getRouter(queryClient);
const App = () => {
  const { isAuthenticated, isLoading: isAuthenticatedLoading } = useAuth0();
  const { accessToken, isAccessTokenLoading, account } = useAuthContext();

  useEffect(() => {
    Api.setLanguage(i18n.language as Language);
  }, []);

  const authContext = useMemo(
    () => ({
      isAuthenticated,
      isAuthenticatedLoading,
      isAccessTokenLoading,
      accessToken,
      account,
    }),
    [accessToken, isAccessTokenLoading, isAuthenticated, isAuthenticatedLoading, account],
  );

  return (
    <SearchProvider>
      <RouterProvider context={{ authContext }} router={router!} />
      <Toaster position="top-center" richColors={true} />
    </SearchProvider>
  );
};

export default withAuth(App);
