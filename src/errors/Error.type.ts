export interface ErrorProps {
  cause?: Error;
  message?: string;
  action?: string;
  statusCode?: number;
}
