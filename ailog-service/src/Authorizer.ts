import {APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent} from "aws-lambda";
import {DynamoTable} from "./dynamo";
import {DYNAMO_TABLE} from "ailog-common";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

const response = (effect: 'Deny' | 'Allow') => (event: APIGatewayRequestAuthorizerEvent): APIGatewayAuthorizerResult => {
  return {
    principalId: event.requestContext.identity.user ?? 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: event.methodArn
        }
      ]
    }
  }
}

const table = DynamoTable(DYNAMO_TABLE.NAME);

const tokenValid = async (event: APIGatewayRequestAuthorizerEvent): Promise<boolean> => {
  const authHeader = event.headers?.Authorization;
  if (!authHeader) {
    return false;
  }
  const username = event.headers?.Username;
  if (!username) {
    return false;
  }
  const result = await table.query({
    hashKey: username,
    sortKey: 'token'
  })
  return result.length > 0 && result[0].token === authHeader;
}
export const authorizer: APIGatewayAuthorizerHandler = async (event, context) => {
  console.log('event', JSON.stringify(event));
  console.log('context', JSON.stringify(context));
  const requestEvent = event as APIGatewayRequestAuthorizerEvent;
  if (await tokenValid(requestEvent)) {
    return response('Allow')(requestEvent)
  }
  return response('Deny')(requestEvent)
}

export const login = async (username: string, password: string): Promise<string> => {
  console.debug(`logging in user ${username}`)
  const result = await table.query({
    hashKey: username,
    sortKey: 'password'
  })
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, result[0].password, (err, res) => {
      if (err) {
        console.error('Error', err);
        reject(err)
      }
      if (res) {
        const token = crypto.randomBytes(128).toString('hex');
        table.put({
          hashKey: username,
          sortKey: 'token'
        }, {token}).then(_ => {
          resolve(token)
        }).catch(reject);
      } else {
        reject('Unauthorized; bad password');
      }
    });
  });
}