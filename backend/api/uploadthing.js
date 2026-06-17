import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../uploadthing.js";
import dotenv from 'dotenv';

// Load environment variables explicitly
dotenv.config();

console.log("[UploadThing] Initializing handler...");
console.log("[UploadThing] Token present:", !!process.env.UPLOADTHING_TOKEN);
console.log("[UploadThing] Token value:", process.env.UPLOADTHING_TOKEN?.substring(0, 20) + '...');

// Create the UploadThing route handler (returns request handler function)
const routeHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});

console.log("[UploadThing] Handler created successfully, type:", typeof routeHandler);

// Export for Vercel serverless
export default async function handler(req, res) {
  console.log(`[UploadThing] Incoming request: ${req.method} ${req.url}`);
  console.log("[UploadThing] Query params:", req.query);
  console.log("[UploadThing] Token check inside handler:", !!process.env.UPLOADTHING_TOKEN);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, uploadthing-hook');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log("[UploadThing] Handling OPTIONS preflight");
    return res.status(200).end();
  }
  
  try {
    console.log("[UploadThing] Calling route handler...");
    
    // Intercept response to log it
    const originalJson = res.json;
    const originalSend = res.send;
    const originalEnd = res.end;
    
    res.json = function(data) {
      console.log("[UploadThing] Response JSON:", JSON.stringify(data).substring(0, 200));
      return originalJson.call(this, data);
    };
    
    res.send = function(data) {
      console.log("[UploadThing] Response send:", typeof data, data?.toString().substring(0, 200));
      return originalSend.call(this, data);
    };
    
    res.end = function(data) {
      console.log("[UploadThing] Response end:", res.statusCode);
      return originalEnd.call(this, data);
    };
    
    // Call the UploadThing handler
    const result = await routeHandler(req, res);
    console.log("[UploadThing] Handler completed");
    return result;
  } catch (error) {
    console.error("[UploadThing] Error:", error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
