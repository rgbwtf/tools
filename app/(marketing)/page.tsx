import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn, nFormatter } from "@/lib/utils"
import Balancer from "react-wrap-balancer"
import { Icons } from "@/components/shared/icons"
import { env } from "@/env.mjs"
import {
  ArrowPathRoundedSquareIcon,
  ArrowUpRightIcon,
  CubeTransparentIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline'


export default async function IndexPage() {

  return (
    <>
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <div className="container flex max-w-[64rem] flex-col items-center gap-5 text-center">
          <Link
            href="https://twitter.com/miickasmt/status/1719892161095745801"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "animate-fade-up opacity-0")}
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            target="_blank"
          >
            Introducing on <Icons.twitter className="ml-2 h-4 w-4" />
          </Link>

          <h1
            className="animate-fade-up font-urban text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Kick off with a bang with{" "}
              <span className="relative bg-gradient-to-r from-indigo-500 to-purple-500/80 bg-clip-text font-extrabold text-transparent">
                SaaS Starter
              </span>
            </Balancer>
          </h1>

          <p
            className="max-w-[42rem] animate-fade-up leading-normal text-muted-foreground opacity-0 sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Build your next project using Next.js 14, Prisma, Planetscale, Auth.js, Resend, React Email, Shadcn/ui, Stripe.
            </Balancer>
          </p>
        </div>
      </section>
      
      <section
        className="container animate-fade-up py-16 opacity-0"
        style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
      >
        <div className="divide-y divide-x-0 border divide-border overflow-hidden sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0 sm:divide-x">
          {actions.map((action, actionIdx) => (
            <div
              key={actionIdx}
              className={cn(
                !action.live ? 'text-gray-600' : '',
                'group relative p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-200'
              )}
            >
              <div>
                <span
                  className={cn(
                    !action.live ? 'bg-gray-600 text-gray-300' : action.iconBackground,
                    !action.live ? 'bg-gray-600 text-gray-300' : action.iconForeground,
                    !action.live ? 'ring-gray-300' : 'ring-white',
                    'inline-flex p-3 ring-2'
                  )}
                >
                  {action.live ? (
                    <action.icon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <CubeTransparentIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6">
                  <a href={action.href} className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.live ? action.title : 'Coming Soon'}
                  </a>
                </h3>
                <p className="mt-2 text-sm">
                  {action.live ? action.description : 'Stay tuned for updates on this feature.'}
                </p>
              </div>
              <ArrowUpRightIcon className="pointer-events-none absolute right-6 top-6  group-hover:text-gray-400 h-6 w-6" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const actions = [
  {
    live: true,
    title: 'Generate',
    description: 'Manage your team’s time off requests',
    href: '/generate',
    icon: ArrowPathRoundedSquareIcon,
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-50',
  },
  {
    live: false,
    title: 'Print',
    href: '#',
    icon: PrinterIcon,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
  },
]