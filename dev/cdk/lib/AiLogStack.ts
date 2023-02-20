import * as cdk from "aws-cdk-lib"
import {Construct} from "constructs";
import {ACCOUNT_ID, REGION} from "ailog-common";
import {Fn} from "aws-cdk-lib";

// export type  TStackProps = Omit<cdk.StackProps, 'env'> & { env: {region: string, account: string} }
export class AiLogStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, 'AiLog' + id, {
      ...(props ?? {}),
      env: {
        region: REGION,
        account: ACCOUNT_ID
      }
    })
  }
  // protected output(records: {[key in OUTPUT_KEYS]?: string}) {
  //   Object.entries(records).map(([key, value]) => {
  //     new cdk.CfnOutput(this, `${key}Output`, {
  //       value,
  //       exportName: key.valueOf()
  //     })
  //   })
  // }
  //
  // protected import(key: OUTPUT_KEYS): string {
  //   return Fn.importValue(key.valueOf())
  // }
}