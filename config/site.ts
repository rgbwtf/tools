import { env } from "@/env.mjs";
import { SiteConfig } from "types"

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "RBG Tools",
  description:
    "A canvas for limitless creativity.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    lab: "https://ratlabs.xyz",
    twitter: "https://twitter.com/rgb_eth",
    github: "https://github.com/rgbwtf/tools",
  },
  mailSupport: "support@rgb.tools"
}
