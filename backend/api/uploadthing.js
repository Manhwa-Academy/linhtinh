import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../uploadthing.js";
import dotenv from 'dotenv';

dotenv.config();

const routeHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  }, 
});

// Export for Vercel serverless
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, uploadthing-hook, x-uploadthing-version, x-uploadthing-be-adapter, x-uploadthing-fe-package');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    return await routeHandler(req, res);
  } catch (error) {
    console.error("[UploadThing] Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
}
