import { createUploadthing } from "uploadthing/server";

const f = createUploadthing({
  errorFormatter: (err) => {
    console.error("UploadThing error:", err);
    return {
      message: err.message,
    };
  },
});

export const uploadRouter = {
  frameImageUploader: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 1 
    } 
  })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),
};
