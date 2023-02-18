import * as cdk from 'aws-cdk-lib';
import {CfnOutput, RemovalPolicy} from 'aws-cdk-lib';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import {AttributeType, BillingMode} from "aws-cdk-lib/aws-dynamodb"
import {Construct} from 'constructs';
import {DYNAMO_TABLE_NAME} from "./constants";

export class DataStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ddb = new dynamodb.Table(this, 'AiLogTable', {
      tableName: DYNAMO_TABLE_NAME,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      partitionKey: {
        name: "hashKey",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "sortKey",
        type: AttributeType.STRING
      }
    });

    new CfnOutput(this, 'AiLogDynamoTableOutput', {
      value: ddb.tableArn,
      exportName: 'AiLogDynamoTable'
    })


  }
}
