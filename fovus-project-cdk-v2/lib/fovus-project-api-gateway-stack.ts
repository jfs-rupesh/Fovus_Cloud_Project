#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { LambdaUtils } from "./LambdaUtils";

export class FovusProjectApiStack extends cdk.Stack {
  api: any;
  integration: any;
  uploadResource: any;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an API Gateway
    this.api = new apigateway.RestApi(this, id);

    // Integrate API Gateway with the Lambda function
    this.integration = new apigateway.LambdaIntegration(
      LambdaUtils.createUploadHandler(this, "fileHandler")
    );

    this.uploadResource = this.api.root.addResource("uploadFileV2"); // Add the resource under '/upload'

    this.uploadResource.addMethod("POST", this.integration);
    // Enable CORS for the API Gateway resource
    this.enableCors();
  }

  private enableCors() {
    this.uploadResource.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: ["*"],
    });
  }
}
