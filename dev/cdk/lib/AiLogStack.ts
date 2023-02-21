import * as cdk from "aws-cdk-lib"
import {Construct} from "constructs";
import {ACCOUNT_ID, REGION} from "ailog-common";

export type TStackProps = Omit<cdk.StackProps, 'env'>
    // & { env: {region: string, account: string} }
    & { stage: string }

export class AiLogStack<T extends TStackProps> extends cdk.Stack {

  constructor(scope: Construct, id: string, props: T) {
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