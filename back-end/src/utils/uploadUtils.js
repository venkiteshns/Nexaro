import cloudinary from "../config/cloudinary.js";

export const uploadManyFiles = async (files, folder) => {
    
    
    try {
        if (!files || Object.keys(files).length === 0) {
            throw new Error("No files received for uploading ")
        }

        const uploadPromises = Object.entries(files).map(
            async ([fieldName, fileArray]) => {
                const result = await cloudinary.uploader.upload(
                    fileArray[0].path, {
                    folder: `Nexaro/${folder}`,
                    resource_type: "auto",
                })
                return {
                    fieldName,
                    url: result.secure_url,
                    format: result.format,
                    public_id: result.public_id
                }
            })

        const uploadResult = await Promise.all(uploadPromises);

        const result = {};

        uploadResult.forEach((file) => {
            result[file.fieldName] = {
                url: file.url,
                format: file.format,
                public_id: file.public_id
            };
        });
    console.log("-------------------------------------------------");

        console.log("res", result)
    console.log("-------------------------------------------------");

        return result;

    } catch (error) {
        console.log("Error in uploading files : ", error)
        return { error }
    }
}