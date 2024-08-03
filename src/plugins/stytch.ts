import { StytchUIClient } from "@stytch/vanilla-js";

const stytch = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN);

export default stytch;
