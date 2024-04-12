import * as cdk from '@aws-cdk/core';
import { FovusProjectS3Stack } from './fovus-project-s3-stack';
import { FovusProjectApiStack } from './fovus-project-api-gateway-stack';
import { FovusProjectDynamoDBStack } from './fovus-project-dynomo-db-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class FovusProjectCdkV2Stack extends cdk.Stack {
  s3Stack: FovusProjectS3Stack;
  apiGatewayStack: FovusProjectApiStack;
  dynomoStack: any;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
     this.s3Stack= new FovusProjectS3Stack(scope ,'FovusProjectS3Stack',props);
     this.apiGatewayStack= new FovusProjectApiStack(scope ,'FovusProjectApiStack',props);
     this.dynomoStack= new FovusProjectDynamoDBStack(scope ,'FovusProjectDynamoDBStack',props);

  }
}






