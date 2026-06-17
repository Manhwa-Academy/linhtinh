import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "../backend/uploadthing.js";

export default createRouteHandler({
  router: uploadRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});
