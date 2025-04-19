// import { useState } from "react";
// import { Buffer } from "buffer";
// import AWS from "aws-sdk";

// Buffer.from("anything", "base64");
// window.Buffer = window.Buffer;

// const useS3Uploader = () => {
//   const [files, setFiles] = useState<File[]>([]);

//   const S3_BUCKET = "wbucket789";
//   const REGION = "eu-north-1";

//   AWS.config.update({
//     accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY,
//     secretAccessKey: import.meta.env.VITE_APP_SECRET_KEY,
//   });

//   const myBucket = new AWS.S3({
//     params: { Bucket: S3_BUCKET },
//     region: REGION,
//   });

//   const uploadImageToS3 = (file: File): Promise<string> => {
//     const params = {
//       Body: file,
//       Bucket: S3_BUCKET,
//       Key: file.name,
//       ContentType: file.type,
//     };

//     return new Promise((resolve, reject) => {
//       myBucket.putObject(params).send((err) => {
//         if (err) {
//           console.error("Upload Error:", err);
//           reject(err);
//         } else {
//           const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.name}`;
//           console.log("✅ File uploaded:", fileUrl);
//           resolve(fileUrl);
//         }
//       });
//     });
//   };

//   const handleUpload = async () => {
//     const uploadPromises = files.map(uploadImageToS3);
//     const urls = await Promise.all(uploadPromises);
//     setFiles([]); // optional: reset after upload
//     return urls;
//   };

//   return {
//     files,
//     setFiles,
//     handleUpload,
//   };
// };

// export default useS3Uploader;

import { useState } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const useS3Uploader = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const S3_BUCKET = "wbucket789";
  const REGION = "eu-north-1";

  // Create S3 client
  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_APP_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_APP_SECRET_KEY,
    },
  });

  const uploadImageToS3 = async (file: File) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    try {
      // Use the Upload utility instead of PutObjectCommand
      // This handles larger files and stream issues in browsers
      const upload = new Upload({
        client: s3Client,
        params: params,
      });

      await upload.done();

      const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.name}`;
      console.log("✅ File uploaded:", fileUrl);
      return fileUrl;
    } catch (err) {
      console.error("Upload Error:", err);
      throw err;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return [];

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(uploadImageToS3);
      const urls = await Promise.all(uploadPromises);
      setFiles([]);
      return urls;
    } catch (err: any) {
      setError(err.message || "Upload failed");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    files,
    setFiles,
    handleUpload,
    isUploading,
    error,
  };
};

export default useS3Uploader;
