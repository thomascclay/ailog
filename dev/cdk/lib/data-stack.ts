import * as cdk from 'aws-cdk-lib';
import {CfnOutput, RemovalPolicy} from 'aws-cdk-lib';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import {AttributeType, BillingMode} from "aws-cdk-lib/aws-dynamodb"
import {Construct} from 'constructs';
import {DYNAMO_TABLE_NAME, OUTPUT_KEYS} from "./constants";
import {TStack, TStackProps} from "./TStack";

export class DataStack extends TStack {

  public dynamoTable: dynamodb.Table
  constructor(scope: Construct, id: string, props: TStackProps) {
    super(scope, id, props);

    this.dynamoTable = new dynamodb.Table(this, 'AiLogTable', {
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

    this.output({
      [OUTPUT_KEYS.DDB_ARN]: this.dynamoTable.tableArn
    })

  }
}
