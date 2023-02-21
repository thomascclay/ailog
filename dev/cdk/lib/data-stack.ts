import { RemovalPolicy} from 'aws-cdk-lib';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import {AttributeType, BillingMode} from "aws-cdk-lib/aws-dynamodb"
import {Construct} from 'constructs';
import {AiLogStack, TStackProps} from "./AiLogStack";
import {DYNAMO_TABLE} from "ailog-common";

type DataStackProps = TStackProps & {
  tableName: string
}
export class DataStack extends AiLogStack<DataStackProps> {

  public dynamoTable: dynamodb.Table
  constructor(scope: Construct, props: DataStackProps) {
    super(scope, 'DataStack', props);

    this.dynamoTable = new dynamodb.Table(this, 'AiLogTable', {
      tableName: props.tableName,
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
