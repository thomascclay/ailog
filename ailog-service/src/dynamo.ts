import {DynamoDB, AttributeValue} from "@aws-sdk/client-dynamodb";
import * as process from "process";
import {DYNAMO_TABLE, DynamoKeys} from "ailog-common";

const ddb = new DynamoDB({region: process.env.AWS_REGION!});
type DynamoItem = Record<string, AttributeValue>

/**
 * Convert any value to a DynamoDB AttributeValue
 */
const asDynamoValue = (val: any): AttributeValue => {
  if(typeof val === 'string') {
    return { S: val }
  }
  if(typeof val === 'number') {
    return { N: val.toString() }
  }
  if(typeof val === 'boolean') {
    return { BOOL: val }
  }
  if(Array.isArray(val)) {
    return { L: val.map(v => asDynamoValue(v)) }
  }
  if(typeof val === 'object') {
    return { M: asDynamoItem(val) }
  }
  throw new Error(`Cannot convert ${val} to DynamoDB AttributeValue`)
}

/**
 * Convert a Feedback object to a DynamoDB Item
 * @param item
 */
export const asDynamoItem = (item: Record<string, any>): DynamoItem => Object.keys(item).reduce((acc, key) => ({
    ...acc,
    [key]: asDynamoValue(item[key])
  }), {} as DynamoItem);

export const DynamoTable = (TableName: string) => ({
  put: async (keys: DynamoKeys, item: object) => ddb.putItem({
    TableName,
    Item: asDynamoItem({...keys, ...item})
  }),
  query: async (keys: DynamoKeys) => ddb.query({
    TableName,
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#hk': DYNAMO_TABLE.HASH_KEY,
      '#sk': DYNAMO_TABLE.SORT_KEY
    }
  }).then(({Items}) => Items?.map(item => Object.keys(item).reduce((acc, key) => ({
    ...acc,
    [key]: item[key].S || item[key].N || item[key].BOOL || item[key].L || item[key].M
  }), {} as Record<string, any>)) || [])
})