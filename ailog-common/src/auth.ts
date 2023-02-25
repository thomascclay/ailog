import {APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent} from "aws-lambda";
import {DynamoTable, DYNAMO_TABLE} from "ailog-common";
import * as crypto from "crypto";

const response = (effect: 'Deny' | 'Allow') => (event: APIGatewayRequestAuthorizerEvent): APIGatewayAuthorizerResult => {
  return {
    principalId: event.headers?.username ?? 'user',
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
  const authHeader = event.headers?.authorization;
  if (!authHeader) {
    console.error('no "authorization" header');
    return false;
  }
  const username = event.headers?.username;
  if (!username) {
    console.error('no "username" header');
    return false;
  }
  const token = await table.get({
    hashKey: username,
    sortKey: 'token'
  }).then(result => result.token)
  return `Bearer ${token}` === authHeader;
}
export const authorizer: APIGatewayAuthorizerHandler = async (event, context) => {
  console.log('event', JSON.stringify(event));
  console.log('context', JSON.stringify(context));
  const requestEvent = event as APIGatewayRequestAuthorizerEvent;
  if (requestEvent.path === '/login') {
    return response('Allow')(requestEvent)
  }
  else if (await tokenValid(requestEvent)) {
    return response('Allow')(requestEvent)
  }
  else return response('Deny')(requestEvent)
}

const hashPassword = (password: string): string => crypto.createHash('sha256').update(password).digest('hex');

export const login = async (username: string, password: string): Promise<string> => {
  console.debug(`logging in user ${username}`)
  const result = await table.get({
    hashKey: username,
    sortKey: 'password'
  })
  const storedHash = result['hash']
  if (storedHash === hashPassword(password)) {
    const token = crypto.randomBytes(128).toString('hex');
    await table.put({
      hashKey: username,
      sortKey: 'token'
    }, {token})
    return token;
  } else {
    throw new Error('Unauthorized; bad password');
  }
}