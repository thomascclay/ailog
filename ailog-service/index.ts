import {APIGatewayProxyHandler} from "aws-lambda";
import {rootHandler} from "./src/HttpHandlers";

export const httpHandler: APIGatewayProxyHandler = rootHandler