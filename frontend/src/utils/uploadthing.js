import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: `${import.meta.env.VITE_API_URL || 'https://meomiry-backend.vercel.app'}/api/uploadthing`,
});

// Export helper function for direct file upload
export async function uploadFrameImage(file) {
  console.log('[UploadThing Client] Uploading file:', file.name, file.size);
  
  try {
    const result = await uploadFiles("frameImageUploader", {
      files: [file],
    });
    
    console.log('[UploadThing Client] Upload result:', result);
    return result;
  } catch (error) {
    console.error('[UploadThing Client] Upload error:', error);
    throw error;
  }
}
