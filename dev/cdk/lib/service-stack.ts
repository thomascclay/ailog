import {AiLogStack} from "./AiLogStack";
import {Construct} from "constructs";
import {PolicyDocument, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
// import {FunctionUrl, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import {ARN, DYNAMO_TABLE, SERVICE_FN_NAME, SITE_NAME} from "ailog-common";

export class ServiceStack extends AiLogStack {
  constructor(scope: Construct) {
    super(scope, 'ServiceStack');

    const serviceRole = new Role(this, 'AiLogServiceRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        "AiLogServicePolicy": new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['dynamodb:Get*', 'dynamodb:Query*', 'dynamodb:Put*'],
              resources: [ARN.dynamoTable(this.region, this.account, DYNAMO_TABLE.NAME)]
            })
          ],
        })
      }
    })

    const proxyFunction = new NodejsFunction(this, 'AiLogServiceLambda', {
      functionName: SERVICE_FN_NAME,
      role: serviceRole,
      entry: "../../ailog-service/index.ts",
      handler: "handler",
      environment: {
        DYNAMO_TABLE_NAME: DYNAMO_TABLE.NAME
      },
    })

    // const fnUrl = new FunctionUrl(this, 'AiLogLambdaUrl', {
    //   function: proxyFunction,
    //   cors: {
    //     allowedHeaders: ['*'],
    //     allowedOrigins: [`https://${SITE_NAME.join('.')}`]
    //   },
    //   authType: FunctionUrlAuthType.NONE
    // })
    //
    // this.output({[OUTPUT_KEYS.API_LAMBDA_URL]: fnUrl.url})
  }
}