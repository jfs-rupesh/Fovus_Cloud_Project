import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
export class LambdaUtils {
  private static uploadHandler: lambda.Function | undefined;
  private static dynomoDbHandler: lambda.Function | undefined;

  static createUploadHandler(scope: cdk.Stack, id: string): lambda.Function {
    if (!LambdaUtils.uploadHandler) {
      const lambdaAssetPath = new lambda.AssetCode(
        "assets/lambda/uploadHandler.zip"
      );
      LambdaUtils.uploadHandler = new lambda.Function(scope, id, {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "index.handler",
        code: lambdaAssetPath,
      });
    }

    return LambdaUtils.uploadHandler;
  }

  //lambda to trigger ec2
  static triggerDynomoDBHandler(scope: cdk.Stack, id: string): lambda.Function {
    if (!LambdaUtils.dynomoDbHandler) {
      const lambdaAssetPath = new lambda.AssetCode(
        "assets/lambda/dynomoDbHandler.zip"
      );
      LambdaUtils.dynomoDbHandler = new lambda.Function(scope, id, {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "index.handler",
        code: lambdaAssetPath,
        timeout: cdk.Duration.seconds(300),
        initialPolicy: [
          new iam.PolicyStatement({
            actions: [
              "ec2:*"
            ],
            resources: ["*"], // You can restrict the resources as needed
          }),
        ],
      });
    }

    return LambdaUtils.dynomoDbHandler;
  }
}
