import {TStack, TStackProps} from "./TStack";
import {Construct} from "constructs";
import {PolicyDocument, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {FunctionUrl, FunctionUrlAuthType} from "aws-cdk-lib/aws-lambda";
import {API_FN_NAME, DYNAMO_TABLE_NAME, OUTPUT_KEYS, SITE_NAME} from "./constants";

export class ServiceStack extends TStack {
  constructor(scope: Construct, id: string, props: TStackProps) {
    super(scope, id, props);

    const serviceRole = new Role(this, 'AiLogApiRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        "AiLogApiDynamoPolicy": new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ['dynamodb:Get*', 'dynamodb:Query*', 'dynamodb:Put*'],
              resources: [this.import(OUTPUT_KEYS.DDB_ARN)]
            })
          ],
        })
      }
    })

    const proxyFunction = new NodejsFunction(this, 'AiLogApiLambda', {
      functionName: API_FN_NAME,
      role: serviceRole,
      entry: "../../ailog-api/index.ts",
      handler: "handler",
      environment: {
        DYNAMO_TABLE_NAME
      }
    })

    const fnUrl = new FunctionUrl(this, 'AiLogApiFnUrl', {
      function: proxyFunction,
      cors: {
        allowedHeaders: ['*'],
        allowedOrigins: [`https://${SITE_NAME.join('.')}`]
      },
      authType: FunctionUrlAuthType.NONE
    })

    this.output({[OUTPUT_KEYS.API_LAMBDA_URL]: fnUrl.url})
  }
}