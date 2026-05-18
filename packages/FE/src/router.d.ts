import type { AppRouter } from '@/config/routing';
import type { queryClient } from '@/lib/core/queryClient';

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
