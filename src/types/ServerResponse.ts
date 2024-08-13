import { ErrorType } from "@/types/ErrorType";

export type ServerResponse = SuccessServerResponse | ServerResponseError;

export interface SuccessServerResponse {
  success: true;
}

export interface ServerResponseError {
  success: false;
  errorType: ErrorType;
  error?: Error;
}
