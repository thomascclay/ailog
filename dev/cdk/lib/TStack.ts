import * as cdk from "aws-cdk-lib"
import {Construct} from "constructs";
import {OUTPUT_KEYS} from "./constants";
import {Fn} from "aws-cdk-lib";

export type  TStackProps = Omit<cdk.StackProps, 'env'> & { env: {region: string, account: string} }
export class TStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: TStackProps) {
    super(scope, id, props)
  }
  protected output(records: {[key in OUTPUT_KEYS]?: string}) {
    Object.entries(records).map(([key, value]) => {
      new cdk.CfnOutput(this, `${key}Output`, {
        value,
        exportName: key.valueOf()
      })
    })
  }

  protected import(key: OUTPUT_KEYS): string {
    return Fn.importValue(key.valueOf())
  }
}