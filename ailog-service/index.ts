import {inspect} from "util";
import {APIGatewayAuthorizerHandler, APIGatewayProxyHandler} from "aws-lambda";
import {rootHandler} from "./src/HttpHandlers";
import {authorizer} from "./src/Authorizer";

export const httpHandler: APIGatewayProxyHandler = rootHandler
export const authHandler: APIGatewayAuthorizerHandler = authorizer;