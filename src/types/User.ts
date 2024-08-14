import { User } from "@stytch/vanilla-js";
import { SuccessServerResponse } from "./ServerResponse";

export interface UserVerificationResponse extends SuccessServerResponse {
  user: User;
}

export interface UserProvider {
  oauth_user_registration_id: string;
  provider_subject: string;
  provider_type: string;
  profile_picture_url: string;
  locale: string;
}

export interface UserData {
  name: {
    first_name: string;
    last_name: string;
    middle_name: string;
  };
  user_id: string;
  providers: UserProvider[];
}
