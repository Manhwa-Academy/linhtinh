import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../backend/uploadthing.js";

// Create the UploadThing route handler
const handlers = createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});

// Export for Vercel serverless - handle both GET and POST
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Call UploadThing handler
  return handlers(req, res);
}
