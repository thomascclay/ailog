import * as cdk from 'aws-cdk-lib';
import {RemovalPolicy} from 'aws-cdk-lib';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import {AttributeType, BillingMode} from "aws-cdk-lib/aws-dynamodb"
import {Construct} from 'constructs';
import {DYNAMO_TABLE_NAME} from "./constants";
import {PolicyDocument, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Cors, RestApi} from "aws-cdk-lib/aws-apigateway";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiStack extends cdk.Stack {
  region: string;
  account: string;
  tableArn: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.region = props?.env?.region ?? process.env.DEFAULT_CDK_REGION!
    this.account = props?.env?.account ?? process.env.DEFAULT_CDK_ACCOUNT!
    this.tableArn = `arn:aws:dynamodb:${props?.env?.region ?? process.env.AWS_REGION}:${this.account}:table/${DYNAMO_TABLE_NAME}`

    const apiRole = new Role(this, 'AiLogApiRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        "AiLogApiDynamoPolicy": new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['dynamodb:Get*', 'dynamodb:Query*', 'dynamodb:Put*'],
              resources: []
            })
          ],
        })}
    })

    const api = new RestApi(this, 'AiLogApi', {
      restApiName: 'AI Log API',
      defaultCorsPreflightOptions: { allowOrigins: Cors.ALL_ORIGINS },
    })
  }
}
