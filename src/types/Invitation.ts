import { AccessLevel } from "./AccessLevel";

export interface InvitationOptions {
  maxUses: number;
  expiresIn: number;
  accessLevels: AccessLevel[];
}
