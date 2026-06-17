import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: `${import.meta.env.VITE_API_URL || 'https://meomiry-backend.vercel.app'}/api/uploadthing`,
});
