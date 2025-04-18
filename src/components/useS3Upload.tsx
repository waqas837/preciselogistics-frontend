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

const useS3Uploader = () => {
  const [files, setFiles] = useState<File[]>([]);

  // Mock S3 config (no need for real AWS SDK here)
  const S3_BUCKET = "wbucket789";
  const REGION = "eu-north-1";

  // Mock upload function (no real S3 interaction)
  const uploadImageToS3 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Simulating a random delay to mock an actual upload process
      setTimeout(() => {
        // Mock file URL generation
        const fileUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${file.name}?mocked=true`;
        console.log("✅ Mock upload successful:", fileUrl);
        resolve(fileUrl);
      }, 1000); // simulate a 1 second delay for upload
    });
  };

  const handleUpload = async () => {
    const uploadPromises = files.map(uploadImageToS3);
    const urls = await Promise.all(uploadPromises);
    setFiles([]); // optional: reset after upload
    return urls;
  };

  return {
    files,
    setFiles,
    handleUpload,
  };
};

export default useS3Uploader;

