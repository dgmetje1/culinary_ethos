import { useRouter } from "@tanstack/react-router";

interface RouteContext {
  getTitle?: () => string;
  authContext?: {
    isAuthenticated: boolean;
    isAuthenticatedLoading: boolean;
    isAccessTokenLoading: boolean;
    accessToken: string | null;
  };
  queryClient: unknown;
}

export default () => {
  const router = useRouter();

  const matchWithTitle = [...router.state.matches].reverse().find(
    (d): d is typeof d & { context: RouteContext } => typeof d.context.getTitle === "function"
  );

  return matchWithTitle?.context.getTitle();
};
