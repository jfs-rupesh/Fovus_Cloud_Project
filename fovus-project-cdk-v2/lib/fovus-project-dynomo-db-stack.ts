import { Stack } from "@aws-cdk/core";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";
import { LambdaUtils } from "./LambdaUtils";
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambdaEventSources from "@aws-cdk/aws-lambda-event-sources";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class FovusProjectDynamoDBStack extends Stack {
  fileTable: Table;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the DynamoDB table
    this.fileTable = new Table(this, "FileUploadTableV2", {
      partitionKey: { name: "id", type: AttributeType.STRING }, //primary key,
      tableName: "FileUploadTableV2", //added this table
      stream: dynamodb.StreamViewType.NEW_IMAGE, // Choose the stream view type as per your requirement
    });

    this.fileTable.grantReadWriteData(
      LambdaUtils.createUploadHandler(this, "fileHandler")
    );

    const handler = LambdaUtils.triggerDynomoDBHandler(this, "dynomoDbHandler");

    this.fileTable.grantStreamRead(handler);

    // Add DynamoDB stream trigger to Lambda function
    handler.addEventSource(
      new lambdaEventSources.DynamoEventSource(this.fileTable, {
        batchSize: 100, // Adjust batch size as needed
        startingPosition: lambda.StartingPosition.TRIM_HORIZON, // Choose where to start processing from
      })
    );

    //add rule method
    // Create a rule to capture DynamoDB insert events for the specific table
    // const rule = new events.Rule(this, "DynamoDBEventRule", {
    //   eventPattern: {
    //     source: ["aws.dynamodb"],
    //     detail: {
    //       eventSource: ["dynamodb.amazonaws.com"],
    //       eventName: ["InsertItem"],
    //       requestParameters: {
    //         tableName: [this.fileTable.tableName],
    //       },
    //     },
    //   },
    // });

    // rule.addTarget(
    //   new targets.LambdaFunction(LambdaUtils.triggerDynomoDBHandler(this,"dynomoDbHandler"))
    // );

    //1st
    // Add trigger to Lambda function for DynamoDB insert events not working
    //    this.fileTable.onEvent('DynamoDBInsertEvent', {
    //     eventPattern: {
    //       source: ['aws.dynamodb'],
    //       detailType: ['AWS API Call via CloudTrail'],
    //       detail: {
    //         eventSource: ['dynamodb.amazonaws.com'],
    //         eventName: ['InsertItem'],
    //         requestParameters: {
    //           tableName: [myDynamoDBTable.tableName],
    //         },
    //       },
    //     },
    //     target: new lambda.LambdaFunction(myLambdaFunction),
    //   });

    //2nd
    //this.fileTable.onInsert('DynamoDBInsertTrigger', myLambdaFunction); //error doesn not exits
  }
}
