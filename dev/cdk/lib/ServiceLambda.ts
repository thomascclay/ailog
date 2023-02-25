import {FunctionProps} from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

type ServiceLambdaProps = Pick<FunctionProps, 'handler' | 'functionName' | 'environment'> & {package: "ailog-api" | "ailog-service"}
export class ServiceLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: ServiceLambdaProps) {
    super(scope, id, {
      ...props,
      entry: `../../${props.package}/index.ts`,
    });
  }
}