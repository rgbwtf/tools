import { User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/shared/icons"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  mailSupport: string
  links: {
    lab: string,
    twitter: string
    github: string
  }
}

export type Printer = {
  id: string
  title: string
  image: string
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number
    isPaid: boolean
    interval: "month" | "year" | null
    isCanceled?: boolean
  }

export type UserAdmin = User & {
  permissions: string
}

export type SignatureProps = {
  binary: [string, string, string];
  className?: string;
}

export type RGB = {
	red: number;
	green: number;
	blue: number;
}

export type PaletteProps = {
	rgb: [number, number, number];
  className?: string;
}

export type ControlsProps = {
	handleDownload: () => void;
	randomRgb: () => void;
  className?: string;
}

declare global {
  interface File {
    path: string;
  }
}