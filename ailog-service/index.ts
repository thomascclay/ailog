import {inspect} from "util";
import {APIGatewayProxyHandler} from "aws-lambda";
import {putFeedback} from "./src/FeedbackService";

const handlePost = (body: any) => {
  console.log('handlePost', inspect(body));
  putFeedback(body)
      .then(_ => ({
        statusCode: 200,
        body: 'OK'
      }))
      .catch(err => {
        console.error('Error', err);
        return {
          statusCode: 500,
          body: inspect(err)
        }
      })
}
export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log('event', inspect(event));
  console.log('context', inspect(context));

  const body = event.body ? JSON.parse(event.body) : null;
  switch (`${event.httpMethod} ${event.path}`) {
    case 'POST /':
      if (!event.body) {
        return {
          statusCode: 400,
          body: 'No body'
        }
      }
      handlePost(body);
      return {
        statusCode: 200,
        body,
      };
    default:
      return {
        statusCode: 404,
        body: `Cannot ${event.httpMethod} ${event.path}`
      }
  }
}