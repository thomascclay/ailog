import assert = require("assert");

export const REGION = process.env.DEFAULT_CDK_REGION ?? process.env.AWS_REGION;
assert(REGION, "REGION must be set");
export const ACCOUNT_ID = process.env.DEFAULT_CDK_ACCOUNT
// assert(ACCOUNT_ID, "ACCOUNT must be set");

export const DYNAMO_TABLE = {
  NAME: 'AiLog',
  HASH_KEY: 'hashKey',
  SORT_KEY: 'sortKey',
}

export type DynamoKeys = {
  hashKey: string,
  sortKey: string,
}
export const ARN = {
  dynamoTable: (region: string, account: string, tableName: string) => `arn:aws:dynamodb:${region}:${account}:table/${tableName}`,
  lambdaFunction: (region: string, account: string, functionName: string) => `arn:aws:lambda:${region}:${account}:function:${functionName}`,
}
export const SITE_NAME = ['ailog', 'tomsplayground.net']
export const API_URL = `api.${SITE_NAME[1]}`
export const SERVICE_FN_NAME = 'AiLogServiceLambda'

// export enum OUTPUT_KEYS {
//   API_LAMBDA_URL = "AiLogApiLambdaUrl",
//   DDB_ARN = "AiLogDynamoTableArn",
// }