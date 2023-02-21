import {AiLogStack, TStackProps} from "./AiLogStack";
import {Construct} from "constructs";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {SERVICE_FN_NAME} from "ailog-common";
import {ITable} from "aws-cdk-lib/aws-dynamodb";
import {IFunction} from "aws-cdk-lib/aws-lambda";

type ServiceStackProps = TStackProps & {
  dynamoTable: ITable
}
export class ServiceStack extends AiLogStack<ServiceStackProps> {
  public readonly proxyFunction: IFunction;
  constructor(scope: Construct, props: ServiceStackProps) {
    super(scope, 'ServiceStack', props);

    this.proxyFunction = new NodejsFunction(this, 'AiLogServiceLambda', {
      functionName: SERVICE_FN_NAME,
      entry: "../../ailog-service/index.ts",
      handler: "handler",
      environment: {
        DYNAMO_TABLE_NAME: props.dynamoTable.tableName
      },
    })

    props.dynamoTable.grantReadWriteData(this.proxyFunction);
  }
}