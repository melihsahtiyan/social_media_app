import { v2 as cloudinary } from "cloudinary";

export async function handleUpload(
  file: string,
  folder: string
): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const res: string = await cloudinary.uploader
    .upload(file, {
      resource_type: "auto",
      folder: folder,
    })
    .then((result) => {
      return result.secure_url;
    })
    .catch((error) => {
      throw error.stack;
    });

  console.log("File Upload:", res);

  const publicId: string =
    res.split("/")[7] +
    "/" +
    res.split("/")[8] +
    "/" +
    res.split("/")[9].split(".")[0];
  return publicId;
}

export async function handleDelete(publicId: string): Promise<boolean> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const res: boolean = await cloudinary.uploader
    .destroy(publicId)
    .then((result) => {
      console.log("Result: ", result);
      console.log("Result public Id: ", publicId);

      return result;
    })
    .catch((error) => {
      throw error.stack;
    });

  console.log(res);

  return res;
}
