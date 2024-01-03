import { getCurrentUser } from '@/lib/session'
import { getAdmin } from '@/lib/admin'

import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

const f = createUploadthing()

const middleware = async () => {
  const user = await getCurrentUser()
  if (!user || !user.id) throw new Error('Unauthorized')
  const isAdmin = await getAdmin(user.id)
  if (!isAdmin) throw new Error('Unauthorized')
  return { userId: user.id }
}

const onUploadPrinterThumbnail = async ({
  // metadata,
  file,
}: {
  // metadata: Awaited<ReturnType<typeof middleware>>
  file: {
    key: string
    url: string
  }
}) => {
  return JSON.stringify(file)
}

const onUploadLayer = async ({
  file,
}: {
  file: {
    key: string
    url: string
  }
}) => {
  return JSON.stringify(file)
}

export const ourFileRouter = {
  printerThumbnail: f(["image/jpeg", "image/png", "image/svg+xml"])
    .middleware(middleware)
    .onUploadComplete(onUploadPrinterThumbnail),
  layerImage: f(["image/png", "image/svg+xml"])
    .middleware(middleware)
    .onUploadComplete(onUploadLayer),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
