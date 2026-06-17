import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../uploadthing.js";

console.log('[UploadThing API] Module loaded, uploadRouter:', Object.keys(uploadRouter));

const handler = createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  }, 
});

console.log('[UploadThing API] Handler created');

// Export for Vercel serverless
export default async function uploadthingHandler(req, res) {
  console.log('[UploadThing Handler] Request:', req.method, req.url);
  console.log('[UploadThing Handler] Token exists:', !!process.env.UPLOADTHING_TOKEN);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, uploadthing-hook, x-uploadthing-version, x-uploadthing-be-adapter, x-uploadthing-fe-package');

  if (req.method === 'OPTIONS') {
    console.log('[UploadThing Handler] OPTIONS request - returning 200');
    return res.status(200).end();
  }

  try {
    console.log('[UploadThing Handler] Calling handler...');
    
    // Call handler and wait for completion
    await handler(req, res);
    
    console.log('[UploadThing Handler] Handler completed, headers sent:', res.headersSent);
  } catch (error) {
    console.error("[UploadThing Handler] Error:", error);
    console.error("[UploadThing Handler] Error stack:", error.stack);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message, stack: error.stack });
    }
  }
}
