import {AiLogStack, TStackProps} from "./AiLogStack";
import {Construct} from "constructs";
import {SERVICE_FN_NAME} from "ailog-common";
import {ITable} from "aws-cdk-lib/aws-dynamodb";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {ServiceLambda} from "./ServiceLambda";

type ServiceStackProps = TStackProps & {
  dynamoTable: ITable
}
export class ServiceStack extends AiLogStack<ServiceStackProps> {
  public readonly proxyFunction: IFunction;
  constructor(scope: Construct, props: ServiceStackProps) {
    super(scope, 'ServiceStack', props);

    this.proxyFunction = new ServiceLambda(this, 'AiLogServiceLambda', {
      functionName: SERVICE_FN_NAME,
      handler: "httpHandler",
      package: 'ailog-service',
      environment: {
        DYNAMO_TABLE_NAME: props.dynamoTable.tableName
      },
    })

    props.dynamoTable.grantReadWriteData(this.proxyFunction);
  }
}