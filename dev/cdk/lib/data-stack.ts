import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy} from 'aws-cdk-lib';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import {AttributeType, BillingMode} from "aws-cdk-lib/aws-dynamodb"
import {Construct} from 'constructs';
import {DYNAMO_TABLE} from "ailog-common";
import {AiLogStack} from "./AiLogStack";

export class DataStack extends AiLogStack {

  public dynamoTable: dynamodb.Table
  constructor(scope: Construct) {
    super(scope, 'DataStack');

    this.dynamoTable = new dynamodb.Table(this, 'AiLogTable', {
      tableName: DYNAMO_TABLE.NAME,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      partitionKey: {
        name: DYNAMO_TABLE.HASH_KEY,
        type: AttributeType.STRING
      },
      sortKey: {
        name: DYNAMO_TABLE.SORT_KEY,
        type: AttributeType.STRING
      }
    });
  }
}
