import {APIGatewayAuthorizerHandler} from "aws-lambda";
import {authorizer} from "ailog-common";
export const authHandler: APIGatewayAuthorizerHandler = authorizer;