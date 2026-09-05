export type RequestConfig = {
  withAuth?: boolean;
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, unknown>;
};
