import {DynamoDB, AttributeValue} from "@aws-sdk/client-dynamodb";
import * as process from "process";
import {DYNAMO_TABLE, DynamoKeys} from "ailog-common";

const ddb = new DynamoDB({region: process.env.AWS_REGION!});
type DynamoItem = Record<string, AttributeValue>

/**
 * Convert any value to a DynamoDB AttributeValue
 */
const asDynamoValue = (val: any): AttributeValue => {
  if (typeof val === 'string') {
    return {S: val}
  }
  if (typeof val === 'number') {
    return {N: val.toString()}
  }
  if (typeof val === 'boolean') {
    return {BOOL: val}
  }
  if (Array.isArray(val)) {
    return {L: val.map(v => asDynamoValue(v))}
  }
  if (typeof val === 'object') {
    return {M: asDynamoItem(val)}
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

export const flattenDynamoItem = (item: DynamoItem): Record<string, any> => Object.keys(item).reduce((acc, key) => ({
  ...acc,
  [key]: item[key].S || item[key].N || item[key].BOOL || item[key].L || item[key].M
}), {} as Record<string, any>)

export const DynamoTable = (TableName: string) => ({
  put: async (keys: DynamoKeys, item: object) => {
    const Item = asDynamoItem({...keys, ...item});
    console.debug('DynamoTable.put', {TableName, Item});
    const result = await ddb.putItem({TableName, Item})
    console.debug('DynamoTable.put response status code', result.$metadata.httpStatusCode);
  },

  query: async (keys: DynamoKeys): Promise<Array<Record<string, any>>> => {
    const args = {
      TableName,
      KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
      ExpressionAttributeNames: {
        '#hk': DYNAMO_TABLE.HASH_KEY,
        '#sk': DYNAMO_TABLE.SORT_KEY
      },
      ExpressionAttributeValues: {
        ':hk': asDynamoValue(keys.hashKey),
        ':sk': asDynamoValue(keys.sortKey)
      }
    };
    console.debug('DynamoTable.query', args)
    return ddb.query(args).then(({Items}) => Items?.map(flattenDynamoItem) ?? []);
  },

  get: async (keys: DynamoKeys): Promise<Record<string, any>> => {
    const args = {
      TableName,
      Key: asDynamoItem(keys),
    };
    console.debug('DynamoTable.get', args)
    return ddb.getItem(args).then(({Item}) => flattenDynamoItem(Item!))
  }
})