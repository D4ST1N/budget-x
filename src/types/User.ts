import { ServerResponse } from "./ServerResponse";
import { User } from "@stytch/vanilla-js";

export interface UserVerificationResponse extends ServerResponse {
  user: User;
}
