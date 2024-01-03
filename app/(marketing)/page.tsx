import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Balancer from "react-wrap-balancer"
import { Icons } from "@/components/shared/icons"
import {
  ArrowPathRoundedSquareIcon,
  ArrowUpRightIcon,
  CubeTransparentIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline'
import Container from "@/components/container"


export default async function IndexPage() {

  return (
    <>
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <Container className="flex max-w-[64rem] flex-col items-center gap-5 text-center">
          <Link
            href="https://x.com/m3tamonk/status/1643567236676739072?s=20"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "animate-fade-up opacity-0")}
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            target="_blank"
          >
            Introduced on <Icons.twitter className="ml-2 h-4 w-4" />
          </Link>

          <h1
            className="font-urban animate-fade-up text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Limitless {" "}
              <span className="relative bg-clip-text font-extrabold text-transparent bg-gradient-to-r from-gray-900 dark:from-gray-400 to-gray-400/80 dark:to-white/80">
                Creativity
              </span>
            </Balancer>
          </h1>

          <p
            className="max-w-[42rem] animate-fade-up leading-normal text-muted-foreground opacity-0 sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Discover tools for the next generation of ideas.
            </Balancer>
          </p>
        </Container>
      </section>
      
      <section
        className="animate-fade-up py-16 opacity-0"
        style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
      >
        <Container>
          <div className="divide-x-0 divide-y divide-border overflow-hidden border sm:grid sm:grid-cols-2 sm:gap-px sm:divide-x sm:divide-y-0">
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
                <ArrowUpRightIcon className="pointer-events-none absolute right-6 top-6  h-6 w-6 group-hover:text-gray-400" aria-hidden="true" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}

const actions = [
  {
    live: true,
    title: 'Generate',
    description: 'Create a signature for any RGB value.',
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