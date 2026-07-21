import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearch } from "@tanstack/react-router";

import { Route } from "@/config/routing/routes/login";

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const { redirect } = useSearch({ from: Route.id });

  useEffect(() => {
    loginWithRedirect({
      appState: { returnTo: redirect },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LoginPage;
