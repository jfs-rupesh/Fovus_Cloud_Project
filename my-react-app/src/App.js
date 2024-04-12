import React, { useState } from "react";
import AWS from "aws-sdk";
import "./index.css";

const S3Uploader = () => {
  const [file, setFile] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // New state for success popup

  const base64EncodedConfig = process.env.REACT_APP_AWS_CONFIG_BASE64;
  const awsConfig = JSON.parse(atob(base64EncodedConfig));

  const s3 = new AWS.S3(awsConfig);

  const bucketName = process.env.REACT_APP_S3_BUCKET_NAME;
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const uploadFile = async () => {
    setLoading(true);

    const fileName = file.name;

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

        const filePath = `s3://${bucketName}/${fileName}`;

        await insertDataToDynamoDB(filePath, textValue);
        setUploadSuccess(true); 
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
        body: JSON.stringify({ s3Path: filePath, inputText: textValue }),
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
      <input
        type="text"
        value={textValue}
        onChange={handleTextChange}
        placeholder="Enter text..."
      />
      <button
        className="upload-button"
        onClick={uploadFile}
        disabled={!file || loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
      {uploadSuccess && (
        <div className="success-popup">
          <p>File uploaded successfully!</p>
          {/* You can add additional content or styling for the popup */}
        </div>
      )}
    </div>
  );
};

export default S3Uploader;