import {FunctionProps} from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export class ServiceLambda extends NodejsFunction {
  constructor(scope: Construct, id: string, props: Pick<FunctionProps, 'handler' | 'functionName' | 'environment'>) {
    super(scope, id, {
      ...props,
      entry: '../../ailog-service/index.ts',
    });
  }
}