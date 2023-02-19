import {inspect} from "util";

export const handler = (event: any, context: any) => {
  console.log('event', inspect(event));
  console.log('context', inspect(context));
  return {
    statusCode: 200
  }
}