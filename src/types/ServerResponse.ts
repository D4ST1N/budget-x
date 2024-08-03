export interface ServerResponse {
  success: boolean;
  message: string;
}

export interface ServerResponseError extends ServerResponse {
  success: false;
  error: Error;
}
