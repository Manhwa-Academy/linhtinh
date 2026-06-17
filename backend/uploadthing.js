import { createUploadthing } from "uploadthing/server";
import { UTApi } from "uploadthing/server";

console.log('[UploadThing] Initializing... Token exists:', !!process.env.UPLOADTHING_TOKEN);

const f = createUploadthing({
  token: process.env.UPLOADTHING_TOKEN,
});

// Initialize UTApi for file management (delete, list, etc.)
export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

// Helper function to extract file key from UploadThing URL
export function extractFileKey(url) {
  if (!url) return null;
  
  // URL formats:
  // https://utfs.io/f/FILE_KEY
  // https://APP_ID.ufs.sh/f/FILE_KEY
  const match = url.match(/\/f\/([^/?]+)/);
  return match ? match[1] : null;
}

// Delete file from UploadThing
export async function deleteUploadThingFile(url) {
  const fileKey = extractFileKey(url);
  if (!fileKey) {
    console.log('[UploadThing] No valid file key found in URL:', url);
    return false;
  }
  
  try {
    console.log('[UploadThing] Deleting file with key:', fileKey);
    await utapi.deleteFiles(fileKey);
    console.log('[UploadThing] File deleted successfully');
    return true;
  } catch (error) {
    console.error('[UploadThing] Error deleting file:', error);
    return false;
  }
}

export const uploadRouter = {
  frameImageUploader: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async ({ req }) => {
      console.log('[UploadThing Router] middleware called for:', req?.url);
      // Không yêu cầu auth - admin page tự handle
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("[UploadThing Router] Upload complete:", file.url);
      return { url: file.url };
    }),
};

console.log('[UploadThing] Router created with routes:', Object.keys(uploadRouter));
