#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { LambdaUtils } from "./LambdaUtils";
import * as fs from "fs";
import * as path from "path";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";

export class FovusProjectS3Stack extends cdk.Stack {
  bucketName: string;
  bucket:s3.Bucket;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Create an S3 bucket
    this.bucketName = "1229544838-fovus-bucket-v2";
    this.bucket = new s3.Bucket(this, id, {
      bucketName: this.bucketName,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change to RETAIN if you want to keep the bucket when stack is deleted
      //autoDeleteObjects: true // Automatically delete objects when bucket is deleted
    });

    // Add CORS configuration to the bucket
    this.bucket.addCorsRule({
      allowedMethods: [
        s3.HttpMethods.GET,
        s3.HttpMethods.PUT,
        s3.HttpMethods.POST,
        s3.HttpMethods.DELETE,
      ],
      allowedOrigins: ["*"], // Update this to the specific origin you want to allow or '*' to allow from any origin
      allowedHeaders: ["*"], // Update this to the specific headers you want to allow or '*' to allow any headers
    });

    const scriptFileName = "scripts\\script.py"; // Change to the name of your script file
    const scriptFolderPath = process.cwd(); // Current working directory
    const scriptFilePath = path.join(scriptFolderPath, scriptFileName);

    console.log(scriptFilePath);


    // if (fs.existsSync(scriptFilePath)) {
    //   // Upload the script file to the S3 bucket
    //   console.log("deploying");
    //   new BucketDeployment(this, "ScriptDeployment", {
    //     sources: [Source.asset(scriptFolderPath)],
    //     destinationBucket: this.bucket,
    //     destinationKeyPrefix: "script.py",
    //     retainOnDelete: false,
    //     prune: false,
    //   });

    //   console.log(`Script file '${scriptFileName}' uploaded to S3.`);
    // } else {
    //   console.error(`Script file '${scriptFileName}' not found.`);
    // }

    // if (fs.existsSync(scriptFilePath)) {
    //   const scriptContent = fs.readFileSync(scriptFilePath, "utf-8");
    //   const objectKey = `script.py`; // Upload to a specific folder in the bucket

    //   this.bucket.addObject(objectKey, {
    //     contentType: "py",
    //     content: scriptContent,
    //   });
    // } else {
    //   console.error(`Script file '${scriptFileName}' not found.`);
    // }

    //Check if the script file exists

    this.bucket.grantReadWrite(
      LambdaUtils.createUploadHandler(this, "fileHandler")
    );
  }
}
