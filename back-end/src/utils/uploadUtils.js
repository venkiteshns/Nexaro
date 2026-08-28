import cloudinary from "../config/cloudinary.js";
import path from "path";
import fs from "fs"
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";

// export const uploadManyFiless = async (files, folder) => {

//     try {
//         if (!files || Object.keys(files).length === 0) {
//             throw new Error("No files received for uploading ")
//         }

//         const uploadPromises = Object.entries(files).map(
//             async ([fieldName, fileArray]) => {
//                 // console.log("fileArray", fieldName, fileArray);
//                 const result = await cloudinary.uploader.upload(
//                     fileArray[0].path, {
//                     folder: `Nexaro/${folder}`,
//                     resource_type: "auto",
//                 })
//                 return {
//                     fieldName,
//                     url: result.secure_url,
//                     format: result.format,
//                     public_id: result.public_id
//                 }
//             })

//         const uploadResult = await Promise.all(uploadPromises);

//         const result = {};

//         uploadResult.forEach((file) => {
//             result[file.fieldName] = {
//                 url: file.url,
//                 format: file.format,
//                 public_id: file.public_id
//             };
//         });
//         console.log("-------------------------------------------------");
//         console.log("res", result)
//         console.log("-------------------------------------------------");

//         return result;

//     } catch (error) {
//         console.log("Error in uploading files : ", error)
//         return { error }
//     }
// }

export const uploadManyFiles = async (files, folder) => {
    try {
        if (!files || Object.keys(files).length === 0) {
            throw new Error("No files received for uploading")
        }

        const uploadPromises = Object.entries(files).map(
            async ([filedName, fileArray]) => {
                const file = fileArray[0];

                const extension = path.extname(file.originalname);

                const fileName = `${randomUUID()}${extension}`;

                const key = `Nexaro/${folder}/${fileName}`;

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: fs.createReadStream(file.path),
                    ContentType: file.mimetype,
                })

                await s3.send(command);

                await fs.promises.unlink(file.path);

                const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

                return {
                    filedName,
                    url,
                    format: file.mimetype,
                    key
                }

            }
        )

        const uploadResults = await Promise.all(uploadPromises);

        const result = {};

        uploadResults.forEach((file) => {
            result[file.filedName] = {
                url: file.url,
                format: file.format,
                key: file.key,
            }
        })

        console.log("-------------------------------------------------");
        console.log("res", result);
        console.log("-------------------------------------------------");

        return result;
    } catch (error) {
        console.log("Error in uploading files : ", error);
        return { error }
    }
}