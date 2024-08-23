import { ErrorType } from "@/types/ErrorType";

export type ServerResponse = {} | ServerResponseError;

export interface ServerResponseError {
  errorType: ErrorType;
  error?: Error;
}
