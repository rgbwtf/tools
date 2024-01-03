import { UTApi } from "uploadthing/server";
import { env } from '@/env.mjs';

// const getUtapi = new UTApi({
//   fetch: globalThis.fetch,
//   apiKey: process.env.UPLOADTHING_SECRET,
// })

// export const utapi = async () => {
//   return getUtapi;
// }

export const utapi = new UTApi({
  apiKey: env.UPLOADTHING_SECRET,
});

export type UploadFileResponse =
| { data: UploadData; error: null }
| { data: null; error: UploadError };

export type UploadData = {
  key: string;
  url: string;
  name: string;
  size: number;
};

export type UploadError = {
  code: string;
  message: string;
  data: any;
};