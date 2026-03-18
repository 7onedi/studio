import { z } from "zod";

const socialLinkSchema = z.object({
  platform: z.enum([
    "YOUTUBE",
    "INSTAGRAM",
    "FACEBOOK",
    "TWITTER",
    "TIKTOK",
  ]),
  url: z.string().url(),
});

export { socialLinkSchema };