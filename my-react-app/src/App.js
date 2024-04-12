import React, { useState } from "react";
import AWS from "aws-sdk";
import "./index.css";

const S3Uploader = () => {
  const [file, setFile] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);

  const region = "us-east-1";
  const accessKeyId = "AKIA5H3OM7OEVXS3JPMT";
  const secretAccessKey = "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";

  const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
  });

  const bucketName = "1229544838-fovus-bucket";
  const apiEndpoint = "https://o9c18zlqvi.execute-api.us-east-1.amazonaws.com/Dev/uploadFile";

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const uploadFile = async () => {
    setLoading(true);

    debugger;
    const fileName = file.name;

    // const rawBytes = await randomBytes(4)
    // fileName = fileName+'_'+rawBytes.toString('hex')

    try {
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Expires: 60,
      };

      const presignedUrl = await s3.getSignedUrlPromise("putObject", params);

      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
      });

      if (response.ok) {
        console.log("File uploaded successfully");

        debugger;
        const filePath = `s3://${bucketName}/${fileName}`;

        await insertDataToDynamoDB(filePath, textValue);
      } else {
        console.error("Failed to upload file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const insertDataToDynamoDB = async (filePath, textValue) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ s3Path: filePath, inputText:textValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to insert data into DynamoDB");
      }

      console.log("Data inserted into DynamoDB successfully");
    } catch (error) {
      console.error("Error inserting data into DynamoDB:", error);
    }
  };

  return (
    <div className="s3-uploader-container">
      <input type="file" onChange={handleFileChange} />
      <input type="text" value={textValue} onChange={handleTextChange} placeholder="Enter text..." />
      <button className="upload-button" onClick={uploadFile} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default S3Uploader;
