import { generateReactHelpers } from "@uploadthing/react";

// UploadThing cần backend có thể truy cập từ internet để xác thực presigned URL.
// Luôn dùng production backend URL cho UploadThing negotiation.
const UPLOADTHING_BACKEND_URL = 'https://meomiry-backend.vercel.app';

export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: `${UPLOADTHING_BACKEND_URL}/api/uploadthing`,
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
