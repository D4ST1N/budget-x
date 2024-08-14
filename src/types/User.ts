import { User } from "@stytch/vanilla-js";
import { SuccessServerResponse } from "./ServerResponse";

export interface UserVerificationResponse extends SuccessServerResponse {
  user: User;
}
